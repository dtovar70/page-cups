import type { CategorySlug } from '@/@types/product'

/**
 * A cart line stores a render-ready snapshot instead of the whole product so the
 * persisted payload stays small and survives catalog changes.
 */
export interface CartItem {
    lineId: string
    productId: string
    slug: string
    name: string
    category: CategorySlug
    variantId: string
    variantLabel: string
    colorHex: string
    printText: string
    unitPrice: number
    quantity: number
}

export interface CartLineTotals {
    subtotal: number
    itemCount: number
    shipping: number
    total: number
}
