import { Trash2 } from 'lucide-react'
import { Link } from 'react-router'

import type { CartItem } from '@/@types/cart'
import { CartPersonalization } from '@/components/shared/CartPersonalization'
import { ProductMedia } from '@/components/shared/ProductMedia'
import { Button, QuantityStepper } from '@/components/ui'
import { productPath } from '@/constants/route.constant'
import { MAX_LINE_QUANTITY, useCartActions } from '@/store/cartStore'
import { formatCurrency } from '@/utils/formatCurrency'

export interface CartLineProps {
    item: CartItem
}

export function CartLine({ item }: CartLineProps) {
    const { updateQuantity, removeItem } = useCartActions()

    return (
        <li className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-3xl bg-blush-50 p-2">
                <ProductMedia
                    category={item.category}
                    color={item.colorHex}
                    printText={item.printText}
                    image={item.imageUrl ? { url: item.imageUrl } : undefined}
                    fallbackAlt={item.name}
                    size="lg"
                />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
                <h2 className="font-display text-lg text-ink">
                    <Link to={productPath(item.slug)} className="rounded-sm hover:text-blush-600">
                        {item.name}
                    </Link>
                </h2>
                <p className="text-sm text-ink-soft">{item.variantLabel}</p>
                <p className="text-sm text-ink-soft">{formatCurrency(item.unitPrice)} c/u</p>
                <CartPersonalization item={item} />
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
                <QuantityStepper
                    value={item.quantity}
                    max={MAX_LINE_QUANTITY}
                    onChange={(quantity) => updateQuantity(item.lineId, quantity)}
                />

                <p className="w-24 text-right font-display text-lg text-ink">
                    {formatCurrency(item.unitPrice * item.quantity)}
                </p>

                <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Quitar ${item.name}${item.personalization ? ` (${item.personalization})` : ''} del carrito`}
                    onClick={() => removeItem(item.lineId)}
                    className="size-9 px-0 text-ink-soft"
                >
                    <Trash2 aria-hidden="true" className="size-4" />
                </Button>
            </div>
        </li>
    )
}
