import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ChevronProps } from 'react-day-picker'

import { cn } from '@/utils/cn'

/** Lucide chevrons for the calendars' month navigation. */
export function CalendarChevron({ orientation, className }: ChevronProps) {
    const Icon = orientation === 'left' ? ChevronLeft : ChevronRight
    return <Icon aria-hidden="true" className={cn('size-5', className)} />
}
