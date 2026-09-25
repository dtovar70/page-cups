import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router'

import { RouteFallback } from '@/components/route/RouteFallback'
import { Alert, Button, Card, Input } from '@/components/ui'
import { appConfig } from '@/configs/app.config'
import { isSessionEndReason, SESSION_END_NOTICES } from '@/configs/session.config'
import { ADMIN_ROUTES, adminLoginState } from '@/constants/route.constant'
import { NOTICE_DISMISS_MS } from '@/constants/ui.constant'
import { getErrorMessage, isApiError } from '@/services/errors'
import { useSessionStore } from '@/store/sessionStore'
import { useSiteContent } from '@/utils/hooks/useSiteContent'
import {
    LOGIN_PASSWORD_MAX_LENGTH,
    loginSchema,
    type LoginValues,
} from '@/views/admin/auth/schema/login.schema'
import { useLogin, useSession } from '@/views/admin/hooks/useSession'

/**
 * Only admin paths are honored (never the login page itself), so `next` can never bounce
 * the user off-site or into a loop. Anything else falls back to the orders page.
 */
function resolveNext(next: string | null | undefined): string {
    if (!next || !next.startsWith(`${ADMIN_ROUTES.root}/`) || next.startsWith('//')) {
        return ADMIN_ROUTES.orders
    }
    return next.startsWith(ADMIN_ROUTES.login) ? ADMIN_ROUTES.orders : next
}

/** Navigation state is untyped (`unknown`): read only the string fields we expect. */
function readLoginState(state: unknown): { next: string | null; reason: string | null } {
    if (typeof state !== 'object' || state === null) return { next: null, reason: null }
    const { next, reason } = state as Record<string, unknown>
    return {
        next: typeof next === 'string' ? next : null,
        reason: typeof reason === 'string' ? reason : null,
    }
}

function loginErrorMessage(error: unknown): string {
    if (isApiError(error, 429)) {
        return `${error.message} Por seguridad limitamos los intentos de inicio de sesión.`
    }
    return getErrorMessage(error, 'No pudimos iniciar sesión. Intenta de nuevo.')
}

export function AdminLoginView() {
    const { general } = useSiteContent()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const fromState = readLoginState(location.state)
    // Old links and bookmarks may still carry `?next=` / `?reason=`: honor them this once.
    const hasLegacyQuery = searchParams.has('next') || searchParams.has('reason')
    const next = resolveNext(fromState.next ?? searchParams.get('next'))
    const endReason = fromState.reason ?? searchParams.get('reason')
    const endNotice = isSessionEndReason(endReason) ? SESSION_END_NOTICES[endReason] : null
    const setEndReason = useSessionStore((state) => state.setEndReason)
    const { data: user, isPending: isCheckingSession } = useSession()
    const login = useLogin()
    /** Counts submits, so a repeated error remounts its alert with a fresh countdown. */
    const [attempt, setAttempt] = useState(0)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    })

    // The reason already travelled in the navigation state; forget it so a later redirect
    // starts clean.
    useEffect(() => {
        setEndReason(null)
    }, [setEndReason])

    // The address bar always reads a plain `/admin/login`: legacy query params move into
    // the navigation state and the URL is replaced with the clean one.
    const legacyReason = hasLegacyQuery && isSessionEndReason(endReason) ? endReason : undefined
    useEffect(() => {
        if (!hasLegacyQuery) return
        void navigate(ADMIN_ROUTES.login, {
            replace: true,
            state: adminLoginState(next, legacyReason),
        })
    }, [hasLegacyQuery, navigate, next, legacyReason])

    /** Hides the notice but keeps `next`, so logging in still returns the admin there. */
    const dismissNotice = () => {
        void navigate(ADMIN_ROUTES.login, { replace: true, state: adminLoginState(next) })
    }

    const onSubmit = handleSubmit((values) => {
        setAttempt((count) => count + 1)
        login.mutate(values, {
            onSuccess: () => void navigate(next, { replace: true }),
        })
    })

    const errorMessage = login.isError ? loginErrorMessage(login.error) : null

    if (isCheckingSession) return <RouteFallback message="Verificando tu sesión…" />
    if (user && !login.isPending) return <Navigate to={next} replace />

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-12">
            <span
                aria-hidden="true"
                className="absolute top-1/4 -left-24 size-80 rounded-full bg-sky-200 opacity-50 blur-3xl"
            />
            <span
                aria-hidden="true"
                className="absolute -right-24 bottom-1/4 size-80 rounded-full bg-blush-200 opacity-50 blur-3xl"
            />

            <Card padding="lg" elevation="lift" className="relative w-full max-w-md space-y-6">
                <div className="flex flex-col items-center gap-3 text-center">
                    <img
                        src={appConfig.logo.src}
                        srcSet={appConfig.logo.srcSet}
                        sizes="64px"
                        alt=""
                        width={64}
                        height={64}
                        className="size-16 rounded-2xl ring-1 ring-ink/5"
                    />
                    <div className="space-y-1">
                        <h1 className="font-display text-3xl text-ink">Panel de administración</h1>
                        <p className="text-sm text-ink-soft">{general.brandName}</p>
                    </div>
                </div>

                <form onSubmit={onSubmit} noValidate className="space-y-5">
                    {endNotice ? (
                        <Alert
                            tone="info"
                            autoDismissMs={NOTICE_DISMISS_MS}
                            onDismiss={dismissNotice}
                        >
                            {endNotice}
                        </Alert>
                    ) : null}
                    {errorMessage ? (
                        // Like the success notices: it drains away, pauses on hover and can be
                        // closed; clearing the mutation error is what removes it.
                        <Alert
                            key={`${attempt}:${errorMessage}`}
                            autoDismissMs={NOTICE_DISMISS_MS}
                            onDismiss={login.reset}
                        >
                            {errorMessage}
                        </Alert>
                    ) : null}

                    <fieldset className="space-y-5" disabled={login.isPending}>
                        <legend className="sr-only">Inicia sesión</legend>
                        <Input
                            label="Correo"
                            type="email"
                            autoComplete="username"
                            autoFocus
                            error={errors.email?.message}
                            {...register('email')}
                        />
                        <Input
                            label="Contraseña"
                            type="password"
                            autoComplete="current-password"
                            maxLength={LOGIN_PASSWORD_MAX_LENGTH}
                            error={errors.password?.message}
                            {...register('password')}
                        />
                    </fieldset>

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={login.isPending}
                        leadingIcon={<LogIn aria-hidden="true" className="size-4" />}
                    >
                        Iniciar sesión
                    </Button>
                </form>
            </Card>
        </main>
    )
}
