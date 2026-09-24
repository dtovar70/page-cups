import { HighlightedText } from '@/components/shared/HighlightedText'
import { Newsletter } from '@/components/shared/Newsletter'
import { ButtonLink, Sticker } from '@/components/ui'
import { CONTAINER } from '@/constants/layout.constant'
import { ROUTES } from '@/constants/route.constant'
import { cn } from '@/utils/cn'
import { useSiteContent } from '@/utils/hooks/useSiteContent'

export function CtaBanner() {
    const { home } = useSiteContent()

    return (
        <section aria-labelledby="cta-heading" className="pb-20">
            <div className={CONTAINER}>
                <div
                    className={cn(
                        'relative isolate overflow-hidden rounded-blob border border-line',
                        'bg-gradient-to-br from-blush-100 via-cream to-sky-100 px-6 py-14 sm:px-12',
                    )}
                >
                    <div
                        aria-hidden="true"
                        className="absolute -top-20 -right-16 -z-10 size-72 rounded-full bg-blush-200 opacity-70 blur-3xl"
                    />

                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        <div className="space-y-6">
                            <Sticker tone="mint" rotation="right">
                                {home.ctaBadge}
                            </Sticker>

                            <h2
                                id="cta-heading"
                                className="font-display text-3xl tracking-tight text-ink uppercase sm:text-4xl lg:text-5xl"
                            >
                                <HighlightedText text={home.ctaTitle} />
                            </h2>

                            <p className="max-w-md text-ink-soft">{home.ctaDescription}</p>

                            <div className="flex flex-wrap gap-3">
                                <ButtonLink to={ROUTES.contact} size="lg">
                                    {home.ctaPrimary}
                                </ButtonLink>
                                <ButtonLink to={ROUTES.about} size="lg" variant="secondary">
                                    {home.ctaSecondary}
                                </ButtonLink>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-line bg-white/80 p-6 shadow-soft backdrop-blur-sm">
                            <Newsletter
                                title={home.newsletterTitle}
                                description={home.newsletterDescription}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
