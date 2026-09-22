import { useEffect, useRef, useState } from 'react'
import { Check, ShoppingBag } from 'lucide-react'

import type { Product } from '@/@types/product'
import { Button, type ButtonProps } from '@/components/ui'
import { useCartActions } from '@/store/cartStore'
import { useCartDrawer } from '@/store/uiStore'

const CONFIRMATION_MS = 1600

export interface AddToCartButtonProps extends Pick<ButtonProps, 'size' | 'variant' | 'fullWidth' | 'className'> {
    product: Product
    variantId: string
    quantity?: number
    label?: string
    /** Opening the drawer is the default success feedback; cards can opt out. */
    openDrawerOnAdd?: boolean
}

export function AddToCartButton({
    product,
    variantId,
    quantity = 1,
    label = 'Agregar',
    openDrawerOnAdd = true,
    ...buttonProps
}: AddToCartButtonProps) {
    const { addItem } = useCartActions()
    const { open } = useCartDrawer()
    const [isConfirming, setIsConfirming] = useState(false)
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

    useEffect(() => () => clearTimeout(timeoutRef.current), [])

    const handleClick = () => {
        addItem(product, variantId, quantity)
        setIsConfirming(true)
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setIsConfirming(false), CONFIRMATION_MS)

        if (openDrawerOnAdd) open()
    }

    const isSoldOut = product.stock <= 0

    return (
        <Button
            onClick={handleClick}
            disabled={isSoldOut}
            leadingIcon={
                isConfirming ? (
                    <Check aria-hidden="true" className="size-4" />
                ) : (
                    <ShoppingBag aria-hidden="true" className="size-4" />
                )
            }
            {...buttonProps}
        >
            {isSoldOut ? 'Agotado' : isConfirming ? '¡Agregado!' : label}
        </Button>
    )
}
