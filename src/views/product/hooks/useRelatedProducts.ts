import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/constants/query-keys.constant'
import { ProductService } from '@/services/ProductService'

export const RELATED_LIMIT = 4

export function useRelatedProducts(slug: string, limit: number = RELATED_LIMIT) {
    return useQuery({
        queryKey: queryKeys.products.related(slug, limit),
        queryFn: () => ProductService.getRelatedProducts(slug, limit),
        enabled: slug.length > 0,
    })
}
