import { useQuery } from '@tanstack/react-query'

import type { CategorySlug } from '@/@types/product'
import { queryKeys } from '@/constants/query-keys.constant'
import { ProductService } from '@/services/ProductService'

/**
 * Categories drive both the catalog filters and the home strip, so the catalog
 * owns the single key and the home view reuses this hook.
 */
export function useCategories() {
    return useQuery({
        queryKey: queryKeys.categories.all,
        queryFn: () => ProductService.getCategories(),
        staleTime: Number.POSITIVE_INFINITY,
    })
}

/** One category of the shared list; `undefined` while loading or when the slug is unknown. */
export function useCategory(slug: CategorySlug | undefined) {
    const { data } = useCategories()
    return slug === undefined ? undefined : data?.find((category) => category.slug === slug)
}
