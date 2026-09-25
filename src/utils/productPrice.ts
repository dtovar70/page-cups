import type { Product, ProductVariant } from '@/@types/product'

/** What one unit of `variant` costs: the product's base price plus the variant's adjustment. */
export function variantPrice(product: Pick<Product, 'price'>, variant?: ProductVariant): number {
    return product.price + (variant?.priceDelta ?? 0)
}

/** Cheapest and dearest unit price across the variants (the base price when there are none). */
export function priceRange(product: Pick<Product, 'price' | 'variants'>): {
    min: number
    max: number
} {
    if (product.variants.length === 0) return { min: product.price, max: product.price }
    const prices = product.variants.map((variant) => variantPrice(product, variant))
    return { min: Math.min(...prices), max: Math.max(...prices) }
}

export function hasVariablePrice(product: Pick<Product, 'price' | 'variants'>): boolean {
    const { min, max } = priceRange(product)
    return min !== max
}
