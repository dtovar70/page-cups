import { useId, type ComponentPropsWithRef } from 'react'

import {
    FIELD_BASE_CLASS,
    FIELD_ERROR_CLASS,
    FIELD_HINT_CLASS,
    FIELD_LABEL_CLASS,
    FIELD_MESSAGE_ERROR_CLASS,
} from '@/components/ui/field.styles'
import { OptionalMark } from '@/components/ui/OptionalMark'
import { cn } from '@/utils/cn'

export interface TextareaProps extends Omit<ComponentPropsWithRef<'textarea'>, 'id'> {
    label: string
    hideLabel?: boolean
    hint?: string
    error?: string
    /** Adds a muted "(opcional)" suffix to the label. */
    optional?: boolean
}

export function Textarea({
    label,
    hideLabel = false,
    hint,
    error,
    optional = false,
    className,
    rows = 4,
    ...rest
}: TextareaProps) {
    const textareaId = useId()
    const hintId = `${textareaId}-hint`
    const errorId = `${textareaId}-error`

    return (
        <div className="flex w-full flex-col gap-1.5">
            <label htmlFor={textareaId} className={cn(FIELD_LABEL_CLASS, hideLabel && 'sr-only')}>
                {label}
                {optional ? <OptionalMark /> : null}
            </label>

            <textarea
                id={textareaId}
                rows={rows}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : hint ? hintId : undefined}
                className={cn(
                    FIELD_BASE_CLASS,
                    'resize-y rounded-2xl px-4 py-3',
                    error && FIELD_ERROR_CLASS,
                    className,
                )}
                {...rest}
            />

            {error ? (
                <p id={errorId} role="alert" className={FIELD_MESSAGE_ERROR_CLASS}>
                    {error}
                </p>
            ) : hint ? (
                <p id={hintId} className={FIELD_HINT_CLASS}>
                    {hint}
                </p>
            ) : null}
        </div>
    )
}
