import { Newsletter } from '@/components/shared/Newsletter'
import { ButtonLink, Sticker } from '@/components/ui'
import { CONTAINER } from '@/constants/layout.constant'
import { ROUTES } from '@/constants/route.constant'
import { cn } from '@/utils/cn'

export function CtaBanner() {
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
                                Pedidos por mayor
                            </Sticker>

                            <h2
                                id="cta-heading"
                                className="font-display text-3xl tracking-tight text-ink uppercase sm:text-4xl lg:text-5xl"
                            >
                                ¿Tienes una <span className="text-blush-500">idea</span> en mente?
                            </h2>

                            <p className="max-w-md text-ink-soft">
                                Cuéntanos qué necesitas y te mandamos un boceto sin compromiso. Desde
                                una pieza hasta cien.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <ButtonLink to={ROUTES.contact} size="lg">
                                    Pedir mi diseño
                                </ButtonLink>
                                <ButtonLink to={ROUTES.about} size="lg" variant="secondary">
                                    Conócenos
                                </ButtonLink>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-line bg-white/80 p-6 shadow-soft backdrop-blur-sm">
                            <Newsletter />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
