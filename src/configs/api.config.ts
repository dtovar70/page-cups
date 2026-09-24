const DEFAULT_API_URL = 'http://localhost:3000/api'

export const apiConfig = {
    /** Base URL of the NestJS API, including its `/api` prefix, without a trailing slash. */
    baseUrl: (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/+$/, ''),
} as const
