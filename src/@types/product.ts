/**
 * Categories are managed from the admin, so any slug the API returns is valid. The alias only
 * documents intent where a string holds a category slug.
 */
export type CategorySlug = string

export type ProductTag = 'nuevo' | 'bestseller' | 'oferta' | 'personalizable'

export interface ProductVariant {
    id: string
    label: string
    priceDelta: number
    colorHex?: string
}

export interface ProductImage {
    id: string
    url: string
    alt: string | null
}

export interface Product {
    id: string
    slug: string
    name: string
    category: CategorySlug
    price: number
    compareAtPrice?: number
    printText: string
    colorHex: string
    description: string
    highlights: string[]
    variants: ProductVariant[]
    rating: number
    reviewCount: number
    tags: ProductTag[]
    stock: number
    createdAt: string
    /** Uploaded photos in display order; empty means the generated illustration is shown. */
    images: ProductImage[]
}

export interface Category {
    slug: CategorySlug
    name: string
    tagline: string
    description: string
    colorHex: string
    productCount: number
}

export interface Review {
    id: string
    productId: string
    author: string
    rating: number
    comment: string
    createdAt: string
}
