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
    /** First product photo at the time it was added; absent for illustrated products. */
    imageUrl?: string
    unitPrice: number
    quantity: number
    /** Text, name or date to print ("" when none). Part of the line identity. */
    personalization: string
    /** The product is tagged `personalizable`, so the text can be edited from the cart. */
    personalizable: boolean
}

export interface CartLineTotals {
    subtotal: number
    itemCount: number
    shipping: number
    total: number
}
