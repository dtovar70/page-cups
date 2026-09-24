import type { AdminSession, LoginCredentials } from '@/@types/admin'
import { apiClient } from '@/services/ApiClient'
import { isApiError } from '@/services/errors'

/** Resolves to `null` when there is no valid session (HTTP 401) instead of throwing. */
async function getSession(): Promise<AdminSession | null> {
    try {
        return await apiClient.get<AdminSession>('/auth/me')
    } catch (error) {
        if (isApiError(error, 401)) return null
        throw error
    }
}

export const AuthService = {
    getSession,
    login: (credentials: LoginCredentials) =>
        apiClient.post<AdminSession>('/auth/login', credentials),
    /** Re-issues the session cookie for another full idle period. */
    refresh: () => apiClient.post<AdminSession>('/auth/refresh'),
    logout: () => apiClient.post<void>('/auth/logout'),
} as const
