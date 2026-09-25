import type { StockConflictLine } from '@/@types/order'

/** "Taza X pidió 3, hay 1" (one line of a stock conflict). */
export function describeStockLine(line: StockConflictLine): string {
    return `${line.productName} pidió ${line.requested}, hay ${line.available}`
}

/** Lines still missing units once the conflict was acknowledged. */
export function missingUnits(line: StockConflictLine): number {
    return Math.max(0, line.requested - line.reserved)
}
