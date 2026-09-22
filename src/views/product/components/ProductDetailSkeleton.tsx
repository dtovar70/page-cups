import { Skeleton } from '@/components/ui'

const DETAIL_LINES = ['line-1', 'line-2', 'line-3']

export function ProductDetailSkeleton() {
    return (
        <div className="grid gap-10 lg:grid-cols-2" aria-busy="true" aria-label="Cargando producto">
            <Skeleton shape="block" className="aspect-square w-full" />

            <div className="space-y-5">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="w-1/3" />
                <Skeleton className="h-8 w-28" />
                {DETAIL_LINES.map((line) => (
                    <Skeleton key={line} className="w-full" />
                ))}
                <Skeleton shape="block" className="h-12 w-48 rounded-full" />
            </div>
        </div>
    )
}
