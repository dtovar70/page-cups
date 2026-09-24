import type { AboutStat } from '@/@types/content'

export interface StatsRowProps {
    stats: AboutStat[]
}

export function StatsRow({ stats }: StatsRowProps) {
    return (
        <dl className="grid grid-cols-2 gap-6 rounded-blob border border-line bg-white px-6 py-10 shadow-soft lg:grid-cols-4">
            {stats.map((stat, index) => (
                <div key={index} className="space-y-1 text-center">
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
