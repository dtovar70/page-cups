import { ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router'

import { ClearCartButton } from '@/components/shared/ClearCartButton'
import { FreeShippingProgress } from '@/components/shared/FreeShippingProgress'
import { ProductMedia } from '@/components/shared/ProductMedia'
import { Button, ButtonLink, Drawer, QuantityStepper } from '@/components/ui'
import { MAX_LINE_QUANTITY, useCartActions, useCartItems, useCartSubtotal } from '@/store/cartStore'
import { productPath, ROUTES } from '@/constants/route.constant'
import { useCartDrawer } from '@/store/uiStore'
import { formatCurrency } from '@/utils/formatCurrency'

export function CartDrawer() {
    const { isOpen, close } = useCartDrawer()
    const items = useCartItems()
    const subtotal = useCartSubtotal()
    const { updateQuantity, removeItem } = useCartActions()

    return (
        <Drawer
            isOpen={isOpen}
            onClose={close}
            title="Tu carrito"
            footer={
                items.length > 0 ? (
                    <div className="space-y-4">
                        <FreeShippingProgress subtotal={subtotal} />
                        <div className="flex items-baseline justify-between">
                            <span className="text-sm text-ink-soft">Subtotal</span>
                            <span className="font-display text-xl text-ink">
                                {formatCurrency(subtotal)}
                            </span>
                        </div>
                        <div className="grid gap-2">
                            <ButtonLink to={ROUTES.checkout} onClick={close} fullWidth>
                                Ir al checkout
                            </ButtonLink>
                            <ButtonLink
                                to={ROUTES.cart}
                                onClick={close}
                                variant="secondary"
                                fullWidth
                            >
                                Ver el carrito
                            </ButtonLink>
                        </div>
                    </div>
                ) : null
            }
        >
            {items.length === 0 ? (
                <div className="flex min-h-full flex-col items-center justify-center gap-4 py-8 text-center">
                    <span
                        aria-hidden="true"
                        className="flex size-16 items-center justify-center rounded-full bg-blush-100 text-blush-500"
                    >
                        <ShoppingBag className="size-7" />
                    </span>
                    <p className="font-display text-lg">Tu carrito está vacío</p>
                    <p className="max-w-xs text-sm text-ink-soft">
                        Elige una taza, una franela o un llavero y personalízalo a tu gusto.
                    </p>
                    <ButtonLink to={ROUTES.catalog} onClick={close}>
                        Explorar catálogo
                    </ButtonLink>
                </div>
            ) : (
                <>
                    {items.length > 1 ? (
                        <div className="flex items-center justify-between gap-3 pb-2">
                            <span className="text-sm text-ink-soft">{items.length} productos</span>
                            <ClearCartButton itemCount={items.length} />
                        </div>
                    ) : null}

                    <ul className="divide-y divide-line">
                        {items.map((item) => (
                            <li key={item.lineId} className="flex gap-3 py-4">
                                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5">
                                    <ProductMedia
                                        category={item.category}
                                        color={item.colorHex}
                                        printText={item.printText}
                                        image={item.imageUrl ? { url: item.imageUrl } : undefined}
                                        fallbackAlt={item.name}
                                        size="sm"
                                    />
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                    <Link
                                        to={productPath(item.slug)}
                                        onClick={close}
                                        className="font-display text-sm leading-snug text-ink"
                                    >
                                        {item.name}
                                    </Link>
                                    <p className="text-xs text-ink-soft">{item.variantLabel}</p>

                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <QuantityStepper
                                            value={item.quantity}
                                            max={MAX_LINE_QUANTITY}
                                            onChange={(quantity) =>
                                                updateQuantity(item.lineId, quantity)
                                            }
                                        />
                                        <span className="text-sm font-semibold text-ink">
                                            {formatCurrency(item.unitPrice * item.quantity)}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    aria-label={`Quitar ${item.name} del carrito`}
                                    onClick={() => removeItem(item.lineId)}
                                    className="size-9 shrink-0 self-start px-0 text-ink-soft"
                                >
                                    <Trash2 aria-hidden="true" className="size-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </Drawer>
    )
}
