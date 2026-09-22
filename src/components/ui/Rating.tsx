import { Star } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/cn'

const STAR_COUNT = 5

const ratingVariants = cva('flex items-center', {
    variants: {
        size: {
            sm: 'gap-0.5 text-xs',
            md: 'gap-1 text-sm',
            lg: 'gap-1.5 text-base',
        },
    },
    defaultVariants: {
        size: 'md',
    },
})

const starSize: Record<NonNullable<VariantProps<typeof ratingVariants>['size']>, string> = {
    sm: 'size-3.5',
    md: 'size-4',
    lg: 'size-5',
}

export interface RatingProps extends VariantProps<typeof ratingVariants> {
    /** Score from 0 to 5; fractional values render a partially filled star. */
    value: number
    reviewCount?: number
    className?: string
}

export function Rating({ value, reviewCount, size = 'md', className }: RatingProps) {
    const clamped = Math.min(STAR_COUNT, Math.max(0, value))
    const label =
        reviewCount === undefined
            ? `${clamped.toFixed(1)} de ${STAR_COUNT} estrellas`
            : `${clamped.toFixed(1)} de ${STAR_COUNT} estrellas, ${reviewCount} reseñas`

    return (
        <span className={cn(ratingVariants({ size }), className)} role="img" aria-label={label}>
            <span aria-hidden="true" className="flex items-center gap-0.5">
                {Array.from({ length: STAR_COUNT }, (_, index) => {
                    const fillPercent = Math.min(100, Math.max(0, (clamped - index) * 100))

                    return (
                        <span key={index} className="relative inline-flex">
                            <Star
                                className={cn(starSize[size ?? 'md'], 'text-blush-200')}
                                strokeWidth={1.5}
                            />
                            <span
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: `${fillPercent}%` }}
                            >
                                <Star
                                    className={cn(
                                        starSize[size ?? 'md'],
                                        'fill-blush-400 text-blush-400',
                                    )}
                                    strokeWidth={1.5}
                                />
                            </span>
                        </span>
                    )
                })}
            </span>

            {reviewCount !== undefined ? (
                <span aria-hidden="true" className="ml-1 font-medium text-ink-soft">
                    ({reviewCount})
                </span>
            ) : null}
        </span>
    )
}
