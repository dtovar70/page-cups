import { PackageOpen } from 'lucide-react'

import { CategoryCard } from '@/components/shared/CategoryCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Button, Skeleton } from '@/components/ui'
import { CONTAINER } from '@/constants/layout.constant'
import { cn } from '@/utils/cn'
import { useCategories } from '@/views/catalog/hooks/useCategories'

const SKELETON_COUNT = 3

export function CategoryStrip() {
    const { data: categories, isPending, isError, refetch } = useCategories()

    return (
        <section aria-labelledby="categories-heading" className="bg-sky-50 py-16 lg:py-24">
            <div className={cn(CONTAINER, 'space-y-10')}>
                <SectionHeading
                    headingId="categories-heading"
                    eyebrow="Qué hacemos"
                    title="Elige tu lienzo favorito"
                    highlight="lienzo"
                    description="Tres formatos, infinitas ideas. Todos se personalizan con tu texto, tu foto o tu logo."
                />

                {isError ? (
                    <EmptyState
                        title="No pudimos cargar las categorías"
                        description="Revisa tu conexión e inténtalo otra vez."
                        icon={<PackageOpen className="size-6" />}
                        action={
                            <Button variant="secondary" onClick={() => void refetch()}>
                                Reintentar
                            </Button>
                        }
                    />
                ) : (
                    <ul className="grid gap-6 md:grid-cols-3">
                        {isPending
                            ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
                                  <li key={index}>
                                      <Skeleton shape="block" className="h-96 w-full" />
                                  </li>
                              ))
                            : (categories ?? []).map((category) => (
                                  <li key={category.slug} className="h-full">
                                      <CategoryCard category={category} />
                                  </li>
                              ))}
                    </ul>
                )}
            </div>
        </section>
    )
}
