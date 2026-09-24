import { PartyPopper } from 'lucide-react'

import { ButtonLink, Card, Sticker } from '@/components/ui'
import { ROUTES } from '@/constants/route.constant'
import { formatCurrency } from '@/utils/formatCurrency'
import { useSiteContent } from '@/utils/hooks/useSiteContent'

export interface CheckoutSuccessProps {
    orderCode: string
    email: string
    total: number
}

export function CheckoutSuccess({ orderCode, email, total }: CheckoutSuccessProps) {
    const { shipping } = useSiteContent()

    return (
        <Card padding="lg" elevation="lift" className="mx-auto max-w-2xl space-y-6 text-center">
            <div className="flex justify-center">
                <Sticker tone="mint" size="lg" rotation="right" className="gap-2">
                    <PartyPopper aria-hidden="true" className="size-4" />
                    Pedido confirmado
                </Sticker>
            </div>

            <h1 className="font-display text-4xl tracking-tight text-ink uppercase sm:text-5xl">
                ¡Gracias por tu <span className="text-blush-500">pedido</span>!
            </h1>

            <p className="text-ink-soft">
                Te enviamos la confirmación a{' '}
                <span className="font-semibold text-ink">{email}</span>. {shipping.productionCopy}.
            </p>

            <dl className="grid gap-4 rounded-3xl bg-blush-50 p-6 sm:grid-cols-2">
                <div>
                    <dt className="text-sm text-ink-soft">Código de pedido</dt>
                    <dd className="font-display text-2xl tracking-wide text-ink">{orderCode}</dd>
                </div>
                <div>
                    <dt className="text-sm text-ink-soft">Total pagado</dt>
                    <dd className="font-display text-2xl text-ink">{formatCurrency(total)}</dd>
                </div>
            </dl>

            <div className="flex flex-wrap justify-center gap-3">
                <ButtonLink to={ROUTES.catalog}>Seguir comprando</ButtonLink>
                <ButtonLink to={ROUTES.home} variant="secondary">
                    Volver al inicio
                </ButtonLink>
            </div>
        </Card>
    )
}
