import { Accordion, type AccordionItem } from '@/components/shared/Accordion'
import { appConfig } from '@/configs/app.config'

const FAQ_ITEMS: AccordionItem[] = [
    {
        id: 'minimum',
        question: '¿Hay cantidad mínima de pedido?',
        answer: 'No. Hacemos desde una sola pieza. A partir de 12 unidades aplicamos precio por mayor.',
    },
    {
        id: 'art',
        question: 'No tengo el diseño listo, ¿me ayudan?',
        answer: 'Sí. Cuéntanos la idea y te preparamos una propuesta sin costo. Solo cobramos el arte si pides más de dos rondas de cambios.',
    },
    {
        id: 'time',
        question: '¿Cuánto tardan en producir?',
        answer: `${appConfig.shipping.productionCopy}, contados desde que apruebas el boceto. Los pedidos grandes pueden tomar un poco más.`,
    },
    {
        id: 'shipping',
        question: '¿Cómo funciona el envío?',
        answer: `${appConfig.shipping.freeShippingCopy}. Por debajo de ese monto cobramos una tarifa plana y te enviamos el número de guía apenas sale el paquete.`,
    },
]

export function ContactFaq() {
    return <Accordion items={FAQ_ITEMS} />
}
