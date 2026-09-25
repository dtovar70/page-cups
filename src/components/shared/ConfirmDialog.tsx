import { useEffect, useId, useRef, type ReactNode } from 'react'

import { Alert, Button, type ButtonProps } from '@/components/ui'
import { cn } from '@/utils/cn'

export interface ConfirmDialogProps {
    isOpen: boolean
    title: string
    description?: ReactNode
    confirmLabel?: string
    cancelLabel?: string
    isLoading?: boolean
    /** Shown inside the dialog, e.g. when the confirmed request failed. */
    error?: string
    /** `danger` (default) for destructive actions, `primary` for positive ones. */
    confirmVariant?: Extract<ButtonProps['variant'], 'danger' | 'primary'>
    /** Keeps the confirm button disabled, e.g. until a required reason is typed. */
    confirmDisabled?: boolean
    /** Extra content between the description and the buttons, e.g. a reason field. */
    children?: ReactNode
    /**
     * Replaces the confirm button (the cancel one stays), for dialogs whose actions are links
     * or several buttons. `onConfirm` is then unused.
     */
    actions?: ReactNode
    /** `lg` for dialogs that hold a whole form. */
    size?: 'md' | 'lg'
    onConfirm?: () => void
    onClose: () => void
}

/**
 * Built on the native `<dialog>`: `showModal()` gives the focus trap, the inert page behind
 * it and Escape-to-close for free.
 */
export function ConfirmDialog({
    isOpen,
    title,
    description,
    confirmLabel = 'Eliminar',
    cancelLabel = 'Cancelar',
    isLoading = false,
    error,
    confirmVariant = 'danger',
    confirmDisabled = false,
    children,
    actions,
    size = 'md',
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const titleId = useId()
    const descriptionId = useId()

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (isOpen && !dialog.open) dialog.showModal()
        if (!isOpen && dialog.open) dialog.close()
    }, [isOpen])

    const requestClose = () => {
        if (!isLoading) onClose()
    }

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            onCancel={(event) => {
                // Escape: keep React as the owner of the open state.
                event.preventDefault()
                requestClose()
            }}
            onClick={(event) => {
                // A click on the element itself (not its content) is a click on the backdrop.
                if (event.target === event.currentTarget) requestClose()
            }}
            className={cn(
                'fixed inset-0 m-auto h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto overscroll-contain rounded-3xl bg-cream p-0 text-ink shadow-lift backdrop:bg-ink/40 backdrop:backdrop-blur-sm',
                size === 'lg' ? 'max-w-2xl' : 'max-w-md',
            )}
        >
            {isOpen ? (
                <div className="space-y-5 p-6">
                    <div className="space-y-2">
                        <h2 id={titleId} className="font-display text-xl">
                            {title}
                        </h2>
                        {description ? (
                            <div id={descriptionId} className="text-sm text-ink-soft">
                                {description}
                            </div>
                        ) : null}
                    </div>

                    {children}

                    {error ? <Alert>{error}</Alert> : null}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button variant="secondary" onClick={requestClose} disabled={isLoading}>
                            {cancelLabel}
                        </Button>
                        {actions ?? (
                            <Button
                                variant={confirmVariant}
                                onClick={onConfirm}
                                isLoading={isLoading}
                                disabled={confirmDisabled || isLoading}
                            >
                                {confirmLabel}
                            </Button>
                        )}
                    </div>
                </div>
            ) : null}
        </dialog>
    )
}
