import { sessionTimeoutConfig } from '@/configs/session.config'

/** Token lifetime in this browser's clock (ms since the epoch). */
export interface TokenWindow {
    issuedAt: number
    expiresAt: number
}

/** Messages exchanged between admin tabs of the same browser. */
export type SessionSyncMessage =
    | { type: 'activity'; at: number }
    /** A refresh succeeded. `extendedAt` is set when it came from "Sí, continuar". */
    | { type: 'refreshed'; token: TokenWindow; extendedAt?: number }
    | { type: 'logout' }

export interface SessionSync {
    post: (message: SessionSyncMessage) => void
    close: () => void
}

function isMessage(value: unknown): value is SessionSyncMessage {
    return (
        typeof value === 'object' &&
        value !== null &&
        ['activity', 'refreshed', 'logout'].includes((value as { type?: unknown }).type as string)
    )
}

/**
 * BroadcastChannel when available, otherwise `storage` events (which only fire in the other
 * tabs). Every browser API is wrapped: private modes and old browsers may throw, and the
 * timeout must keep working in a single tab even when sync is impossible.
 */
export function openSessionSync(onMessage: (message: SessionSyncMessage) => void): SessionSync {
    const { channelName, storageKey } = sessionTimeoutConfig

    try {
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel(channelName)
            channel.onmessage = (event: MessageEvent<unknown>) => {
                if (isMessage(event.data)) onMessage(event.data)
            }
            return {
                post: (message) => {
                    try {
                        channel.postMessage(message)
                    } catch {
                        // A closed channel or an uncloneable value: sync is best effort.
                    }
                },
                close: () => {
                    try {
                        channel.close()
                    } catch {
                        // Already closed.
                    }
                },
            }
        }
    } catch {
        // Fall through to the storage fallback.
    }

    const onStorage = (event: StorageEvent) => {
        if (event.key !== storageKey || !event.newValue) return
        try {
            const parsed = (JSON.parse(event.newValue) as { message?: unknown }).message
            if (isMessage(parsed)) onMessage(parsed)
        } catch {
            // Malformed value written by something else.
        }
    }

    try {
        window.addEventListener('storage', onStorage)
    } catch {
        return { post: () => undefined, close: () => undefined }
    }

    return {
        post: (message) => {
            try {
                // The nonce makes repeated identical messages still change the value.
                localStorage.setItem(
                    storageKey,
                    JSON.stringify({ message, nonce: `${Date.now()}-${Math.random()}` }),
                )
            } catch {
                // Storage disabled or full.
            }
        },
        close: () => {
            try {
                window.removeEventListener('storage', onStorage)
            } catch {
                // Nothing to clean up.
            }
        },
    }
}
