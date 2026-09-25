/** Venezuela is UTC-4 all year; dates are always shown in that zone. */
const TIME_ZONE = 'America/Caracas'

const dateFormatter = new Intl.DateTimeFormat('es-VE', {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('es-VE', {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
})

const dayFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
})

/** "2026-09-24" (a calendar day) -> "24/09/2026". */
export function formatDay(day: string): string {
    const [year, month, date] = day.split('-')
    return year && month && date ? `${date}/${month}/${year}` : day
}

/** ISO instant -> "24/09/2026". */
export function formatDate(iso: string): string {
    return dateFormatter.format(new Date(iso))
}

/** ISO instant -> "24/09/2026, 3:05 p. m." */
export function formatDateTime(iso: string): string {
    return dateTimeFormatter.format(new Date(iso))
}

/** Today in Caracas, "YYYY-MM-DD" (the value of a date input). */
export function todayInCaracas(): string {
    return dayFormatter.format(new Date())
}
