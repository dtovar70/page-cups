import { queryOptions, useQuery } from '@tanstack/react-query'

import type { Product } from '@/@types/product'
import { queryKeys } from '@/constants/query-keys.constant'
import { NotFoundError, ProductService } from '@/services/ProductService'

const MAX_RETRIES = 1

/**
 * Exported on its own so `ProductCard` can prefetch the exact same cache entry the
 * detail view will read.
 */
export function productDetailQueryOptions(slug: string) {
    return queryOptions<Product>({
        queryKey: queryKeys.products.detail(slug),
        queryFn: () => ProductService.getProductBySlug(slug),
        retry: (failureCount, error) =>
            !(error instanceof NotFoundError) && failureCount < MAX_RETRIES,
    })
}

export function useProduct(slug: string) {
    return useQuery({ ...productDetailQueryOptions(slug), enabled: slug.length > 0 })
}
