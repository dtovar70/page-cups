import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/constants/query-keys.constant'
import { isApiError } from '@/services/errors'

export function createQueryClient(): QueryClient {
    /**
     * A 401 from any call means the admin session is gone (expired, or the cookie was
     * cleared). Marking the session as logged out lets `RequireAdmin` send the user back to
     * the login page from wherever they are, without every screen handling it on its own.
     */
    const handleUnauthorized = (error: unknown) => {
        if (isApiError(error, 401)) queryClient.setQueryData(queryKeys.session, null)
    }

    const queryClient: QueryClient = new QueryClient({
        queryCache: new QueryCache({ onError: handleUnauthorized }),
        mutationCache: new MutationCache({ onError: handleUnauthorized }),
        defaultOptions: {
            queries: {
                staleTime: 60_000,
                gcTime: 5 * 60_000,
                // Client errors (404, 401, 400…) will not fix themselves on a retry.
                retry: (failureCount, error) =>
                    !(isApiError(error) && error.status >= 400 && error.status < 500) &&
                    failureCount < 1,
                refetchOnWindowFocus: false,
            },
        },
    })

    return queryClient
}
