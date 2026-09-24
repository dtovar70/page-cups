import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'

import type { Product, ProductTag } from '@/@types/product'
import { AddToCartButton } from '@/components/shared/AddToCartButton'
import { PriceTag } from '@/components/shared/PriceTag'
import { ProductMedia } from '@/components/shared/ProductMedia'
import { categorySurface } from '@/components/shared/illustration/artwork'
import { Badge, Card, Rating, type BadgeProps } from '@/components/ui'
import { productPath } from '@/constants/route.constant'
import { cn } from '@/utils/cn'
import { useCategory } from '@/views/catalog/hooks/useCategories'
import { productDetailQueryOptions } from '@/views/product/hooks/useProduct'

const TAG_TONE: Record<ProductTag, NonNullable<BadgeProps['tone']>> = {
    nuevo: 'solid',
    bestseller: 'butter',
    oferta: 'sky',
    personalizable: 'mint',
}

const VISIBLE_TAGS = 2

export interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const queryClient = useQueryClient()
    const defaultVariant = product.variants.at(0)
    const accentColor = useCategory(product.category)?.colorHex
    const surface = categorySurface(product.category, accentColor ?? product.colorHex)

    const prefetchDetail = () => {
        void queryClient.prefetchQuery(productDetailQueryOptions(product.slug))
    }

    return (
        <Card
            padding="none"
            interactive
            onMouseEnter={prefetchDetail}
            onFocus={prefetchDetail}
            className="group relative flex h-full flex-col overflow-hidden"
        >
            <div
                className={cn(
                    'relative flex items-center justify-center px-6 py-6',
                    surface.className,
                )}
                style={surface.style}
            >
                <ul className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                    {product.tags.slice(0, VISIBLE_TAGS).map((tag) => (
                        <li key={tag}>
                            <Badge tone={TAG_TONE[tag]} size="sm">
                                {tag}
                            </Badge>
                        </li>
                    ))}
                </ul>

                <ProductMedia
                    category={product.category}
                    color={product.colorHex}
                    printText={product.printText}
                    accentColor={accentColor}
                    image={product.images.at(0)}
                    fallbackAlt={product.name}
                    size="md"
                    className="transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transform-none"
                />
            </div>

            <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="font-display text-lg leading-snug text-ink">
                    <Link
                        to={productPath(product.slug)}
                        className="rounded-sm after:absolute after:inset-0 after:content-['']"
                    >
                        {product.name}
                    </Link>
                </h3>

                <Rating value={product.rating} reviewCount={product.reviewCount} size="sm" />

                <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                    <PriceTag
                        price={product.price}
                        compareAtPrice={product.compareAtPrice}
                        className="min-w-0"
                    />

                    {defaultVariant ? (
                        <AddToCartButton
                            product={product}
                            variantId={defaultVariant.id}
                            size="sm"
                            className="relative z-10 shrink-0"
                        />
                    ) : null}
                </div>
            </div>
        </Card>
    )
}
