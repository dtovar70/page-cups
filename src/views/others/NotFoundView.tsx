import { ProductIllustration } from '@/components/shared/ProductIllustration'
import { ButtonLink, Sticker } from '@/components/ui'
import { CONTAINER } from '@/constants/layout.constant'
import { ROUTES } from '@/constants/route.constant'
import { PALETTE } from '@/constants/theme.constant'
import { cn } from '@/utils/cn'

export function NotFoundView() {
    return (
        <section className={cn(CONTAINER, 'relative isolate py-20 lg:py-28')}>
            <div
                aria-hidden="true"
                className="absolute top-10 left-1/2 -z-10 size-80 -translate-x-1/2 rounded-full bg-blush-200 opacity-60 blur-3xl"
            />

            <div className="mx-auto flex max-w-xl flex-col items-center gap-7 text-center">
                <div className="relative w-56">
                    <ProductIllustration
                        category="mugs"
                        color={PALETTE.sky300}
                        printText="Página perdida"
                        size="lg"
                    />
                    <Sticker tone="butter" className="absolute -top-2 -right-2">
                        Error 404
                    </Sticker>
                </div>

                <h1 className="font-display text-5xl tracking-tight text-balance text-ink uppercase sm:text-6xl">
                    Se nos <span className="text-blush-500">derramó</span> el café
                </h1>

                <p className="text-lg text-ink-soft">
                    Esta página no existe o cambió de lugar. Pero el catálogo sigue calientito.
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                    <ButtonLink to={ROUTES.home} size="lg">
                        Volver al inicio
                    </ButtonLink>
                    <ButtonLink to={ROUTES.catalog} size="lg" variant="secondary">
                        Ver el catálogo
                    </ButtonLink>
                </div>
            </div>
        </section>
    )
}
