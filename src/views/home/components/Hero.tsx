import { Check, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

import { HighlightedText } from '@/components/shared/HighlightedText'
import { ProductIllustration } from '@/components/shared/ProductIllustration'
import { ButtonLink, Sticker } from '@/components/ui'
import { CONTAINER } from '@/constants/layout.constant'
import { ROUTES } from '@/constants/route.constant'
import { PALETTE } from '@/constants/theme.constant'
import { cn } from '@/utils/cn'
import { usePrefersReducedMotion } from '@/utils/hooks/useMediaQuery'
import { useSiteContent } from '@/utils/hooks/useSiteContent'

export function Hero() {
    const { home } = useSiteContent()
    const prefersReducedMotion = usePrefersReducedMotion()
    const entrance = prefersReducedMotion ? false : { opacity: 0, y: 24 }

    return (
        <section className="relative isolate overflow-hidden pt-12 pb-16 sm:pt-16 lg:pt-20 lg:pb-24">
            <div
                aria-hidden="true"
                className="absolute -top-24 -left-32 -z-10 size-96 rounded-full bg-blush-200 opacity-60 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="absolute top-32 -right-24 -z-10 size-96 rounded-full bg-sky-200 opacity-60 blur-3xl"
            />

            <div className={cn(CONTAINER, 'grid items-center gap-12 lg:grid-cols-2 lg:gap-8')}>
                <motion.div
                    initial={entrance}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="space-y-7"
                >
                    <Sticker tone="butter" rotation="right" className="inline-flex gap-1.5">
                        <Sparkles aria-hidden="true" className="size-4" />
                        {home.heroBadge}
                    </Sticker>

                    <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-balance text-ink uppercase sm:text-6xl lg:text-7xl">
                        <HighlightedText text={home.heroTitle} />
                    </h1>

                    <p className="max-w-lg text-lg text-ink-soft">{home.heroSubtitle}</p>

                    <div className="flex flex-wrap gap-3">
                        <ButtonLink to={ROUTES.catalog} size="lg">
                            {home.heroPrimaryCta}
                        </ButtonLink>
                        <ButtonLink to={ROUTES.contact} size="lg" variant="secondary">
                            {home.heroSecondaryCta}
                        </ButtonLink>
                    </div>

                    {home.heroFeatures.length > 0 ? (
                        <ul className="flex flex-wrap gap-x-6 gap-y-2">
                            {home.heroFeatures.map((feature, index) => (
                                <li
                                    key={`${index}-${feature}`}
                                    className="flex items-center gap-2 text-sm font-semibold text-ink-soft"
                                >
                                    <span className="flex size-5 items-center justify-center rounded-full bg-mint-200 text-ink">
                                        <Check aria-hidden="true" className="size-3" />
                                    </span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </motion.div>

                <motion.div
                    initial={entrance}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                    className="relative mx-auto w-full max-w-md lg:max-w-lg"
                >
                    <div className="rounded-blob border border-line bg-white/70 p-6 shadow-lift backdrop-blur-sm">
                        <ProductIllustration
                            category="mugs"
                            color={PALETTE.blush300}
                            printText="Café primero"
                            size="lg"
                        />
                    </div>

                    <div className="absolute -bottom-8 -left-4 w-36 rounded-3xl border border-line bg-white p-3 shadow-soft sm:w-44">
                        <ProductIllustration
                            category="tees"
                            color={PALETTE.sky300}
                            printText="Modo finde"
                            size="lg"
                        />
                    </div>

                    <div className="absolute -top-6 -right-2 w-28 rounded-3xl border border-line bg-white p-3 shadow-soft sm:w-32">
                        <ProductIllustration
                            category="keychains"
                            color={PALETTE.lilac400}
                            printText="Mi gente"
                            size="lg"
                        />
                    </div>

                    <Sticker tone="blush" size="lg" className="absolute -top-4 left-4 shadow-lift">
                        ¡Nuevo!
                    </Sticker>
                    <Sticker
                        tone="sky"
                        rotation="right"
                        className="absolute right-2 -bottom-4 shadow-lift"
                    >
                        Hecho a mano
                    </Sticker>
                </motion.div>
            </div>
        </section>
    )
}
