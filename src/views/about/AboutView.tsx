import { ProductIllustration } from '@/components/shared/ProductIllustration'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { ButtonLink, Sticker } from '@/components/ui'
import { appConfig } from '@/configs/app.config'
import { CONTAINER } from '@/constants/layout.constant'
import { ROUTES } from '@/constants/route.constant'
import { PALETTE } from '@/constants/theme.constant'
import { cn } from '@/utils/cn'
import { StatsRow } from '@/views/about/components/StatsRow'
import { ValuesGrid } from '@/views/about/components/ValuesGrid'

export function AboutView() {
    return (
        <div className="space-y-20 pb-20">
            <section className={cn(CONTAINER, 'relative isolate grid gap-12 pt-12 lg:grid-cols-2 lg:pt-20')}>
                <div
                    aria-hidden="true"
                    className="absolute -top-16 right-0 -z-10 size-80 rounded-full bg-sky-200 opacity-60 blur-3xl"
                />

                <div className="space-y-6">
                    <Sticker tone="lilac" rotation="right">
                        Desde 2020
                    </Sticker>

                    <h1 className="font-display text-4xl leading-tight tracking-tight text-ink uppercase sm:text-5xl lg:text-6xl text-balance">
                        Un taller pequeño con <span className="text-blush-500">ideas grandes</span>
                    </h1>

                    <p className="text-lg text-ink-soft">
                        {appConfig.brand} nació en una mesa de comedor con una prensa de segunda mano
                        y muchas ganas. Hoy seguimos siendo un equipo chiquito, y eso es justo lo que
                        nos permite cuidar cada pieza como si fuera para nuestra casa.
                    </p>

                    <p className="text-ink-soft">
                        Sublimamos en {appConfig.contact.city} y enviamos a todo el país. Cada pedido
                        pasa por una revisión de arte antes de entrar a la prensa, porque una taza mal
                        centrada no se arregla después.
                    </p>

                    <ButtonLink to={ROUTES.contact} size="lg">
                        Hablemos de tu idea
                    </ButtonLink>
                </div>

                <div className="relative mx-auto w-full max-w-sm">
                    <div className="rounded-blob border border-line bg-white p-6 shadow-lift">
                        <ProductIllustration
                            category="tees"
                            color={PALETTE.blush300}
                            printText="Hecho a mano"
                            size="lg"
                        />
                    </div>
                    <Sticker tone="butter" className="absolute -bottom-3 left-6 shadow-lift">
                        Taller propio
                    </Sticker>
                </div>
            </section>

            <section aria-labelledby="values-heading" className={cn(CONTAINER, 'space-y-10')}>
                <SectionHeading
                    headingId="values-heading"
                    eyebrow="Cómo trabajamos"
                    title="Lo que no negociamos"
                    highlight="no negociamos"
                    description="Cuatro cosas que sostienen todo lo que sale del taller."
                />
                <ValuesGrid />
            </section>

            <section aria-labelledby="stats-heading" className={cn(CONTAINER, 'space-y-10')}>
                <SectionHeading
                    headingId="stats-heading"
                    eyebrow="En números"
                    title="El taller en cifras"
                    highlight="cifras"
                    align="center"
                />
                <StatsRow />
            </section>
        </div>
    )
}
