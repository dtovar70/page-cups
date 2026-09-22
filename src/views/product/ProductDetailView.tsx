import { useState } from 'react'
import { PackageOpen, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { AddToCartButton } from '@/components/shared/AddToCartButton'
import { EmptyState } from '@/components/shared/EmptyState'
import { PriceTag } from '@/components/shared/PriceTag'
import { Badge, Button, QuantityStepper, Rating } from '@/components/ui'
import { appConfig } from '@/configs/app.config'
import { CONTAINER } from '@/constants/layout.constant'
import { categoryPath, ROUTES } from '@/constants/route.constant'
import { NotFoundError } from '@/services/ProductService'
import { MAX_LINE_QUANTITY } from '@/store/cartStore'
import { cn } from '@/utils/cn'
import { ProductDetailSkeleton } from '@/views/product/components/ProductDetailSkeleton'
import { ProductGallery } from '@/views/product/components/ProductGallery'
import { ProductMeta } from '@/views/product/components/ProductMeta'
import { RelatedProducts } from '@/views/product/components/RelatedProducts'
import { VariantPicker } from '@/views/product/components/VariantPicker'
import { useCategories } from '@/views/catalog/hooks/useCategories'
import { useProduct } from '@/views/product/hooks/useProduct'
import { NotFoundView } from '@/views/others/NotFoundView'

const pageClass = 'space-y-16 py-10 lg:py-14'
const breadcrumbLinkClass = 'text-ink-soft transition hover:text-blush-600'

export function ProductDetailView() {
    const { slug = '' } = useParams()
    const { data: product, isPending, isError, error, refetch } = useProduct(slug)
    const { data: categories } = useCategories()
    const [chosenVariantId, setChosenVariantId] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)

    if (error instanceof NotFoundError) return <NotFoundView />

    if (isPending) {
        return (
            <div className={cn(CONTAINER, pageClass)}>
                <h1 className="sr-only">Cargando producto</h1>
                <ProductDetailSkeleton />
            </div>
        )
    }

    if (isError) {
        return (
            <div className={cn(CONTAINER, pageClass)}>
                <h1 className="sr-only">Producto no disponible</h1>
                <EmptyState
                    title="No pudimos cargar este producto"
                    description="Revisa tu conexión e inténtalo de nuevo."
                    icon={<PackageOpen className="size-6" />}
                    action={
                        <Button variant="secondary" onClick={() => void refetch()}>
                            Reintentar
                        </Button>
                    }
                />
            </div>
        )
    }

    const selectedVariant =
        product.variants.find((variant) => variant.id === chosenVariantId) ?? product.variants.at(0)
    const unitPrice = product.price + (selectedVariant?.priceDelta ?? 0)
    const maxQuantity = Math.max(1, Math.min(product.stock, MAX_LINE_QUANTITY))
    const safeQuantity = Math.min(quantity, maxQuantity)

    return (
        <div className={cn(CONTAINER, pageClass)}>
            <nav aria-label="Ruta de navegación" className="text-sm">
                <ol className="flex flex-wrap items-center gap-2">
                    <li>
                        <Link to={ROUTES.home} className={breadcrumbLinkClass}>
                            Inicio
                        </Link>
                    </li>
                    <li aria-hidden="true" className="text-line">
                        /
                    </li>
                    <li>
                        <Link to={ROUTES.catalog} className={breadcrumbLinkClass}>
                            Catálogo
                        </Link>
                    </li>
                    <li aria-hidden="true" className="text-line">
                        /
                    </li>
                    <li>
                        <Link to={categoryPath(product.category)} className={breadcrumbLinkClass}>
                            {(categories ?? []).find(
                                (category) => category.slug === product.category,
                            )?.name ?? 'Categoría'}
                        </Link>
                    </li>
                </ol>
            </nav>

            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
                <ProductGallery
                    product={product}
                    selectedVariant={selectedVariant}
                    onSelectVariant={setChosenVariantId}
                />

                <div className="space-y-6">
                    <ul className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                            <li key={tag}>
                                <Badge size="sm">{tag}</Badge>
                            </li>
                        ))}
                    </ul>

                    <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
                        {product.name}
                    </h1>

                    <Rating value={product.rating} reviewCount={product.reviewCount} size="lg" />

                    <PriceTag
                        price={unitPrice}
                        compareAtPrice={product.compareAtPrice}
                        size="lg"
                    />

                    <p className="text-ink-soft">{product.description}</p>

                    <VariantPicker
                        variants={product.variants}
                        selectedVariantId={selectedVariant?.id}
                        onSelect={setChosenVariantId}
                    />

                    <div className="flex flex-wrap items-center gap-3">
                        <QuantityStepper
                            value={safeQuantity}
                            max={maxQuantity}
                            onChange={setQuantity}
                        />

                        {selectedVariant ? (
                            <AddToCartButton
                                product={product}
                                variantId={selectedVariant.id}
                                quantity={safeQuantity}
                                size="lg"
                                label="Agregar al carrito"
                            />
                        ) : null}
                    </div>

                    <p className="flex items-center gap-2 text-sm text-ink-soft">
                        <Truck aria-hidden="true" className="size-4 text-blush-500" />
                        {appConfig.shipping.freeShippingCopy} · {appConfig.shipping.productionCopy}
                    </p>
                </div>
            </div>

            <ProductMeta product={product} />

            <RelatedProducts slug={product.slug} />
        </div>
    )
}
