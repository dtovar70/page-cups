import type { CartItem } from '@/@types/cart'
import { ProductIllustration } from '@/components/shared/ProductIllustration'
import { Card } from '@/components/ui'
import { formatCurrency } from '@/utils/formatCurrency'

export interface OrderSummaryProps {
    items: CartItem[]
    subtotal: number
    shipping: number
    total: number
}

export function OrderSummary({ items, subtotal, shipping, total }: OrderSummaryProps) {
    return (
        <Card tone="cream" padding="lg" className="h-fit space-y-5 lg:sticky lg:top-28">
            <h2 className="font-display text-xl text-ink">Tu pedido</h2>

            <ul className="space-y-4">
                {items.map((item) => (
                    <li key={item.lineId} className="flex items-center gap-3">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5">
                            <ProductIllustration
                                category={item.category}
                                color={item.colorHex}
                                printText={item.printText}
                                size="sm"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-display text-sm text-ink">{item.name}</p>
                            <p className="text-xs text-ink-soft">
                                {item.variantLabel} · {item.quantity} u.
                            </p>
                        </div>
                        <span className="text-sm font-semibold text-ink">
                            {formatCurrency(item.unitPrice * item.quantity)}
                        </span>
                    </li>
                ))}
            </ul>

            <dl className="space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex items-center justify-between">
                    <dt className="text-ink-soft">Subtotal</dt>
                    <dd className="font-semibold text-ink">{formatCurrency(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-ink-soft">Envío</dt>
                    <dd className="font-semibold text-ink">
                        {shipping === 0 ? 'Gratis' : formatCurrency(shipping)}
                    </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-3">
                    <dt className="font-display text-base text-ink">Total</dt>
                    <dd className="font-display text-2xl text-ink">{formatCurrency(total)}</dd>
                </div>
            </dl>
        </Card>
    )
}
