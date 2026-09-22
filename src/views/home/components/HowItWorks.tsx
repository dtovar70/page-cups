import { SectionHeading } from '@/components/shared/SectionHeading'
import { Card } from '@/components/ui'
import { CONTAINER } from '@/constants/layout.constant'
import { cn } from '@/utils/cn'

interface Step {
    id: string
    title: string
    description: string
}

const STEPS: Step[] = [
    {
        id: 'step-1',
        title: 'Elige tu producto',
        description:
            'Taza, franela o llavero. Escoge el modelo, el tamaño y el color que mejor va con tu idea.',
    },
    {
        id: 'step-2',
        title: 'Envía tu diseño',
        description:
            'Mándanos tu foto, tu texto o tu logo por WhatsApp. Si no tienes arte, lo armamos contigo.',
    },
    {
        id: 'step-3',
        title: 'Lo sublimamos y enviamos',
        description:
            'Producimos en 3 a 5 días hábiles y te lo llevamos a la puerta, listo para regalar.',
    },
]

export function HowItWorks() {
    return (
        <section aria-labelledby="how-heading" className="bg-blush-50 py-16 lg:py-24">
            <div className={cn(CONTAINER, 'space-y-10')}>
                <SectionHeading
                    headingId="how-heading"
                    eyebrow="Así de fácil"
                    title="Tres pasos y listo"
                    highlight="Tres pasos"
                    align="center"
                    description="Sin mínimos imposibles ni formularios eternos."
                />

                <ol className="grid gap-6 md:grid-cols-3">
                    {STEPS.map((step, index) => (
                        <li key={step.id} className="h-full">
                            <Card className="flex h-full flex-col gap-3">
                                <span className="flex size-12 items-center justify-center rounded-full bg-blush-400 font-display text-xl font-semibold text-white">
                                    {index + 1}
                                </span>
                                <h3 className="font-display text-xl text-ink">{step.title}</h3>
                                <p className="text-sm text-ink-soft">{step.description}</p>
                            </Card>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}
