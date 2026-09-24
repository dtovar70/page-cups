import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'

import { EmptyState } from '@/components/shared/EmptyState'
import { ButtonLink } from '@/components/ui'
import { CONTAINER } from '@/constants/layout.constant'
import { ROUTES } from '@/constants/route.constant'
import { useCartActions, useCartItems, useCartSubtotal } from '@/store/cartStore'
import { cn } from '@/utils/cn'
import { shippingCost } from '@/utils/content'
import { useSiteContent } from '@/utils/hooks/useSiteContent'
import { CheckoutForm } from '@/views/checkout/components/CheckoutForm'
import { CheckoutSuccess } from '@/views/checkout/components/CheckoutSuccess'
import { OrderSummary } from '@/views/checkout/components/OrderSummary'
import type { CheckoutValues } from '@/views/checkout/schema/checkout.schema'

const SUBMIT_DELAY_MS = 1200

interface ConfirmedOrder {
    code: string
    email: string
    total: number
}

function generateOrderCode(): string {
    const stamp = Date.now().toString(36).slice(-4).toUpperCase()
    const random = Math.random().toString(36).slice(2, 6).toUpperCase()

    return `CS-${stamp}-${random}`
}

export function CheckoutView() {
    const items = useCartItems()
    const subtotal = useCartSubtotal()
    const { clear } = useCartActions()
    const [order, setOrder] = useState<ConfirmedOrder | null>(null)

    const content = useSiteContent()
    const shipping = shippingCost(subtotal, content.shipping)
    const total = subtotal + shipping

    const handleConfirm = async (values: CheckoutValues) => {
        await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS))

        setOrder({ code: generateOrderCode(), email: values.email, total })
        clear()
    }

    if (order) {
        return (
            <div className={cn(CONTAINER, 'py-12 lg:py-20')}>
                <CheckoutSuccess orderCode={order.code} email={order.email} total={order.total} />
            </div>
        )
    }

    return (
        <div className={cn(CONTAINER, 'space-y-8 py-12 lg:py-16')}>
            <h1 className="font-display text-4xl tracking-tight text-ink uppercase sm:text-5xl">
                Finalizar <span className="text-blush-500">compra</span>
            </h1>

            {items.length === 0 ? (
                <EmptyState
                    title="Tu carrito está vacío"
                    description="Agrega al menos un producto para poder completar el pedido."
                    icon={<ShoppingBag className="size-6" />}
                    action={<ButtonLink to={ROUTES.catalog}>Explorar catálogo</ButtonLink>}
                />
            ) : (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
                    <CheckoutForm onConfirm={handleConfirm} />
                    <OrderSummary
                        items={items}
                        subtotal={subtotal}
                        shipping={shipping}
                        total={total}
                    />
                </div>
            )}
        </div>
    )
}
