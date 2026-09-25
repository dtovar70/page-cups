import { AlarmClock, PackageX, Undo2 } from 'lucide-react'

import type { AdminOrderListItem } from '@/@types/order'
import { Badge } from '@/components/ui'
import { PaymentFlagBadges } from '@/views/admin/orders/components/PaymentFlagBadges'

/** Every warning of one order in the list: late payment, missing stock, pending refund, proof flags. */
export function OrderListFlags({ order }: { order: AdminOrderListItem }) {
    return (
        <span className="flex flex-wrap gap-1.5">
            {order.latePayment ? (
                <Badge tone="sky" size="sm" title="El pago llegó después del plazo">
                    <AlarmClock aria-hidden="true" className="size-3" />
                    Fuera de plazo
                </Badge>
            ) : null}
            {order.stockConflict ? (
                <Badge tone="blush" size="sm" title="Falta stock para este pedido">
                    <PackageX aria-hidden="true" className="size-3" />
                    Stock insuficiente
                </Badge>
            ) : null}
            {order.refundStatus === 'PENDIENTE' ? (
                <Badge tone="butter" size="sm" title="Hay que devolverle el dinero al cliente">
                    <Undo2 aria-hidden="true" className="size-3" />
                    Reembolso pendiente
                </Badge>
            ) : null}
            {order.latestPayment ? (
                <PaymentFlagBadges flags={order.latestPayment} className="contents" />
            ) : null}
        </span>
    )
}
