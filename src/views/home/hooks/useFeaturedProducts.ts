import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/constants/query-keys.constant'
import { ProductService } from '@/services/ProductService'

export const FEATURED_LIMIT = 8

export function useFeaturedProducts(limit: number = FEATURED_LIMIT) {
    return useQuery({
        queryKey: queryKeys.products.featured(limit),
        queryFn: () => ProductService.getFeaturedProducts(limit),
    })
}
