interface BrandStat {
    id: string
    value: string
    label: string
}

const STATS: BrandStat[] = [
    { id: 'orders', value: '+4.800', label: 'pedidos entregados' },
    { id: 'years', value: '6', label: 'años sublimando' },
    { id: 'rating', value: '4.9', label: 'promedio de reseñas' },
    { id: 'cities', value: '23', label: 'ciudades atendidas' },
]

export function StatsRow() {
    return (
        <dl className="grid grid-cols-2 gap-6 rounded-blob border border-line bg-white px-6 py-10 shadow-soft lg:grid-cols-4">
            {STATS.map((stat) => (
                <div key={stat.id} className="space-y-1 text-center">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                        <span className="block font-display text-4xl text-blush-500">
                            {stat.value}
                        </span>
                        <span className="text-sm text-ink-soft">{stat.label}</span>
                    </dd>
                </div>
            ))}
        </dl>
    )
}
