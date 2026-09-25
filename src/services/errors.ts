/** Thrown when a requested resource does not exist (HTTP 404 or a missing mock record). */
export class NotFoundError extends Error {
    readonly resource: string

    constructor(resource: string, identifier: string) {
        super(`No encontramos ${resource} con el identificador "${identifier}".`)
        this.name = 'NotFoundError'
        this.resource = resource
    }
}

/** Per-field validation errors, as returned by the API's global validation pipe. */
export interface ApiFieldError {
    field: string
    errors: string[]
}

/** Any non-2xx API response. `message` is the backend's user-facing (Spanish) message. */
export class ApiError extends Error {
    readonly status: number
    readonly details: ApiFieldError[]
    /** Machine-readable reason some endpoints add, e.g. `EXCHANGE_RATE_UNAVAILABLE`. */
    readonly code: string | undefined
    /** The whole error body, for endpoints that send extra data (e.g. per-line problems). */
    readonly payload: Record<string, unknown>

    constructor(
        status: number,
        message: string,
        details: ApiFieldError[] = [],
        payload: Record<string, unknown> = {},
    ) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.details = details
        this.payload = payload
        this.code = typeof payload.code === 'string' ? payload.code : undefined
    }
}

export function isApiError(error: unknown, status?: number): error is ApiError {
    return error instanceof ApiError && (status === undefined || error.status === status)
}

/** Best user-facing message for any thrown value. */
export function getErrorMessage(
    error: unknown,
    fallback = 'Ocurrió un error inesperado. Intenta de nuevo.',
): string {
    if (error instanceof Error && error.message) return error.message
    return fallback
}
