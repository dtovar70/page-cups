import { useEffect, useState, useSyncExternalStore } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/constants/query-keys.constant'
import { AuthService } from '@/services/AuthService'
import { useSessionStore } from '@/store/sessionStore'
import { useClearSession, useLogout, useSession } from '@/views/admin/hooks/useSession'
import { SessionTimeoutDialog } from '@/views/admin/session/components/SessionTimeoutDialog'
import { SessionTimeoutController } from '@/views/admin/session/SessionTimeoutController'

/**
 * Admin inactivity timeout. Mounted only inside `RequireAdmin`, so the storefront and the
 * login page never run it. Timing rules live in `SessionTimeoutController` and
 * `configs/session.config.ts`.
 */
export function SessionTimeoutManager() {
    const queryClient = useQueryClient()
    const { data: session, dataUpdatedAt } = useSession()
    const { mutate: requestLogout } = useLogout()
    const clearSession = useClearSession()
    const setEndReason = useSessionStore((state) => state.setEndReason)
    const [controller] = useState(() => new SessionTimeoutController())
    const snapshot = useSyncExternalStore(controller.subscribe, controller.getSnapshot)

    useEffect(() => {
        controller.setHandlers({
            refresh: AuthService.refresh,
            onRefreshed: (next) => queryClient.setQueryData(queryKeys.session, next),
            onExpired: () => {
                // Reason first, so `RequireAdmin` sends the admin to the login page with the
                // notice (and `next`) as soon as the session is cleared.
                setEndReason('inactividad')
                clearSession()
                // Existing logout: clears the cookie server-side and the admin caches.
                requestLogout()
            },
        })
    }, [controller, queryClient, setEndReason, clearSession, requestLogout])

    useEffect(() => {
        controller.start()
        return () => controller.stop()
    }, [controller])

    useEffect(() => {
        if (session) controller.applySession(session, dataUpdatedAt)
    }, [controller, session, dataUpdatedAt])

    // Successful admin API calls count as activity (the prompt ignores them while open).
    useEffect(() => {
        const unsubscribeQueries = queryClient.getQueryCache().subscribe((event) => {
            if (
                event.type === 'updated' &&
                event.action.type === 'success' &&
                !event.action.manual &&
                event.query.queryKey[0] === queryKeys.admin.all[0]
            ) {
                controller.recordActivity()
            }
        })
        const unsubscribeMutations = queryClient.getMutationCache().subscribe((event) => {
            if (event.type === 'updated' && event.action.type === 'success') {
                controller.recordActivity()
            }
        })
        return () => {
            unsubscribeQueries()
            unsubscribeMutations()
        }
    }, [controller, queryClient])

    return (
        <SessionTimeoutDialog
            snapshot={snapshot}
            onContinue={controller.extend}
            onLogout={controller.endNow}
        />
    )
}
