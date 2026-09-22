import { PackageOpen, SearchX, X } from 'lucide-react'

import { EmptyState } from '@/components/shared/EmptyState'
import { ProductGrid } from '@/components/shared/ProductGrid'
import { Button, Card } from '@/components/ui'
import { CONTAINER } from '@/constants/layout.constant'
import { cn } from '@/utils/cn'
import { CatalogFilters } from '@/views/catalog/components/CatalogFilters'
import { CatalogPagination } from '@/views/catalog/components/CatalogPagination'
import { CatalogToolbar } from '@/views/catalog/components/CatalogToolbar'
import { CATALOG_PAGE_SIZE, useCatalogFilters } from '@/views/catalog/hooks/useCatalogFilters'
import { useCategories } from '@/views/catalog/hooks/useCategories'
import { useProducts } from '@/views/catalog/hooks/useProducts'

export function CatalogView() {
    const catalog = useCatalogFilters()
    const { filters } = catalog
    const { data, isPending, isError, isPlaceholderData, refetch } = useProducts(catalog.queryParams)
    const { data: categories } = useCategories()

    const activeCategory = (categories ?? []).find((category) => category.slug === filters.category)
    const products = data?.items ?? []
    const hasNoResults = !isPending && !isError && products.length === 0

    return (
        <div className={cn(CONTAINER, 'space-y-8 py-12 lg:py-16')}>
            <header className="space-y-3">
                <p className="font-display text-sm font-semibold tracking-[0.2em] text-blush-500 uppercase">
                    Catálogo
                </p>
                <h1 className="font-display text-4xl tracking-tight text-ink uppercase sm:text-5xl">
                    {activeCategory?.name ?? 'Todo lo que sublimamos'}
                </h1>
                <p className="max-w-2xl text-ink-soft">
                    {activeCategory?.description ??
                        'Filtra por categoría, precio o etiqueta. Cada diseño se personaliza con tu texto o tu foto.'}
                </p>

                {filters.search ? (
                    <p className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
                        Resultados para
                        <span className="inline-flex items-center gap-2 rounded-full bg-blush-100 px-3 py-1 font-semibold text-blush-700">
                            {filters.search}
                            <button
                                type="button"
                                onClick={() => catalog.setSearch('')}
                                aria-label="Quitar la búsqueda"
                                className="rounded-full"
                            >
                                <X aria-hidden="true" className="size-3.5" />
                            </button>
                        </span>
                    </p>
                ) : null}
            </header>

            <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
                <aside aria-label="Filtros del catálogo" className="h-fit lg:sticky lg:top-28">
                    <Card padding="lg">
                        <CatalogFilters
                            filters={filters}
                            isFiltered={catalog.isFiltered}
                            onCategoryChange={catalog.setCategory}
                            onPriceBracketChange={catalog.setPriceBracket}
                            onTagToggle={catalog.toggleTag}
                            onClear={catalog.clearFilters}
                        />
                    </Card>
                </aside>

                <section aria-label="Resultados" className="space-y-6">
                    <CatalogToolbar
                        total={data?.total ?? 0}
                        sort={filters.sort}
                        isRefreshing={isPlaceholderData}
                        onSortChange={catalog.setSort}
                    />

                    {isError ? (
                        <EmptyState
                            title="No pudimos cargar el catálogo"
                            description="Hubo un problema al traer los productos. Inténtalo otra vez."
                            icon={<PackageOpen className="size-6" />}
                            action={
                                <Button variant="secondary" onClick={() => void refetch()}>
                                    Reintentar
                                </Button>
                            }
                        />
                    ) : hasNoResults ? (
                        <EmptyState
                            title="No encontramos nada con esos filtros"
                            description="Prueba con menos filtros o busca otra palabra."
                            icon={<SearchX className="size-6" />}
                            action={
                                <Button variant="secondary" onClick={catalog.clearFilters}>
                                    Limpiar filtros
                                </Button>
                            }
                        />
                    ) : (
                        <ProductGrid
                            products={products}
                            isPending={isPending}
                            skeletonCount={CATALOG_PAGE_SIZE}
                            className="xl:grid-cols-3"
                        />
                    )}

                    <CatalogPagination
                        page={data?.page ?? 1}
                        totalPages={data?.totalPages ?? 1}
                        onPageChange={catalog.setPage}
                    />
                </section>
            </div>
        </div>
    )
}
