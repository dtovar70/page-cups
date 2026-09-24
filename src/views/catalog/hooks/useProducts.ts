import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { ProductQueryParams } from '@/@types/common'
import { queryKeys } from '@/constants/query-keys.constant'
import { ProductService } from '@/services/ProductService'

export function useProducts(params: ProductQueryParams, options: { enabled?: boolean } = {}) {
    return useQuery({
        queryKey: queryKeys.products.list(params),
        queryFn: () => ProductService.getProducts(params),
        placeholderData: keepPreviousData,
        enabled: options.enabled,
    })
}
