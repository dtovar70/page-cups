import { HeartHandshake, Leaf, Palette, Timer } from 'lucide-react'
import type { ReactNode } from 'react'

import { Card } from '@/components/ui'

interface BrandValue {
    id: string
    icon: ReactNode
    title: string
    description: string
}

const VALUES: BrandValue[] = [
    {
        id: 'design',
        icon: <Palette aria-hidden="true" className="size-5" />,
        title: 'Diseño con criterio',
        description:
            'Si tu idea no se va a ver bien sublimada, te lo decimos y te proponemos una alternativa.',
    },
    {
        id: 'care',
        icon: <HeartHandshake aria-hidden="true" className="size-5" />,
        title: 'Trato cercano',
        description:
            'Hablas con la persona que produce tu pedido, no con un formulario ni con un bot.',
    },
    {
        id: 'time',
        icon: <Timer aria-hidden="true" className="size-5" />,
        title: 'Tiempos reales',
        description:
            'Prometemos lo que podemos cumplir. Si algo se atrasa, te avisamos antes de que preguntes.',
    },
    {
        id: 'materials',
        icon: <Leaf aria-hidden="true" className="size-5" />,
        title: 'Materiales que duran',
        description:
            'Cerámica, algodón y acrílico probados en el taller antes de ofrecerlos en el catálogo.',
    },
]

export function ValuesGrid() {
    return (
        <ul className="grid gap-6 sm:grid-cols-2">
            {VALUES.map((value) => (
                <li key={value.id} className="h-full">
                    <Card className="flex h-full flex-col gap-3">
                        <span className="flex size-11 items-center justify-center rounded-full bg-blush-100 text-blush-600">
                            {value.icon}
                        </span>
                        <h3 className="font-display text-lg text-ink">{value.title}</h3>
                        <p className="text-sm text-ink-soft">{value.description}</p>
                    </Card>
                </li>
            ))}
        </ul>
    )
}
