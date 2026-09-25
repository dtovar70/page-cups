import { AlarmClock, AlertTriangle, Copy } from 'lucide-react'

import type { PaymentFlags } from '@/@types/order'
import { Badge } from '@/components/ui'
import { cn } from '@/utils/cn'
import { formatDifference } from '@/views/admin/orders/utils/formatDifference'

export interface PaymentFlagBadgesProps {
    flags: PaymentFlags
    /** The proof arrived after the deadline (or once the order had expired). */
    late?: boolean
    /** `contents` lets the badges join a surrounding wrapping list instead of their own. */
    className?: string
}

/** Warnings about a payment proof: late, reference already used elsewhere, amount off. */
export function PaymentFlagBadges({ flags, late = false, className }: PaymentFlagBadgesProps) {
    if (!late && !flags.duplicateReference && !flags.amountMismatch) return null
    return (
        <span className={cn('flex flex-wrap gap-1.5', className)}>
            {late ? (
                <Badge tone="sky" size="sm" title="La fecha de pago es posterior al plazo">
                    <AlarmClock aria-hidden="true" className="size-3" />
                    Pago fuera de plazo
                </Badge>
            ) : null}
            {flags.duplicateReference ? (
                <Badge tone="blush" size="sm" title="La misma referencia aparece en otro pedido">
                    <Copy aria-hidden="true" className="size-3" />
                    Ref. duplicada
                </Badge>
            ) : null}
            {flags.amountMismatch ? (
                <Badge tone="butter" size="sm" title="El monto pagado no coincide con el total">
                    <AlertTriangle aria-hidden="true" className="size-3" />
                    Monto {formatDifference(flags.amountDifferenceBs)} Bs
                </Badge>
            ) : null}
        </span>
    )
}
