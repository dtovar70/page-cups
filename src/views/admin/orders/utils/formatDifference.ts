import { formatVeNumber } from '@/utils/formatBolivares'

/** Paid minus expected, signed: "−760,69" / "+12,00". */
export function formatDifference(amount: number): string {
    return `${amount > 0 ? '+' : '−'}${formatVeNumber(Math.abs(amount))}`
}
