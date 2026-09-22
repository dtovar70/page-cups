import { Sparkles } from 'lucide-react'

import { cn } from '@/utils/cn'

/** Two identical tracks make the -50% keyframe loop without a visible seam. */
const TRACKS = [0, 1]

export interface MarqueeProps {
    items: readonly string[]
    className?: string
}

export function Marquee({ items, className }: MarqueeProps) {
    return (
        <div className={cn('overflow-hidden bg-ink py-2 text-xs font-semibold text-cream', className)}>
            <ul className="sr-only">
                {items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>

            <div
                aria-hidden="true"
                className="flex w-max animate-marquee items-center whitespace-nowrap motion-reduce:animate-none"
            >
                {TRACKS.map((track) => (
                    <span key={track} className="flex shrink-0 items-center">
                        {items.map((item) => (
                            <span key={item} className="flex items-center gap-2 px-6">
                                <Sparkles aria-hidden="true" className="size-3.5 text-blush-300" />
                                {item}
                            </span>
                        ))}
                    </span>
                ))}
            </div>
        </div>
    )
}
