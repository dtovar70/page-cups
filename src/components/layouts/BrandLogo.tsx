import { Link } from 'react-router'

import { appConfig } from '@/configs/app.config'
import { ROUTES } from '@/constants/route.constant'
import { cn } from '@/utils/cn'

const [PRIMARY_LINE, SECONDARY_LINE] = appConfig.brandLines

export interface BrandLogoProps {
    className?: string
    /** Renders the tagline under the wordmark; used in the footer. */
    withTagline?: boolean
}

export function BrandLogo({ className, withTagline = false }: BrandLogoProps) {
    return (
        <Link
            to={ROUTES.home}
            aria-label={`${appConfig.brand} — ir al inicio`}
            className={cn('group inline-flex items-center gap-2.5 rounded-2xl', className)}
        >
            <img
                src={appConfig.logo.src}
                srcSet={appConfig.logo.srcSet}
                sizes="64px"
                alt=""
                width={64}
                height={64}
                className="size-12 shrink-0 rounded-2xl ring-1 ring-ink/5 transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transform-none lg:size-16"
            />

            <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
                    {PRIMARY_LINE}
                </span>
                <span className="text-[0.65rem] font-bold tracking-[0.22em] text-blush-500 uppercase sm:text-xs">
                    {SECONDARY_LINE}
                </span>
                {withTagline ? (
                    <span className="mt-1.5 text-sm font-normal tracking-normal text-ink-soft normal-case">
                        {appConfig.tagline}
                    </span>
                ) : null}
            </span>
        </Link>
    )
}
