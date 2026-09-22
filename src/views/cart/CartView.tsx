import { ShoppingBag } from 'lucide-react'

import { ClearCartButton } from '@/components/shared/ClearCartButton'
import { EmptyState } from '@/components/shared/EmptyState'
import { FreeShippingProgress } from '@/components/shared/FreeShippingProgress'
import { ButtonLink, Card } from '@/components/ui'
import { appConfig, FREE_SHIPPING_THRESHOLD } from '@/configs/app.config'
import { CONTAINER } from '@/constants/layout.constant'
import { ROUTES } from '@/constants/route.constant'
import { useCartItems, useCartSubtotal } from '@/store/cartStore'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatCurrency'
import { CartLine } from '@/views/cart/components/CartLine'

export function CartView() {
    const items = useCartItems()
    const subtotal = useCartSubtotal()
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : appConfig.shipping.flatRate
    const total = subtotal + shipping

    return (
        <div className={cn(CONTAINER, 'space-y-8 py-12 lg:py-16')}>
            <h1 className="font-display text-4xl tracking-tight text-ink uppercase sm:text-5xl">
                Tu <span className="text-blush-500">carrito</span>
            </h1>

            {items.length === 0 ? (
                <EmptyState
                    title="Todavía no hay nada aquí"
                    description="Cuando encuentres el diseño perfecto, aparecerá en esta lista."
                    icon={<ShoppingBag className="size-6" />}
                    action={<ButtonLink to={ROUTES.catalog}>Explorar catálogo</ButtonLink>}
                />
            ) : (
                <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
                    <div className="space-y-3">
                        {items.length > 1 ? (
                            <div className="flex items-center justify-between gap-3 px-1">
                                <span className="text-sm text-ink-soft">
                                    {items.length} productos en tu carrito
                                </span>
                                <ClearCartButton itemCount={items.length} />
                            </div>
                        ) : null}

                        <Card padding="none" className="px-6">
                            <ul className="divide-y divide-line">
                                {items.map((item) => (
                                    <CartLine key={item.lineId} item={item} />
                                ))}
                            </ul>
                        </Card>
                    </div>

                    <Card
                        tone="cream"
                        padding="lg"
                        className="h-fit space-y-5 lg:sticky lg:top-28"
                        aria-label="Resumen del pedido"
                    >
                        <h2 className="font-display text-xl text-ink">Resumen</h2>

                        <FreeShippingProgress subtotal={subtotal} />

                        <dl className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <dt className="text-ink-soft">Subtotal</dt>
                                <dd className="font-semibold text-ink">
                                    {formatCurrency(subtotal)}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-ink-soft">Envío</dt>
                                <dd className="font-semibold text-ink">
                                    {shipping === 0 ? 'Gratis' : formatCurrency(shipping)}
                                </dd>
                            </div>
                            <div className="flex items-baseline justify-between border-t border-line pt-3">
                                <dt className="font-display text-base text-ink">Total</dt>
                                <dd className="font-display text-2xl text-ink">
                                    {formatCurrency(total)}
                                </dd>
                            </div>
                        </dl>

                        <div className="grid gap-2">
                            <ButtonLink to={ROUTES.checkout} fullWidth>
                                Ir al checkout
                            </ButtonLink>
                            <ButtonLink to={ROUTES.catalog} variant="secondary" fullWidth>
                                Seguir comprando
                            </ButtonLink>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
