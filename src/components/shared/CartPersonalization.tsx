import { useState } from 'react'
import { PenLine } from 'lucide-react'

import type { CartItem } from '@/@types/cart'
import { PERSONALIZATION_MAX_LENGTH } from '@/@types/order'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Textarea } from '@/components/ui'
import { useCartActions } from '@/store/cartStore'
import { cn } from '@/utils/cn'

export interface CartPersonalizationProps {
    item: CartItem
    /** `sm` for the cart drawer. */
    size?: 'sm' | 'md'
    /**
     * Shows the edit button. The drawer passes false: it runs its own focus trap and Escape
     * handling, so the text is edited from the cart page instead.
     */
    editable?: boolean
}

/**
 * The line's text to print and, for personalizable products, a small dialog to change it.
 * The same product with another text becomes (or merges into) another line.
 */
export function CartPersonalization({
    item,
    size = 'md',
    editable = true,
}: CartPersonalizationProps) {
    const { updatePersonalization } = useCartActions()
    const [isOpen, setIsOpen] = useState(false)
    const [draft, setDraft] = useState('')

    if (!item.personalization && !(editable && item.personalizable)) return null
    const textClass = size === 'sm' ? 'text-xs' : 'text-sm'

    return (
        <div className={cn('flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1', textClass)}>
            {item.personalization ? (
                <p className="min-w-0 break-words text-ink">
                    <span className="text-ink-soft">Personalización:</span> “{item.personalization}”
                </p>
            ) : (
                <p className="text-ink-soft">Sin personalización</p>
            )}
            {editable && item.personalizable ? (
                <button
                    type="button"
                    onClick={() => {
                        setDraft(item.personalization)
                        setIsOpen(true)
                    }}
                    aria-label={`${item.personalization ? 'Editar' : 'Agregar'} personalización de ${item.name}`}
                    className="inline-flex items-center gap-1 rounded-full font-semibold text-blush-700 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-blush-400 focus-visible:ring-offset-2"
                >
                    <PenLine aria-hidden="true" className="size-3.5" />
                    {item.personalization ? 'Editar' : 'Agregar'}
                </button>
            ) : null}

            <ConfirmDialog
                isOpen={isOpen}
                title="Personalización"
                description={`${item.name} · ${item.variantLabel}`}
                confirmLabel="Guardar"
                cancelLabel="Cancelar"
                confirmVariant="primary"
                onConfirm={() => {
                    updatePersonalization(item.lineId, draft)
                    setIsOpen(false)
                }}
                onClose={() => setIsOpen(false)}
            >
                <Textarea
                    label="Texto, nombre o fecha"
                    optional
                    rows={3}
                    maxLength={PERSONALIZATION_MAX_LENGTH}
                    showCount
                    placeholder={item.printText ? `Ej. ${item.printText}` : undefined}
                    hint="Déjalo vacío si no quieres personalizarla."
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                />
            </ConfirmDialog>
        </div>
    )
}
