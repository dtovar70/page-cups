import type { ClassNames } from 'react-day-picker'

/*
 * Brand styling shared by every react-day-picker calendar (DatePicker, DateRangePicker). Kept
 * out of the ui barrel for the same reason as the pickers: it only matters where a calendar is.
 */

const NAV_BUTTON_CLASS =
    'flex size-9 items-center justify-center rounded-full text-ink-soft transition hover:bg-blush-100 hover:text-blush-700 focus-visible:ring-2 focus-visible:ring-blush-400 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30 aria-disabled:pointer-events-none aria-disabled:opacity-30'

/**
 * Month grid, navigation, today dot and disabled days; modes add their own selection look.
 * Today is tinted only while unselected, so a picked today stays white on blush.
 */
export const CALENDAR_CLASSES: Partial<ClassNames> = {
    root: 'group/calendar relative',
    months: 'relative flex flex-col gap-6 min-[860px]:flex-row min-[860px]:gap-8',
    month: 'space-y-2',
    month_caption: 'flex h-10 items-center justify-center',
    caption_label: 'font-display text-base font-semibold text-ink capitalize',
    nav: 'absolute inset-x-0 top-0 z-10 flex h-10 items-center justify-between',
    button_previous: NAV_BUTTON_CLASS,
    button_next: NAV_BUTTON_CLASS,
    month_grid: 'border-collapse',
    weekdays: '',
    weekday: 'h-8 w-10 pb-1 text-[0.7rem] font-bold text-ink-soft/80 uppercase',
    week: '',
    day: 'p-0 py-0.5 text-center text-sm',
    day_button:
        'relative mx-auto flex size-10 items-center justify-center rounded-full font-semibold text-ink transition-colors hover:bg-blush-100 hover:text-blush-800 focus-visible:ring-2 focus-visible:ring-blush-400 focus-visible:ring-offset-1 focus-visible:outline-none',
    today: '[&:not([data-selected])>button]:text-blush-600 [&>button]:after:absolute [&>button]:after:bottom-1 [&>button]:after:left-1/2 [&>button]:after:size-1 [&>button]:after:-translate-x-1/2 [&>button]:after:rounded-full [&>button]:after:bg-current',
    selected: '',
    disabled:
        '[&>button]:cursor-not-allowed [&>button]:text-ink-soft/35 [&>button]:hover:bg-transparent [&>button]:hover:text-ink-soft/35',
    outside: 'invisible',
    hidden: 'invisible',
    focused: '',
}

/** A picked day on its own: the solid blush dot (also the ends of a range). */
export const CALENDAR_SELECTED_DAY_CLASS =
    '[&>button]:bg-blush-500 [&>button]:text-white [&>button]:hover:bg-blush-600 [&>button]:hover:text-white'
