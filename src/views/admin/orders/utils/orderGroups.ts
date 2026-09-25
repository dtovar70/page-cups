import type { OrderStatusGroupInfo, OrderStatusInfo } from '@/@types/catalog'
import { ORDER_STATUSES, type OrderStatus } from '@/@types/order'

/** URL id of the tab that lists every order (`?grupo=todos`); it is not a catalog group. */
export const ALL_ORDERS_GROUP_ID = 'todos'

/** One tab of the orders page: a catalog group, or "Todos". */
export interface OrderGroup {
    /** URL id (`?grupo=`): the catalog code in kebab case, "POR_VERIFICAR" -> "por-verificar". */
    id: string
    label: string
    statuses: readonly OrderStatus[]
    /** Its counter stands out while above zero. */
    highlight: boolean
    /** Shown when the group is empty and nothing else narrows the list. */
    emptyTitle: string
    emptyDescription: string
}

/**
 * Empty-state headings of the seeded tabs. The tabs themselves (label, description, order,
 * statuses) come from the status catalog; a tab added later gets the generic heading.
 */
const EMPTY_TITLES: Partial<Record<string, string>> = {
    POR_VERIFICAR: 'No hay pagos por verificar',
    POR_PAGAR: 'Ningún pedido espera un pago',
    EN_CURSO: 'No hay pedidos en curso',
    CERRADOS: 'Todavía no hay pedidos cerrados',
}

export function groupUrlId(code: string): string {
    return code.toLowerCase().replace(/_/g, '-')
}

/** The catalog's tabs, in order, followed by "Todos". */
export function buildOrderGroups(
    catalogGroups: readonly OrderStatusGroupInfo[],
    statuses: readonly OrderStatusInfo[],
): OrderGroup[] {
    return [
        ...catalogGroups.map((group) => ({
            id: groupUrlId(group.code),
            label: group.label,
            statuses: group.statuses,
            highlight: group.highlight,
            emptyTitle: EMPTY_TITLES[group.code] ?? `No hay pedidos en «${group.label}»`,
            emptyDescription:
                group.description ?? 'Cuando haya pedidos en esta etapa, aparecerán aquí.',
        })),
        {
            id: ALL_ORDERS_GROUP_ID,
            label: 'Todos',
            statuses: statuses.length ? statuses.map((status) => status.code) : ORDER_STATUSES,
            highlight: false,
            emptyTitle: 'Todavía no hay pedidos',
            emptyDescription: 'Cuando un cliente compre en la tienda, su pedido aparecerá aquí.',
        },
    ]
}

export function findOrderGroup(groups: readonly OrderGroup[], id: string | null) {
    return id === null ? undefined : groups.find((group) => group.id === id)
}

/** The narrowest group holding a status, for old links that only carry `?estado=`. */
export function groupOfStatus(groups: readonly OrderGroup[], status: OrderStatus): string {
    return (
        groups.find((group) => group.id !== ALL_ORDERS_GROUP_ID && group.statuses.includes(status))
            ?.id ?? ALL_ORDERS_GROUP_ID
    )
}

export function groupCount(
    group: OrderGroup,
    counts: Record<OrderStatus, number> | undefined,
): number | undefined {
    if (!counts) return undefined
    return group.statuses.reduce((sum, status) => sum + (counts[status] ?? 0), 0)
}
