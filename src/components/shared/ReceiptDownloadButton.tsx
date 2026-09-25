import { useState } from 'react'
import { Download } from 'lucide-react'

import { Alert, Button, type ButtonProps } from '@/components/ui'
import { getErrorMessage } from '@/services/errors'

export interface ReceiptDownloadButtonProps {
    /** Order code: the file is saved as `comprobante-<code>.pdf`. */
    code: string
    /** Fetches the PDF (customer link or admin session). */
    load: () => Promise<Blob>
    size?: ButtonProps['size']
    variant?: ButtonProps['variant']
    className?: string
}

/** Saves a blob through a temporary link (works across origins, unlike `download` on a URL). */
function saveBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

/** "Descargar comprobante": the purchase receipt PDF, with the API's message when it fails. */
export function ReceiptDownloadButton({
    code,
    load,
    size = 'sm',
    variant = 'secondary',
    className,
}: ReceiptDownloadButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const download = async () => {
        setIsLoading(true)
        setError(null)
        try {
            saveBlob(await load(), `comprobante-${code}.pdf`)
        } catch (caught) {
            setError(getErrorMessage(caught))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={className}>
            <Button
                variant={variant}
                size={size}
                isLoading={isLoading}
                onClick={() => void download()}
                leadingIcon={<Download aria-hidden="true" className="size-4" />}
            >
                Descargar comprobante
            </Button>
            {error ? (
                <Alert className="mt-3" onDismiss={() => setError(null)}>
                    {error}
                </Alert>
            ) : null}
        </div>
    )
}
