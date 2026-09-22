export type CategorySlug = 'mugs' | 'tees' | 'keychains'

export type ProductTag = 'nuevo' | 'bestseller' | 'oferta' | 'personalizable'

export interface ProductVariant {
    id: string
    label: string
    priceDelta: number
    colorHex?: string
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
