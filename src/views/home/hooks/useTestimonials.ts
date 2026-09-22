import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/constants/query-keys.constant'
import { ProductService } from '@/services/ProductService'

export function useTestimonials() {
    return useQuery({
        queryKey: queryKeys.testimonials.all,
        queryFn: () => ProductService.getTestimonials(),
    })
}
