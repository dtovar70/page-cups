import { cva } from 'class-variance-authority'

import type { ProductVariant } from '@/@types/product'
import { formatCurrency } from '@/utils/formatCurrency'

const optionVariants = cva(
    'inline-flex cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition duration-200 focus-within:ring-2 focus-within:ring-blush-400 focus-within:ring-offset-2',
    {
        variants: {
            isSelected: {
                true: 'border-blush-400 bg-blush-100 text-blush-700',
                false: 'border-line bg-white text-ink-soft hover:border-blush-200 hover:text-ink',
            },
        },
        defaultVariants: { isSelected: false },
    },
)

export interface VariantPickerProps {
    variants: ProductVariant[]
    selectedVariantId?: string
    onSelect: (variantId: string) => void
}

export function VariantPicker({ variants, selectedVariantId, onSelect }: VariantPickerProps) {
    if (variants.length === 0) return null

    return (
        <fieldset className="space-y-3">
            <legend className="font-display text-base text-ink">Elige tu versión</legend>

            <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                    <label
                        key={variant.id}
                        className={optionVariants({ isSelected: variant.id === selectedVariantId })}
                    >
                        <input
                            type="radio"
                            name="variant"
                            className="sr-only"
                            value={variant.id}
                            checked={variant.id === selectedVariantId}
                            onChange={() => onSelect(variant.id)}
                        />
                        {variant.label}
                        {variant.priceDelta > 0 ? (
                            <span className="text-xs text-ink-soft">
                                +{formatCurrency(variant.priceDelta)}
                            </span>
                        ) : null}
                    </label>
                ))}
            </div>
        </fieldset>
    )
}
