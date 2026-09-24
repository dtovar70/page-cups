import type { UseFormRegisterReturn } from 'react-hook-form'

import { Input } from '@/components/ui'
import { HIGHLIGHT_HINT, HighlightPreview } from '@/views/admin/content/components/HighlightPreview'

export interface TitleFieldProps {
    label: string
    /** Current value (from `useWatch`), for the live preview. */
    value: string
    registration: UseFormRegisterReturn
    error?: string
    size?: 'hero' | 'heading'
}

/** A title that supports *highlighted* words, with the hint and a live preview. */
export function TitleField({ label, value, registration, error, size }: TitleFieldProps) {
    return (
        <div className="space-y-3">
            <Input label={label} hint={HIGHLIGHT_HINT} error={error} {...registration} />
            <HighlightPreview text={value ?? ''} size={size} />
        </div>
    )
}
