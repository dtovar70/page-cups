import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate, useSearchParams } from 'react-router'

import { RouteFallback } from '@/components/route/RouteFallback'
import { Alert, Button, Card, Input } from '@/components/ui'
import { appConfig } from '@/configs/app.config'
import { isSessionEndReason, SESSION_END_NOTICES } from '@/configs/session.config'
import { ADMIN_ROUTES } from '@/constants/route.constant'
import { getErrorMessage, isApiError } from '@/services/errors'
import { useSessionStore } from '@/store/sessionStore'
import { useSiteContent } from '@/utils/hooks/useSiteContent'
import { loginSchema, type LoginValues } from '@/views/admin/auth/schema/login.schema'
import { useLogin, useSession } from '@/views/admin/hooks/useSession'

/** Only admin paths are honored, so `?next=` can never bounce the user off-site. */
function resolveNext(next: string | null): string {
    if (!next || !next.startsWith(`${ADMIN_ROUTES.root}/`) || next.startsWith('//')) {
        return ADMIN_ROUTES.products
    }
    return next.startsWith(ADMIN_ROUTES.login) ? ADMIN_ROUTES.products : next
}

function loginErrorMessage(error: unknown): string {
    if (isApiError(error, 429)) {
        return `${error.message} Por seguridad limitamos los intentos de inicio de sesión.`
    }
    return getErrorMessage(error, 'No pudimos iniciar sesión. Intenta de nuevo.')
}

export function AdminLoginView() {
    const { general } = useSiteContent()
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const next = resolveNext(searchParams.get('next'))
    const endReason = searchParams.get('reason')
    const endNotice = isSessionEndReason(endReason) ? SESSION_END_NOTICES[endReason] : null
    const setEndReason = useSessionStore((state) => state.setEndReason)
    const { data: user, isPending: isCheckingSession } = useSession()
    const login = useLogin()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    })

    // The reason already travelled in the URL; forget it so a later redirect starts clean.
    useEffect(() => {
        setEndReason(null)
    }, [setEndReason])

    /** Hides the notice but keeps `next`, so logging in still returns the admin there. */
    const dismissNotice = () => {
        setSearchParams(
            (params) => {
                params.delete('reason')
                return params
            },
            { replace: true },
        )
    }

    const onSubmit = handleSubmit((values) => {
        login.mutate(values, {
            onSuccess: () => void navigate(next, { replace: true }),
        })
    })

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
                        <Alert tone="info" onDismiss={dismissNotice}>
                            {endNotice}
                        </Alert>
                    ) : null}
                    {login.isError ? <Alert>{loginErrorMessage(login.error)}</Alert> : null}

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
