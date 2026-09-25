import { apiConfig } from '@/configs/api.config'
import { ApiError, type ApiFieldError } from '@/services/errors'

type QueryValue = string | number | boolean | undefined | null | readonly (string | number)[]

export type QueryParams = Record<string, QueryValue>

export interface RequestOptions {
    query?: QueryParams
    /** Plain objects are sent as JSON; `FormData` is sent as multipart as-is. */
    body?: unknown
    signal?: AbortSignal
}

const NETWORK_ERROR_MESSAGE =
    'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.'

const STATUS_FALLBACK_MESSAGES: Record<number, string> = {
    401: 'Debes iniciar sesión para continuar.',
    403: 'No tienes permisos para realizar esta acción.',
    404: 'No encontramos lo que buscabas.',
    429: 'Demasiadas solicitudes. Espera un minuto e intenta de nuevo.',
}

function buildUrl(path: string, query?: QueryParams): string {
    const url = new URL(`${apiConfig.baseUrl}${path}`)
    if (!query) return url.toString()

    for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null || value === '') continue
        if (Array.isArray(value)) {
            if (value.length) url.searchParams.set(key, value.join(','))
            continue
        }
        url.searchParams.set(key, String(value))
    }
    return url.toString()
}

interface ErrorPayload {
    message?: unknown
    details?: unknown
    [key: string]: unknown
}

async function toApiError(response: Response): Promise<ApiError> {
    const payload = (await response.json().catch(() => null)) as ErrorPayload | null
    // Nest returns `message` as a string, or as a string[] for some built-in exceptions.
    const rawMessage = payload?.message
    const message =
        typeof rawMessage === 'string'
            ? rawMessage
            : Array.isArray(rawMessage) && typeof rawMessage[0] === 'string'
              ? rawMessage[0]
              : (STATUS_FALLBACK_MESSAGES[response.status] ??
                'Ocurrió un error inesperado. Intenta de nuevo.')
    const details = Array.isArray(payload?.details) ? (payload.details as ApiFieldError[]) : []
    return new ApiError(response.status, message, details, payload ?? {})
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
    const { query, body, signal } = options
    const isFormData = body instanceof FormData
    const headers: HeadersInit = { Accept: 'application/json' }
    if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json'

    let response: Response
    try {
        response = await fetch(buildUrl(path, query), {
            method,
            headers,
            credentials: 'include',
            signal,
            body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
        })
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') throw error
        throw new ApiError(0, NETWORK_ERROR_MESSAGE)
    }

    if (!response.ok) throw await toApiError(response)
    if (response.status === 204) return undefined as T

    const text = await response.text()
    return (text ? JSON.parse(text) : undefined) as T
}

/** GET of a binary file (e.g. a PDF). Errors are parsed like any other call. */
async function requestBlob(
    path: string,
    options: Omit<RequestOptions, 'body'> = {},
): Promise<Blob> {
    let response: Response
    try {
        response = await fetch(buildUrl(path, options.query), {
            credentials: 'include',
            signal: options.signal,
        })
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') throw error
        throw new ApiError(0, NETWORK_ERROR_MESSAGE)
    }
    if (!response.ok) throw await toApiError(response)
    return response.blob()
}

/** Thin typed wrapper over `fetch`: JSON in/out, cookies included, errors as `ApiError`. */
export const apiClient = {
    get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
        request<T>('GET', path, options),
    getBlob: (path: string, options?: Omit<RequestOptions, 'body'>) => requestBlob(path, options),
    post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
        request<T>('POST', path, { ...options, body }),
    put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
        request<T>('PUT', path, { ...options, body }),
    patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
        request<T>('PATCH', path, { ...options, body }),
    delete: <T = void>(path: string, options?: RequestOptions) =>
        request<T>('DELETE', path, options),
} as const
