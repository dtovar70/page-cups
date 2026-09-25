import {
    addDays,
    endOfMonth,
    format,
    isSameDay,
    isSameYear,
    startOfMonth,
    subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'

import { todayInCaracas } from '@/utils/formatDate'

/**
 * Calendar days ("YYYY-MM-DD") as local-midnight `Date`s and back. The API filters by Caracas
 * days, so the day is the value; the local `Date` is only what the calendar widget draws.
 */
const DAY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export interface DayRange {
    from?: string
    to?: string
}

export interface DateRangeDraft {
    from?: Date
    to?: Date
}

export function isCalendarDay(value: string | null | undefined): value is string {
    return typeof value === 'string' && DAY_PATTERN.test(value)
}

export function parseCalendarDay(day: string | undefined): Date | undefined {
    const match = day ? DAY_PATTERN.exec(day) : null
    if (!match) return undefined
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

export function toCalendarDay(date: Date): string {
    return format(date, 'yyyy-MM-dd')
}

/** Today in Caracas, whatever the browser's time zone. */
export function caracasToday(): Date {
    return parseCalendarDay(todayInCaracas()) as Date
}

/** "12 sep 2026", "12 sep – 24 sep 2026" or "28 dic 2025 – 3 ene 2026". */
export function formatDayRange(from: Date, to: Date = from): string {
    const day = (date: Date, withYear: boolean) =>
        format(date, withYear ? 'd MMM yyyy' : 'd MMM', { locale: es })
    if (isSameDay(from, to)) return day(from, true)
    return `${day(from, !isSameYear(from, to))} – ${day(to, true)}`
}

export interface RangePreset {
    id: string
    label: string
    range: (today: Date) => { from: Date; to: Date }
}

export const DATE_RANGE_PRESETS: readonly RangePreset[] = [
    { id: 'today', label: 'Hoy', range: (today) => ({ from: today, to: today }) },
    {
        id: 'yesterday',
        label: 'Ayer',
        range: (today) => ({ from: addDays(today, -1), to: addDays(today, -1) }),
    },
    {
        id: 'last7',
        label: 'Últimos 7 días',
        range: (today) => ({ from: addDays(today, -6), to: today }),
    },
    {
        id: 'last30',
        label: 'Últimos 30 días',
        range: (today) => ({ from: addDays(today, -29), to: today }),
    },
    {
        id: 'thisMonth',
        label: 'Este mes',
        range: (today) => ({ from: startOfMonth(today), to: today }),
    },
    {
        id: 'lastMonth',
        label: 'Mes pasado',
        range: (today) => {
            const previous = subMonths(today, 1)
            return { from: startOfMonth(previous), to: endOfMonth(previous) }
        },
    },
]
