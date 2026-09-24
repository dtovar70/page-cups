import { cva, type VariantProps } from 'class-variance-authority'

import type { CategorySlug } from '@/@types/product'
import { ProductIllustration } from '@/components/shared/ProductIllustration'
import { cn } from '@/utils/cn'

/** Same width caps as `ProductIllustration`, so a photo and a drawing occupy the same slot. */
const photoVariants = cva('aspect-square w-full rounded-2xl object-cover select-none', {
    variants: {
        size: {
            sm: 'max-w-16 rounded-xl',
            md: 'max-w-60',
            lg: 'max-w-full',
        },
    },
    defaultVariants: {
        size: 'md',
    },
})

export interface ProductMediaImage {
    url: string
    alt?: string | null
}

export interface ProductMediaProps extends VariantProps<typeof photoVariants> {
    category: CategorySlug
    color: string
    printText: string
    /** Category color, used to tint the generic illustration (see `ProductIllustration`). */
    accentColor?: string
    /** Uploaded photo; when missing, the generated illustration is drawn instead. */
    image?: ProductMediaImage
    /** Accessible name for the photo when it has no `alt` of its own. */
    fallbackAlt?: string
    className?: string
    loading?: 'eager' | 'lazy'
}

/** A product's photo when it has one, otherwise its generated illustration. */
export function ProductMedia({
    category,
    color,
    printText,
    accentColor,
    image,
    fallbackAlt,
    size,
    className,
    loading = 'lazy',
}: ProductMediaProps) {
    if (!image) {
        return (
            <ProductIllustration
                category={category}
                color={color}
                printText={printText}
                accentColor={accentColor}
                size={size}
                className={className}
            />
        )
    }

    return (
        <img
            src={image.url}
            alt={image.alt || fallbackAlt || ''}
            loading={loading}
            decoding="async"
            draggable={false}
            className={cn(photoVariants({ size }), className)}
        />
    )
}
