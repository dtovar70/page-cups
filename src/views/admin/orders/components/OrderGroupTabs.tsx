import { useEffect, useRef, type KeyboardEvent } from 'react'

import type { OrderStatus } from '@/@types/order'
import { Skeleton } from '@/components/ui'
import { cn } from '@/utils/cn'
import {
    ALL_ORDERS_GROUP_ID,
    groupCount,
    type OrderGroup,
} from '@/views/admin/orders/utils/orderGroups'

const SKELETON_TABS = 5

export interface OrderGroupTabsProps {
    /** The catalog's tabs plus "Todos", in order. */
    groups: readonly OrderGroup[]
    /** The status catalog is still loading: placeholders instead of tabs. */
    isLoading?: boolean
    active: string | null
    counts: Record<OrderStatus, number> | undefined
    /** `id` prefix shared with the tab panel (`${idPrefix}-tab-${group}` / `${idPrefix}-panel`). */
    idPrefix: string
    onSelect: (group: string) => void
}

/**
 * The orders page's main switch, one tab per workflow step. A segmented control that scrolls
 * sideways on phones instead of wrapping into a wall of chips. Arrow keys move between tabs
 * (and select them), following the ARIA tabs pattern.
 */
export function OrderGroupTabs({
    groups,
    isLoading = false,
    active,
    counts,
    idPrefix,
    onSelect,
}: OrderGroupTabsProps) {
    const scrollerRef = useRef<HTMLDivElement>(null)

    /* On phones the row scrolls: bring the selected tab into view ("Todos" sits past the edge). */
    useEffect(() => {
        const scroller = scrollerRef.current
        const tab = active ? document.getElementById(`${idPrefix}-tab-${active}`) : null
        if (!scroller || !tab || scroller.scrollWidth <= scroller.clientWidth) return
        // The scroller is `relative`, so it is the offset parent.
        const tabStart = tab.offsetLeft
        const tabEnd = tabStart + tab.offsetWidth
        if (tabStart < scroller.scrollLeft || tabEnd > scroller.scrollLeft + scroller.clientWidth) {
            scroller.scrollLeft = tabStart - (scroller.clientWidth - tab.offsetWidth) / 2
        }
    }, [active, idPrefix])

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const ids = groups.map((group) => group.id)
        const current = ids.indexOf(active ?? ALL_ORDERS_GROUP_ID)
        const last = ids.length - 1
        const next =
            event.key === 'ArrowRight'
                ? current === last
                    ? 0
                    : current + 1
                : event.key === 'ArrowLeft'
                  ? current === 0
                      ? last
                      : current - 1
                  : event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? last
                      : -1
        const id = ids[next]
        if (!id) return
        event.preventDefault()
        onSelect(id)
        document.getElementById(`${idPrefix}-tab-${id}`)?.focus()
    }

    if (isLoading) {
        return (
            <div className="flex w-max gap-1 rounded-full border-2 border-line bg-white p-1">
                {Array.from({ length: SKELETON_TABS }, (_, index) => (
                    <Skeleton key={index} shape="circle" className="h-9 w-24" />
                ))}
            </div>
        )
    }

    return (
        <div className="-mx-4 [scrollbar-width:none] overflow-x-auto px-4 py-1 sm:mx-0 sm:px-0">
            <div
                role="tablist"
                aria-label="Pedidos por etapa"
                onKeyDown={onKeyDown}
                className="flex w-max gap-1 rounded-full border-2 border-line bg-white p-1"
            >
                {groups.map((group) => {
                    const { id } = group
                    const isActive = id === active
                    const count = groupCount(group, counts)
                    const isUrgent = group.highlight && (count ?? 0) > 0
                    return (
                        <button
                            key={id}
                            id={`${idPrefix}-tab-${id}`}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`${idPrefix}-panel`}
                            tabIndex={
                                isActive || (active === null && id === ALL_ORDERS_GROUP_ID) ? 0 : -1
                            }
                            onClick={() => onSelect(id)}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-full py-2 pr-2.5 pl-4 text-sm font-semibold whitespace-nowrap transition focus-visible:ring-offset-white',
                                isActive
                                    ? 'bg-blush-100 text-blush-800'
                                    : 'text-ink-soft hover:bg-blush-50 hover:text-ink',
                                count === undefined && 'pr-4',
                            )}
                        >
                            {group.label}
                            {count !== undefined ? (
                                <span
                                    className={cn(
                                        'min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs font-bold tabular-nums',
                                        isUrgent
                                            ? 'bg-blush-500 text-white'
                                            : isActive
                                              ? 'bg-white text-blush-700'
                                              : 'bg-line/80 text-ink-soft',
                                    )}
                                >
                                    {count}
                                    {isUrgent ? (
                                        <span className="sr-only"> por revisar</span>
                                    ) : null}
                                </span>
                            ) : null}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
