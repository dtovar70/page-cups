import { Check } from 'lucide-react'

import type { Product } from '@/@types/product'
import { Accordion, type AccordionItem } from '@/components/shared/Accordion'
import { useShippingContent, useSiteContent } from '@/utils/hooks/useSiteContent'

/** Shipping, returns and artwork answers, filled with the editable shipping and contact data. */
function useProductFaq(): AccordionItem[] {
    const { contact } = useSiteContent()
    const { productionCopy, freeShippingText } = useShippingContent()
    return [
        {
            id: 'shipping',
            question: 'Envíos y tiempos de entrega',
            answer: `${productionCopy}. Enviamos a todo el país con entrega en 24 a 72 horas según la ciudad. ${freeShippingText}.`,
        },
        {
            id: 'returns',
            question: 'Cambios y devoluciones',
            answer: 'Si la pieza llega dañada o con un error nuestro, la reponemos sin costo. Los productos personalizados no admiten devolución por cambio de opinión.',
        },
        {
            id: 'customize',
            question: '¿Cómo envío mi diseño?',
            answer: `Escríbenos a ${contact.email} o por WhatsApp con tu imagen o texto. Te mandamos un boceto antes de producir.`,
        },
    ]
}

export interface ProductMetaProps {
    product: Product
}

export function ProductMeta({ product }: ProductMetaProps) {
    const faqItems = useProductFaq()

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
                <Accordion items={faqItems} />
            </div>
        </div>
    )
}
