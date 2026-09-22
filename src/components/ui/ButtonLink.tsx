import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

import { buttonVariants, type ButtonVariantProps } from '@/components/ui/Button.variants'
import { cn } from '@/utils/cn'

export interface ButtonLinkProps extends Omit<LinkProps, 'color'>, ButtonVariantProps {
    leadingIcon?: ReactNode
    trailingIcon?: ReactNode
}

export function ButtonLink({
    variant,
    size,
    fullWidth,
    leadingIcon,
    trailingIcon,
    className,
    children,
    ...rest
}: ButtonLinkProps) {
    return (
        <Link className={cn(buttonVariants({ variant, size, fullWidth }), className)} {...rest}>
            {leadingIcon}
            {children}
            {trailingIcon}
        </Link>
    )
}
