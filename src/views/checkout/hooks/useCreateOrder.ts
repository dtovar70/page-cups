import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateOrderInput } from '@/@types/order'
import { queryKeys } from '@/constants/query-keys.constant'
import { OrderService } from '@/services/OrderService'
import { isApiError } from '@/services/errors'

export const EXCHANGE_RATE_UNAVAILABLE = 'EXCHANGE_RATE_UNAVAILABLE'
export const PAYMENT_METHOD_UNAVAILABLE = 'PAYMENT_METHOD_UNAVAILABLE'
export const ORDER_ITEMS_INVALID = 'ORDER_ITEMS_INVALID'

export function useCreateOrder() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateOrderInput) => OrderService.create(input),
        onSuccess: (created) => {
            // The order page opens with the data already there.
            queryClient.setQueryData(queryKeys.orders.detail(created.code), created.order)
            // Stock changed.
            void queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
        },
        onError: (error) => {
            // The page reacts to these by showing its "cannot order right now" notices.
            if (isApiError(error, 503) && error.code === EXCHANGE_RATE_UNAVAILABLE) {
                void queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRate })
            }
            if (isApiError(error, 503) && error.code === PAYMENT_METHOD_UNAVAILABLE) {
                void queryClient.invalidateQueries({ queryKey: queryKeys.content })
            }
        },
    })
}
