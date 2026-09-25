import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'

import { RouteFallback } from '@/components/route/RouteFallback'
import { ADMIN_ROUTES, adminLoginState } from '@/constants/route.constant'
import { useSessionStore } from '@/store/sessionStore'
import { useSession } from '@/views/admin/hooks/useSession'

export interface RequireAdminProps {
    children: ReactNode
}

/**
 * Gate for the whole back office. While the session check runs the global loader owns the
 * screen; without a session the user goes to the login page, which brings them back here
 * (and, when the session timed out, says why). Both travel in navigation state, so the
 * address bar reads a plain `/admin/login`.
 */
export function RequireAdmin({ children }: RequireAdminProps) {
    const { data: user, isPending, isError } = useSession()
    const location = useLocation()
    const endReason = useSessionStore((state) => state.endReason)

    if (isPending) return <RouteFallback message="Verificando tu sesión…" />

    if (isError || !user) {
        const next = `${location.pathname}${location.search}`
        return (
            <Navigate
                to={ADMIN_ROUTES.login}
                state={adminLoginState(next, endReason ?? undefined)}
                replace
            />
        )
    }

    return children
}
