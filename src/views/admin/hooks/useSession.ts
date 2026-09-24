import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { AdminSession, LoginCredentials } from '@/@types/admin'
import { queryKeys } from '@/constants/query-keys.constant'
import { AuthService } from '@/services/AuthService'

/** Current admin user, `null` when logged out, `undefined` while the first check runs. */
export function useSession() {
    return useQuery<AdminSession | null>({
        queryKey: queryKeys.session,
        queryFn: AuthService.getSession,
        staleTime: 5 * 60_000,
        retry: false,
    })
}

export function useLogin() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => AuthService.login(credentials),
        onSuccess: (user) => {
            queryClient.setQueryData(queryKeys.session, user)
        },
    })
}

/** Forgets the session and every admin cache locally (no request). */
export function useClearSession() {
    const queryClient = useQueryClient()

    return useCallback(() => {
        queryClient.removeQueries({ queryKey: queryKeys.admin.all })
        queryClient.setQueryData(queryKeys.session, null)
    }, [queryClient])
}

export function useLogout() {
    const clearSession = useClearSession()

    return useMutation({
        mutationFn: () => AuthService.logout(),
        // Even if the request fails, the user asked to leave: forget the session locally.
        onSettled: clearSession,
    })
}
