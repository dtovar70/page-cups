import type { ProductQueryParams } from '@/@types/common'

/**
 * Hierarchical key factory: every list/detail key starts with its parent key so a
 * single `queryClient.invalidateQueries({ queryKey: queryKeys.products.all })`
 * reaches every product-derived cache entry.
 */
export const queryKeys = {
    products: {
        all: ['products'] as const,
        lists: () => [...queryKeys.products.all, 'list'] as const,
        list: (params: ProductQueryParams) => [...queryKeys.products.lists(), params] as const,
        details: () => [...queryKeys.products.all, 'detail'] as const,
        detail: (slug: string) => [...queryKeys.products.details(), slug] as const,
        featured: (limit?: number) => [...queryKeys.products.all, 'featured', limit] as const,
        related: (slug: string, limit?: number) =>
            [...queryKeys.products.all, 'related', slug, limit] as const,
    },
    categories: {
        all: ['categories'] as const,
    },
    testimonials: {
        all: ['testimonials'] as const,
    },
} as const
