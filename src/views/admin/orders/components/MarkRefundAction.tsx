import { useState } from 'react'

import type { AdminOrder } from '@/@types/order'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button, Input } from '@/components/ui'
import { getErrorMessage } from '@/services/errors'
import { useMarkRefunded } from '@/views/admin/hooks/useAdminOrders'

/** "Marcar reembolso realizado" for a cancelled order whose money was given back. */
export function MarkRefundAction({ order }: { order: AdminOrder }) {
    const markRefunded = useMarkRefunded(order.code)
    const [isOpen, setIsOpen] = useState(false)
    const [reference, setReference] = useState('')

    return (
        <>
            <Button
                variant="primary"
                size="sm"
                onClick={() => {
                    markRefunded.reset()
                    setReference('')
                    setIsOpen(true)
                }}
            >
                Marcar reembolso realizado
            </Button>
            <ConfirmDialog
                isOpen={isOpen}
                title="¿Ya le devolviste el dinero al cliente?"
                description="El pedido deja de aparecer en «Reembolsos pendientes» y queda una nota interna."
                confirmLabel="Marcar como reembolsado"
                cancelLabel="Volver"
                confirmVariant="primary"
                isLoading={markRefunded.isPending}
                error={markRefunded.isError ? getErrorMessage(markRefunded.error) : undefined}
                onConfirm={() =>
                    markRefunded.mutate(reference.trim() || undefined, {
                        onSuccess: () => setIsOpen(false),
                    })
                }
                onClose={() => setIsOpen(false)}
            >
                <Input
                    label="Referencia del reembolso"
                    optional
                    maxLength={60}
                    inputMode="numeric"
                    autoComplete="off"
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                />
            </ConfirmDialog>
        </>
    )
}
