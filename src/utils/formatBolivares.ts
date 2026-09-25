const bolivarFormatter = new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})

/** Venezuelan formatting with 2 decimals: 1234.5 -> "1.234,50". */
export function formatVeNumber(amount: number): string {
    return bolivarFormatter.format(amount)
}

/** "Bs 1.234,56". */
export function formatBolivares(amount: number): string {
    return `Bs ${formatVeNumber(amount)}`
}

/** Rate for display, 2 decimals: 854.4637 -> "854,46". */
export function formatRate(rate: number): string {
    return formatVeNumber(rate)
}

/**
 * USD -> bolívares with the same rounding as the API (4-decimal rate, half-up to cents), so the
 * approximate amount in the cart matches the one the order will ask for.
 */
export function usdToBolivares(usd: number, rate: number): number {
    const rateUnits = Math.round(rate * 10_000)
    const cents = Math.round(usd * 100)
    return Math.round((cents * rateUnits) / 10_000) / 100
}
