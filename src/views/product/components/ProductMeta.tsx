import { Check } from 'lucide-react'

import type { Product } from '@/@types/product'
import { Accordion, type AccordionItem } from '@/components/shared/Accordion'
import { appConfig } from '@/configs/app.config'

const FAQ_ITEMS: AccordionItem[] = [
    {
        id: 'shipping',
        question: 'Envíos y tiempos de entrega',
        answer: `${appConfig.shipping.productionCopy}. Enviamos a todo el país con entrega en 24 a 72 horas según la ciudad. ${appConfig.shipping.freeShippingCopy}.`,
    },
    {
        id: 'returns',
        question: 'Cambios y devoluciones',
        answer: 'Si la pieza llega dañada o con un error nuestro, la reponemos sin costo. Los productos personalizados no admiten devolución por cambio de opinión.',
    },
    {
        id: 'customize',
        question: '¿Cómo envío mi diseño?',
        answer: `Escríbenos a ${appConfig.contact.email} o por WhatsApp con tu imagen o texto. Te mandamos un boceto antes de producir.`,
    },
]

export interface ProductMetaProps {
    product: Product
}

export function ProductMeta({ product }: ProductMetaProps) {
    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <h2 className="font-display text-xl text-ink">Lo que incluye</h2>
                <ul className="space-y-2">
                    {product.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2.5 text-sm text-ink">
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-mint-200">
                                <Check aria-hidden="true" className="size-3" />
                            </span>
                            {highlight}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="space-y-3">
                <h2 className="font-display text-xl text-ink">Preguntas frecuentes</h2>
                <Accordion items={FAQ_ITEMS} />
            </div>
        </div>
    )
}
