import { type CSSProperties } from 'react'
import { PawPrint } from 'lucide-react'

import { appConfig } from '@/configs/app.config'
import { cn } from '@/utils/cn'

/**
 * One entry per footstep. `lift` alternates the paw above and below the line and `tilt`
 * angles it, so the trail reads as a gait instead of a row of icons blinking.
 */
const STEPS = [
    { id: 'fl-1', lift: '-0.45rem', tilt: -14 },
    { id: 'fr-1', lift: '0.45rem', tilt: 12 },
    { id: 'fl-2', lift: '-0.35rem', tilt: -10 },
    { id: 'fr-2', lift: '0.5rem', tilt: 14 },
    { id: 'fl-3', lift: '-0.5rem', tilt: -12 },
    { id: 'fr-3', lift: '0.35rem', tilt: 10 },
]

/** Seconds between one paw landing and the next. */
const STEP_INTERVAL = 0.16

/**
 * The keyframes own `transform` (they add the scale pop), so the per-paw offset travels
 * as custom properties instead — an inline transform would simply be overridden.
 */
type PawStyle = CSSProperties & Record<'--paw-lift' | '--paw-tilt', string>

export interface PawTrailLoaderProps {
    /** Shown under the trail and announced to assistive tech. */
    message?: string
    className?: string
}

export function PawTrailLoader({ message = 'Preparando todo…', className }: PawTrailLoaderProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={cn('flex flex-col items-center gap-6', className)}
        >
            <div className="relative flex items-center justify-center">
                <span
                    aria-hidden="true"
                    className="absolute size-32 rounded-full bg-blush-200 opacity-60 blur-2xl"
                />
                <img
                    src={appConfig.logo.src}
                    srcSet={appConfig.logo.srcSet}
                    sizes="96px"
                    alt=""
                    width={96}
                    height={96}
                    className="relative size-20 animate-breathe rounded-2xl ring-1 ring-ink/5 motion-reduce:animate-none sm:size-24"
                />
            </div>

            <div aria-hidden="true" className="flex items-center gap-1.5 sm:gap-2">
                {STEPS.map((step, index) => {
                    const style: PawStyle = {
                        '--paw-lift': step.lift,
                        '--paw-tilt': `${step.tilt}deg`,
                        animationDelay: `${index * STEP_INTERVAL}s`,
                    }

                    return (
                        <PawPrint
                            key={step.id}
                            style={style}
                            className={cn(
                                'size-5 animate-paw-step motion-reduce:animate-none motion-reduce:opacity-70 sm:size-6',
                                index % 2 === 0 ? 'text-blush-400' : 'text-sky-400',
                            )}
                        />
                    )
                })}
            </div>

            <p className="font-display text-lg text-ink-soft">{message}</p>
        </div>
    )
}
