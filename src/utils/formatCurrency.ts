const currencyFormatter = new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
    // Without this the locale renders the ISO code ("USD 12,00") instead of "$12,00".
    currencyDisplay: 'narrowSymbol',
})

export function formatCurrency(amount: number): string {
    return currencyFormatter.format(amount)
}
