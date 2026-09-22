import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/cn'

const headingVariants = cva('font-display tracking-tight text-balance text-ink', {
    variants: {
        level: {
            h1: 'text-4xl uppercase sm:text-5xl lg:text-6xl',
            h2: 'text-3xl uppercase sm:text-4xl lg:text-5xl',
            h3: 'text-2xl sm:text-3xl',
        },
    },
    defaultVariants: {
        level: 'h2',
    },
})

export interface SectionHeadingProps extends VariantProps<typeof headingVariants> {
    title: string
    /** Applied to the heading element so a section can reference it with aria-labelledby. */
    headingId?: string
    /** Word inside `title` painted in blush, the brand's signature headline accent. */
    highlight?: string
    eyebrow?: string
    description?: string
    align?: 'left' | 'center'
    action?: ReactNode
    className?: string
}

function splitOnHighlight(title: string, highlight?: string): [string, string, string] {
    if (!highlight) return [title, '', '']

    const index = title.toLowerCase().indexOf(highlight.toLowerCase())
    if (index < 0) return [title, '', '']

    return [
        title.slice(0, index),
        title.slice(index, index + highlight.length),
        title.slice(index + highlight.length),
    ]
}

export function SectionHeading({
    title,
    headingId,
    highlight,
    eyebrow,
    description,
    align = 'left',
    level = 'h2',
    action,
    className,
}: SectionHeadingProps) {
    const Heading = level ?? 'h2'
    const [before, accent, after] = splitOnHighlight(title, highlight)

    return (
        <div
            className={cn(
                'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
                align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
                className,
            )}
        >
            <div className={cn('max-w-2xl space-y-3', align === 'center' && 'mx-auto')}>
                {eyebrow ? (
                    <p className="font-display text-sm font-semibold tracking-[0.2em] text-blush-500 uppercase">
                        {eyebrow}
                    </p>
                ) : null}

                <Heading id={headingId} className={headingVariants({ level })}>
                    {before}
                    {accent ? <span className="text-blush-500">{accent}</span> : null}
                    {after}
                </Heading>

                {description ? <p className="text-base text-ink-soft sm:text-lg">{description}</p> : null}
            </div>

            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    )
}
