import { queryOptions, useQuery } from '@tanstack/react-query'

import type { OrderStatusCatalog, OrderStatusGroupInfo, OrderStatusInfo } from '@/@types/catalog'
import { ORDER_STATUSES, type OrderStatus } from '@/@types/order'
import { queryKeys } from '@/constants/query-keys.constant'
import { CatalogService } from '@/services/CatalogService'

/** "PENDIENTE_VERIFICACION" -> "Pendiente verificacion": shown only when the catalog failed. */
export function prettifyStatusCode(code: string): string {
    const words = code.toLowerCase().split('_').filter(Boolean).join(' ')
    return words.charAt(0).toUpperCase() + words.slice(1)
}

function fallbackStatus(code: OrderStatus): OrderStatusInfo {
    const label = prettifyStatusCode(code)
    const index = ORDER_STATUSES.indexOf(code)
    return {
        code,
        label,
        customerLabel: label,
        customerTitle: null,
        customerDescription: null,
        groupCode: '',
        tone: 'neutral',
        sortOrder: index < 0 ? ORDER_STATUSES.length : index,
        isTerminal: false,
    }
}

/** The catalog with lookups that never fail: a status missing from it is prettified. */
export interface ResolvedOrderStatusCatalog {
    /** Every known status, in catalog order. */
    statuses: OrderStatusInfo[]
    /** The admin tabs, in order. Empty when the catalog could not be loaded. */
    groups: OrderStatusGroupInfo[]
    status: (code: OrderStatus) => OrderStatusInfo
    /** The tab holding a status, if any. */
    groupOf: (code: OrderStatus) => OrderStatusGroupInfo | undefined
}

export function resolveOrderStatusCatalog(
    catalog: OrderStatusCatalog | undefined,
): ResolvedOrderStatusCatalog {
    const byCode = new Map(catalog?.statuses.map((status) => [status.code, status]))
    const statuses = ORDER_STATUSES.map((code) => byCode.get(code) ?? fallbackStatus(code)).sort(
        (a, b) => a.sortOrder - b.sortOrder,
    )
    const groups = catalog?.groups ?? []
    return {
        statuses,
        groups,
        status: (code) => byCode.get(code) ?? fallbackStatus(code),
        groupOf: (code) => groups.find((group) => group.statuses.includes(code)),
    }
}

/** Only the codes, prettified: what the pages show when the catalog cannot be loaded. */
const FALLBACK_CATALOG = resolveOrderStatusCatalog(undefined)

export const orderStatusCatalogQueryOptions = queryOptions({
    queryKey: queryKeys.catalogs.orderStatuses(),
    queryFn: ({ signal }) => CatalogService.getOrderStatuses(signal),
    // Renamed rarely; the admin catalog page invalidates this key after every save.
    staleTime: 30 * 60_000,
    gcTime: Infinity,
    refetchOnWindowFocus: true,
    select: resolveOrderStatusCatalog,
})

/**
 * Labels, badge tones, customer copy and admin tabs of the order statuses
 * (`GET /catalogs/order-statuses`), loaded once per session. Never undefined: while loading
 * and when the request fails it is the prettified codes, so nothing crashes; `isLoading` lets
 * a page wait instead of flashing those.
 */
export function useOrderStatusCatalog(): ResolvedOrderStatusCatalog & {
    isLoading: boolean
    isError: boolean
} {
    const query = useQuery(orderStatusCatalogQueryOptions)
    return {
        ...(query.data ?? FALLBACK_CATALOG),
        isLoading: query.isPending && query.fetchStatus !== 'idle',
        isError: query.isError,
    }
}
