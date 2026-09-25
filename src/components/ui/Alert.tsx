import type { CSSProperties, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CircleAlert, CircleCheck, Info, X, type LucideIcon } from 'lucide-react'

import { cn } from '@/utils/cn'

const alertVariants = cva(
    'group relative flex items-start gap-3 overflow-hidden rounded-2xl border-2 px-4 py-3 text-sm font-medium',
    {
        variants: {
            tone: {
                success: 'border-mint-400/60 bg-mint-200/50 text-ink',
                error: 'border-blush-300 bg-blush-50 text-blush-800',
                info: 'border-sky-300 bg-sky-50 text-sky-900',
            },
        },
        defaultVariants: {
            tone: 'error',
        },
    },
)

type AlertTone = NonNullable<VariantProps<typeof alertVariants>['tone']>

const TONE_DETAILS: Record<AlertTone, { icon: LucideIcon; iconClass: string; barClass: string }> = {
    success: { icon: CircleCheck, iconClass: 'text-mint-400', barClass: 'bg-mint-400' },
    error: { icon: CircleAlert, iconClass: 'text-blush-600', barClass: 'bg-blush-400' },
    info: { icon: Info, iconClass: 'text-sky-600', barClass: 'bg-sky-400' },
}

export interface AlertProps extends VariantProps<typeof alertVariants> {
    children: ReactNode
    className?: string
    /** Shows a close button; with `autoDismissMs` it also fires when the countdown ends. */
    onDismiss?: () => void
    /** Countdown before `onDismiss` fires. Pauses while hovered or focused. */
    autoDismissMs?: number
}

/** Inline status message. Errors interrupt screen readers; other tones wait their turn. */
export function Alert({
    tone = 'error',
    children,
    className,
    onDismiss,
    autoDismissMs,
}: AlertProps) {
    const { icon: Icon, iconClass, barClass } = TONE_DETAILS[tone ?? 'error']
    const hasCountdown = onDismiss !== undefined && autoDismissMs !== undefined

    return (
        <div
            role={tone === 'error' ? 'alert' : 'status'}
            className={cn(alertVariants({ tone }), className)}
        >
            <Icon aria-hidden="true" className={cn('mt-0.5 size-4 shrink-0', iconClass)} />
            <div className="min-w-0 flex-1">{children}</div>

            {onDismiss ? (
                <button
                    type="button"
                    onClick={onDismiss}
                    aria-label="Cerrar mensaje"
                    className="-my-1 -mr-2 grid size-7 shrink-0 place-items-center rounded-full text-ink-soft transition hover:bg-white/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-blush-400"
                >
                    <X aria-hidden="true" className="size-4" />
                </button>
            ) : null}

            {hasCountdown ? (
                <span
                    aria-hidden="true"
                    data-countdown=""
                    onAnimationEnd={onDismiss}
                    style={
                        {
                            animationDuration: `${autoDismissMs}ms`,
                            '--countdown-duration': `${autoDismissMs}ms`,
                        } as CSSProperties
                    }
                    className={cn(
                        'absolute inset-x-0 bottom-0 h-1 origin-left animate-countdown',
                        'group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]',
                        barClass,
                    )}
                />
            ) : null}
        </div>
    )
}
