import type { AdminProductQueryParams } from '@/@types/admin'
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
    /** Editable site content (`GET /content`), loaded once at start-up. */
    content: ['content'] as const,
    /** Current admin session (`GET /auth/me`); `null` data means logged out. */
    session: ['session'] as const,
    /** Everything behind the admin login, so logging out can drop it in one call. */
    admin: {
        all: ['admin'] as const,
        products: {
            all: () => [...queryKeys.admin.all, 'products'] as const,
            lists: () => [...queryKeys.admin.products.all(), 'list'] as const,
            list: (params: AdminProductQueryParams) =>
                [...queryKeys.admin.products.lists(), params] as const,
            detail: (id: string) => [...queryKeys.admin.products.all(), 'detail', id] as const,
        },
        categories: () => [...queryKeys.admin.all, 'categories'] as const,
        content: () => [...queryKeys.admin.all, 'content'] as const,
    },
} as const
