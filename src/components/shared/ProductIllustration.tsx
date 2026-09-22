import type { ReactElement } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import type { CategorySlug } from '@/@types/product'
import { KeychainArtwork } from '@/components/shared/illustration/KeychainArtwork'
import { MugArtwork } from '@/components/shared/illustration/MugArtwork'
import { TeeArtwork } from '@/components/shared/illustration/TeeArtwork'
import {
    ARTWORK_VIEW_BOX,
    CATEGORY_NOUN,
    type ArtworkProps,
} from '@/components/shared/illustration/artwork'
import { CATEGORY_THEME } from '@/constants/theme.constant'
import { cn } from '@/utils/cn'

const illustrationVariants = cva('h-auto w-full select-none', {
    variants: {
        size: {
            sm: 'max-w-16',
            md: 'max-w-60',
            lg: 'max-w-full',
        },
    },
    defaultVariants: {
        size: 'md',
    },
})

const ARTWORK_BY_CATEGORY: Record<CategorySlug, (props: ArtworkProps) => ReactElement> = {
    mugs: MugArtwork,
    tees: TeeArtwork,
    keychains: KeychainArtwork,
}

export interface ProductIllustrationProps extends VariantProps<typeof illustrationVariants> {
    category: CategorySlug
    /** Body color of the product; pass the selected variant color when there is one. */
    color: string
    printText: string
    className?: string
}

export function ProductIllustration({
    category,
    color,
    printText,
    size,
    className,
}: ProductIllustrationProps) {
    const theme = CATEGORY_THEME[category]
    const Artwork = ARTWORK_BY_CATEGORY[category]

    return (
        <svg
            viewBox={ARTWORK_VIEW_BOX}
            role="img"
            aria-label={`${CATEGORY_NOUN[category]} personalizada con el texto “${printText}”`}
            className={cn(illustrationVariants({ size }), className)}
        >
            <circle cx={120} cy={104} r={78} fill={theme.accent} opacity={0.35} />
            <Artwork color={color} theme={theme} printText={printText} />
        </svg>
    )
}
