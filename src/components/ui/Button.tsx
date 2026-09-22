import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { buttonVariants, type ButtonVariantProps } from '@/components/ui/Button.variants'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/utils/cn'

export interface ButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>, ButtonVariantProps {
    isLoading?: boolean
    leadingIcon?: ReactNode
    trailingIcon?: ReactNode
}

export function Button({
    variant,
    size,
    fullWidth,
    isLoading = false,
    leadingIcon,
    trailingIcon,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(buttonVariants({ variant, size, fullWidth }), className)}
            disabled={disabled ?? isLoading}
            aria-busy={isLoading || undefined}
            {...rest}
        >
            {isLoading ? <Spinner size="sm" /> : leadingIcon}
            {children}
            {trailingIcon}
        </button>
    )
}
