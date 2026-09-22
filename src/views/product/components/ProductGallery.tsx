import { cva } from 'class-variance-authority'

import type { CategorySlug, Product, ProductVariant } from '@/@types/product'
import { ProductIllustration } from '@/components/shared/ProductIllustration'
import { Sticker } from '@/components/ui'
import { cn } from '@/utils/cn'

const SURFACE_BY_CATEGORY: Record<CategorySlug, string> = {
    mugs: 'bg-blush-50',
    tees: 'bg-sky-50',
    keychains: 'bg-lilac-200/45',
}

const thumbVariants = cva(
    'flex size-20 items-center justify-center rounded-2xl border-2 bg-white p-1.5 transition duration-200',
    {
        variants: {
            isSelected: {
                true: 'border-blush-400',
                false: 'border-line hover:border-blush-200',
            },
        },
        defaultVariants: { isSelected: false },
    },
)

export interface ProductGalleryProps {
    product: Product
    selectedVariant?: ProductVariant
    onSelectVariant: (variantId: string) => void
}

function resolveColor(product: Product, variant?: ProductVariant): string {
    return variant?.colorHex ?? product.colorHex
}

export function ProductGallery({ product, selectedVariant, onSelectVariant }: ProductGalleryProps) {
    const hasDiscount = product.compareAtPrice !== undefined && product.compareAtPrice > product.price

    return (
        <div className="space-y-4">
            <div
                className={cn(
                    'relative flex items-center justify-center rounded-blob border border-line p-8 sm:p-12',
                    SURFACE_BY_CATEGORY[product.category],
                )}
            >
                {hasDiscount ? (
                    <Sticker tone="blush" size="lg" className="absolute top-5 left-5 shadow-lift">
                        ¡Oferta!
                    </Sticker>
                ) : null}

                <ProductIllustration
                    category={product.category}
                    color={resolveColor(product, selectedVariant)}
                    printText={product.printText}
                    size="lg"
                    className="max-w-sm"
                />
            </div>

            <ul className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                    <li key={variant.id}>
                        <button
                            type="button"
                            onClick={() => onSelectVariant(variant.id)}
                            aria-pressed={variant.id === selectedVariant?.id}
                            aria-label={`Ver ${variant.label}`}
                            className={thumbVariants({
                                isSelected: variant.id === selectedVariant?.id,
                            })}
                        >
                            <ProductIllustration
                                category={product.category}
                                color={resolveColor(product, variant)}
                                printText={product.printText}
                                size="lg"
                            />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
