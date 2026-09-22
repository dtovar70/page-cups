import type { CategorySlug, ProductTag } from '@/@types/product'

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'rating'

export interface Paginated<T> {
    items: T[]
    page: number
    pageSize: number
    total: number
    totalPages: number
}

export interface FilterState {
    category?: CategorySlug
    search?: string
    sort: SortOption
    minPrice?: number
    maxPrice?: number
    tags: ProductTag[]
    page: number
}

export interface ProductQueryParams {
    category?: CategorySlug
    search?: string
    sort?: SortOption
    minPrice?: number
    maxPrice?: number
    tags?: ProductTag[]
    page?: number
    pageSize?: number
}

export interface Testimonial {
    id: string
    author: string
    city: string
    rating: number
    quote: string
    productName: string
}
