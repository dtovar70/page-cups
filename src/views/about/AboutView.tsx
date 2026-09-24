import { HighlightedText } from '@/components/shared/HighlightedText'
import { ProductIllustration } from '@/components/shared/ProductIllustration'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { ButtonLink, Sticker } from '@/components/ui'
import { CONTAINER } from '@/constants/layout.constant'
import { ROUTES } from '@/constants/route.constant'
import { PALETTE } from '@/constants/theme.constant'
import { cn } from '@/utils/cn'
import { useFillPlaceholders, useSiteContent } from '@/utils/hooks/useSiteContent'
import { StatsRow } from '@/views/about/components/StatsRow'
import { ValuesGrid } from '@/views/about/components/ValuesGrid'

export function AboutView() {
    const { about } = useSiteContent()
    const fill = useFillPlaceholders()

    return (
        <div className="space-y-20 pb-20">
            <section
                className={cn(
                    CONTAINER,
                    'relative isolate grid gap-12 pt-12 lg:grid-cols-2 lg:pt-20',
                )}
            >
                <div
                    aria-hidden="true"
                    className="absolute -top-16 right-0 -z-10 size-80 rounded-full bg-sky-200 opacity-60 blur-3xl"
                />

                <div className="space-y-6">
                    <Sticker tone="lilac" rotation="right">
                        {about.badge}
                    </Sticker>

                    <h1 className="font-display text-4xl leading-tight tracking-tight text-balance text-ink uppercase sm:text-5xl lg:text-6xl">
                        <HighlightedText text={about.title} />
                    </h1>

                    {about.paragraphs.map((paragraph, index) => (
                        <p
                            key={index}
                            className={index === 0 ? 'text-lg text-ink-soft' : 'text-ink-soft'}
                        >
                            {fill(paragraph)}
                        </p>
                    ))}

                    <ButtonLink to={ROUTES.contact} size="lg">
                        {about.ctaLabel}
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
                        {about.imageBadge}
                    </Sticker>
                </div>
            </section>

            <section aria-labelledby="values-heading" className={cn(CONTAINER, 'space-y-10')}>
                <SectionHeading
                    headingId="values-heading"
                    eyebrow={about.valuesEyebrow}
                    title={about.valuesTitle}
                    description={about.valuesDescription}
                />
                <ValuesGrid values={about.values} />
            </section>

            <section aria-labelledby="stats-heading" className={cn(CONTAINER, 'space-y-10')}>
                <SectionHeading
                    headingId="stats-heading"
                    eyebrow={about.statsEyebrow}
                    title={about.statsTitle}
                    align="center"
                />
                <StatsRow stats={about.stats} />
            </section>
        </div>
    )
}
