import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/cn'

const spinnerVariants = cva('animate-spin rounded-full border-current border-t-transparent', {
    variants: {
        size: {
            sm: 'size-4 border-2',
            md: 'size-6 border-2',
            lg: 'size-10 border-[3px]',
        },
    },
    defaultVariants: {
        size: 'md',
    },
})

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
    className?: string
    label?: string
}

export function Spinner({ size, className, label = 'Cargando' }: SpinnerProps) {
    return (
        <span role="status" aria-live="polite" className={cn(spinnerVariants({ size }), className)}>
            <span className="sr-only">{label}</span>
        </span>
    )
}
