import type { AdminSession } from '@/@types/admin'
import { sessionTimeoutConfig } from '@/configs/session.config'
import { getErrorMessage, isApiError } from '@/services/errors'
import {
    openSessionSync,
    type SessionSync,
    type SessionSyncMessage,
    type TokenWindow,
} from '@/views/admin/session/sessionSync'

export type SessionTimeoutPhase = 'active' | 'prompt' | 'closed'

export interface SessionTimeoutSnapshot {
    phase: SessionTimeoutPhase
    /** Whole seconds left on the prompt countdown. */
    secondsLeft: number
    /** Share of the countdown still left (1 → 0), for the draining bar. */
    remainingFraction: number
    /** Changes (and is announced) only when the countdown crosses `announceAtSeconds`. */
    announcement: string
    isExtending: boolean
    error: string | null
}

export interface SessionTimeoutHandlers {
    /** `POST /auth/refresh`. */
    refresh: () => Promise<AdminSession>
    /** A refresh succeeded in this tab (update the cached session). */
    onRefreshed: (session: AdminSession) => void
    /** The session ended for inactivity here or in another tab: log out locally. */
    onExpired: () => void
}

/** Activity counts as "after the token was issued" only past this slack (clock rounding). */
const ISSUE_SLACK_MS = 2_000
/** Per-tab random delay so several tabs do not refresh at the same instant. */
const MAX_REFRESH_JITTER_MS = 3_000
/** Countdown repaint interval while the prompt is open. */
const PROMPT_TICK_MS = 250
/** Retry delay after a failed background refresh (network error, 5xx). */
const REFRESH_RETRY_MS = 15_000

const ACTIVITY_EVENTS = [
    'pointerdown',
    'pointermove',
    'keydown',
    'wheel',
    'touchstart',
    'scroll',
] as const

const INITIAL_SNAPSHOT: SessionTimeoutSnapshot = {
    phase: 'active',
    secondsLeft: 0,
    remainingFraction: 1,
    announcement: '',
    isExtending: false,
    error: null,
}

function tokenWindowOf(session: AdminSession, receivedAt: number): TokenWindow {
    const expiresAt = receivedAt + session.session.expiresInSeconds * 1000
    return { issuedAt: expiresAt - session.session.ttlSeconds * 1000, expiresAt }
}

/**
 * Inactivity timeout of the admin session, kept outside React so timers and listeners are
 * plain code. Every decision compares wall-clock timestamps (`Date.now()`), never counts of
 * elapsed timers, so a sleeping laptop or a throttled background tab is judged correctly the
 * moment it runs again.
 *
 * Timeline: last activity → idle limit (prompt opens) → idle limit + prompt (logout).
 * The server token outlives that by a margin and is refreshed in the background while the
 * admin is active, so it never expires before the prompt does.
 */
export class SessionTimeoutController {
    private snapshot = INITIAL_SNAPSHOT
    private readonly listeners = new Set<() => void>()
    private handlers: SessionTimeoutHandlers | null = null

    private running = false
    private idleMs = sessionTimeoutConfig.fallbackIdleMinutes * 60_000
    private promptMs = sessionTimeoutConfig.fallbackPromptSeconds * 1000
    private lastActivity = 0
    private lastBroadcast = 0
    private token: TokenWindow | null = null
    private isRefreshing = false
    private nextRefreshAttemptAt = 0
    private jitterMs = 0
    /** Last countdown threshold announced to screen readers in the current prompt. */
    private announcedThreshold: number | undefined
    private timer: ReturnType<typeof setTimeout> | undefined
    private sync: SessionSync | null = null

    // --- React bindings (useSyncExternalStore) -------------------------------------------

    subscribe = (listener: () => void) => {
        this.listeners.add(listener)
        return () => {
            this.listeners.delete(listener)
        }
    }

    getSnapshot = () => this.snapshot

    setHandlers(handlers: SessionTimeoutHandlers) {
        this.handlers = handlers
    }

    // --- Lifecycle ------------------------------------------------------------------------

    /** Mounting the admin area counts as activity: the admin just logged in or navigated. */
    start() {
        if (this.running) return
        this.running = true
        const now = Date.now()
        this.lastActivity =
            sessionTimeoutConfig.mode === 'fixed' && this.token ? this.token.issuedAt : now
        this.lastBroadcast = 0
        this.jitterMs = Math.random() * MAX_REFRESH_JITTER_MS
        this.setSnapshot(INITIAL_SNAPSHOT)

        for (const type of ACTIVITY_EVENTS) {
            window.addEventListener(type, this.handleActivityEvent, {
                capture: true,
                passive: true,
            })
        }
        window.addEventListener('focus', this.handleResume)
        window.addEventListener('pageshow', this.handleResume)
        window.addEventListener('online', this.handleResume)
        document.addEventListener('visibilitychange', this.handleResume)
        document.addEventListener('resume', this.handleResume)

        this.sync = openSessionSync(this.handleMessage)
        this.broadcastActivity(now)
        this.evaluate()
    }

    stop() {
        if (!this.running) return
        this.running = false
        clearTimeout(this.timer)
        for (const type of ACTIVITY_EVENTS) {
            window.removeEventListener(type, this.handleActivityEvent, { capture: true })
        }
        window.removeEventListener('focus', this.handleResume)
        window.removeEventListener('pageshow', this.handleResume)
        window.removeEventListener('online', this.handleResume)
        document.removeEventListener('visibilitychange', this.handleResume)
        document.removeEventListener('resume', this.handleResume)
        this.sync?.close()
        this.sync = null
    }

    /** Timings and token lifetime from `/auth/me`, login or refresh (`receivedAt` = local ms). */
    applySession(session: AdminSession, receivedAt: number) {
        const { idleMinutes, promptSeconds } = session.session
        this.idleMs = idleMinutes * 60_000
        this.promptMs = promptSeconds * 1000
        this.adoptToken(tokenWindowOf(session, receivedAt))
        if (this.running) this.evaluate()
    }

    // --- Commands from the prompt ---------------------------------------------------------

    /** "Sí, continuar": the only way to leave the prompt without logging out. */
    extend = () => {
        const handlers = this.handlers
        if (!handlers || this.snapshot.phase !== 'prompt' || this.snapshot.isExtending) return
        this.setSnapshot({ ...this.snapshot, isExtending: true, error: null })
        this.isRefreshing = true

        handlers
            .refresh()
            .then((session) => {
                if (!this.running) return
                const now = Date.now()
                const token = tokenWindowOf(session, now)
                this.adoptToken(token)
                this.lastActivity = now
                this.nextRefreshAttemptAt = 0
                this.setSnapshot({ ...INITIAL_SNAPSHOT })
                this.sync?.post({ type: 'refreshed', token, extendedAt: now })
                handlers.onRefreshed(session)
            })
            .catch((error: unknown) => {
                if (!this.running) return
                if (isApiError(error, 401)) {
                    this.expire()
                    return
                }
                this.setSnapshot({
                    ...this.snapshot,
                    isExtending: false,
                    error: getErrorMessage(
                        error,
                        'No pudimos extender tu sesión. Intenta de nuevo.',
                    ),
                })
            })
            .finally(() => {
                this.isRefreshing = false
                if (this.running) this.evaluate()
            })
    }

    /** "No, cerrar sesión". */
    endNow = () => {
        if (this.snapshot.phase !== 'closed') this.expire()
    }

    // --- Activity -------------------------------------------------------------------------

    /** Successful admin API calls count as activity too (see `SessionTimeoutManager`). */
    recordActivity = (at = Date.now()) => {
        if (!this.running || sessionTimeoutConfig.mode === 'fixed') return
        if (this.snapshot.phase !== 'active') return
        if (at - this.lastActivity < sessionTimeoutConfig.activityThrottleMs) return

        // Judge the time that passed first: after a sleep, the first mouse move must not
        // revive a session whose idle limit is already over.
        this.evaluate()
        if (this.snapshot.phase !== 'active') return

        this.lastActivity = at
        this.broadcastActivity(at)
        this.evaluate()
    }

    private handleActivityEvent = () => {
        this.recordActivity()
    }

    /** Wake, tab shown, focus back: re-check first, then count it as activity. */
    private handleResume = () => {
        if (!this.running) return
        this.evaluate()
        if (document.visibilityState === 'visible') this.recordActivity()
    }

    private broadcastActivity(at: number) {
        if (at - this.lastBroadcast < sessionTimeoutConfig.activityBroadcastMs) return
        this.lastBroadcast = at
        this.sync?.post({ type: 'activity', at })
    }

    // --- Other tabs -----------------------------------------------------------------------

    private handleMessage = (message: SessionSyncMessage) => {
        if (!this.running || this.snapshot.phase === 'closed') return

        switch (message.type) {
            case 'activity': {
                if (sessionTimeoutConfig.mode === 'fixed') return
                if (this.snapshot.phase === 'prompt') {
                    // Activity that happened before this tab's idle limit means the prompt
                    // opened early here (timers of two tabs drift); anything later does not
                    // count while the question is on screen.
                    if (message.at >= this.lastActivity + this.idleMs) return
                    this.setSnapshot({ ...INITIAL_SNAPSHOT })
                }
                this.lastActivity = Math.max(this.lastActivity, message.at)
                break
            }
            case 'refreshed': {
                this.adoptToken(message.token)
                if (message.extendedAt !== undefined) {
                    this.lastActivity = Math.max(this.lastActivity, message.extendedAt)
                    this.nextRefreshAttemptAt = 0
                    if (this.snapshot.phase === 'prompt') this.setSnapshot({ ...INITIAL_SNAPSHOT })
                }
                break
            }
            case 'logout': {
                this.close()
                this.handlers?.onExpired()
                return
            }
        }
        this.evaluate()
    }

    // --- Core -----------------------------------------------------------------------------

    private adoptToken(token: TokenWindow) {
        // A cached `/auth/me` response may be older than a refresh another tab already did.
        if (this.token && token.expiresAt <= this.token.expiresAt + ISSUE_SLACK_MS) return
        this.token = token
        // Fixed mode: the limit counts from login or the last "Sí, continuar", i.e. from when
        // the current token was issued, whatever happens in between (reloads included).
        if (sessionTimeoutConfig.mode === 'fixed') this.lastActivity = token.issuedAt
    }

    private refreshThresholdMs(token: TokenWindow): number {
        const ttl = token.expiresAt - token.issuedAt
        const { refreshAfterTokenFraction, minRefreshIntervalMs } = sessionTimeoutConfig
        // Never later than 80% of the lifetime, so the refresh lands before the expiry.
        return Math.min(Math.max(ttl * refreshAfterTokenFraction, minRefreshIntervalMs), ttl * 0.8)
    }

    /** When a background refresh becomes due, or `null` when none is needed. */
    private refreshDueAt(): number | null {
        const token = this.token
        if (sessionTimeoutConfig.mode === 'fixed' || !token || this.isRefreshing) return null
        if (this.lastActivity - token.issuedAt <= ISSUE_SLACK_MS) return null
        return Math.max(
            token.issuedAt + this.refreshThresholdMs(token) + this.jitterMs,
            this.nextRefreshAttemptAt,
        )
    }

    private evaluate() {
        if (!this.running || this.snapshot.phase === 'closed') return
        clearTimeout(this.timer)

        const now = Date.now()
        const idleDeadline = this.lastActivity + this.idleMs
        const promptDeadline = idleDeadline + this.promptMs
        const tokenExpired = this.token !== null && now >= this.token.expiresAt

        // An in-flight "Sí, continuar" may finish just after the countdown: the token margin
        // covers it, so only a truly expired token ends the session meanwhile.
        if (tokenExpired || (now >= promptDeadline && !this.snapshot.isExtending)) {
            this.expire()
            return
        }

        let nextCheck: number
        if (this.snapshot.phase === 'active' && now >= idleDeadline) {
            this.openPrompt()
        }

        if (this.snapshot.phase === 'prompt') {
            this.tickPrompt(now, promptDeadline)
            nextCheck = now + PROMPT_TICK_MS
        } else {
            const refreshAt = this.refreshDueAt()
            if (refreshAt !== null && now >= refreshAt) this.backgroundRefresh(now)
            nextCheck = Math.min(idleDeadline, this.refreshDueAt() ?? Infinity)
        }

        const delay = Math.min(Math.max(nextCheck - now, 0), sessionTimeoutConfig.maxTimerDelayMs)
        this.timer = setTimeout(() => this.evaluate(), delay)
    }

    private backgroundRefresh(now: number) {
        const handlers = this.handlers
        if (!handlers) return
        this.isRefreshing = true
        this.nextRefreshAttemptAt = now + REFRESH_RETRY_MS

        handlers
            .refresh()
            .then((session) => {
                if (!this.running) return
                const token = tokenWindowOf(session, Date.now())
                this.adoptToken(token)
                this.sync?.post({ type: 'refreshed', token })
                handlers.onRefreshed(session)
            })
            .catch((error: unknown) => {
                // A rejected session is over; anything else is retried later.
                if (this.running && isApiError(error, 401)) this.expire()
            })
            .finally(() => {
                this.isRefreshing = false
                if (this.running) this.evaluate()
            })
    }

    private openPrompt() {
        this.announcedThreshold = undefined
        this.setSnapshot({ ...INITIAL_SNAPSHOT, phase: 'prompt' })
    }

    private tickPrompt(now: number, promptDeadline: number) {
        const msLeft = Math.max(0, promptDeadline - now)
        const secondsLeft = Math.ceil(msLeft / 1000)
        const remainingFraction = this.promptMs > 0 ? Math.min(1, msLeft / this.promptMs) : 0
        const reached = sessionTimeoutConfig.announceAtSeconds.filter((s) => secondsLeft <= s)
        const threshold = reached.length ? Math.min(...reached) : undefined

        let { announcement } = this.snapshot
        if (threshold !== undefined && threshold !== this.announcedThreshold) {
            this.announcedThreshold = threshold
            const unit = secondsLeft === 1 ? 'segundo' : 'segundos'
            announcement = `Quedan ${secondsLeft} ${unit} para cerrar tu sesión.`
        }

        this.setSnapshot({ ...this.snapshot, secondsLeft, remainingFraction, announcement })
    }

    private expire() {
        const wasOpen = this.snapshot.phase !== 'closed'
        this.close()
        if (!wasOpen) return
        this.sync?.post({ type: 'logout' })
        this.handlers?.onExpired()
    }

    private close() {
        clearTimeout(this.timer)
        this.setSnapshot({ ...this.snapshot, phase: 'closed', isExtending: false })
    }

    private setSnapshot(next: SessionTimeoutSnapshot) {
        this.snapshot = next
        for (const listener of this.listeners) listener()
    }
}
