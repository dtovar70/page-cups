import { useId, type ComponentPropsWithRef } from 'react'

import { FIELD_BASE_CLASS, FIELD_ERROR_CLASS } from '@/components/ui/field.styles'
import { cn } from '@/utils/cn'

export interface TextareaProps extends Omit<ComponentPropsWithRef<'textarea'>, 'id'> {
    label: string
    hideLabel?: boolean
    hint?: string
    error?: string
}

export function Textarea({
    label,
    hideLabel = false,
    hint,
    error,
    className,
    rows = 4,
    ...rest
}: TextareaProps) {
    const textareaId = useId()
    const hintId = `${textareaId}-hint`
    const errorId = `${textareaId}-error`

    return (
        <div className="flex w-full flex-col gap-1.5">
            <label
                htmlFor={textareaId}
                className={cn('text-sm font-semibold text-ink', hideLabel && 'sr-only')}
            >
                {label}
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
                <p id={errorId} role="alert" className="text-sm font-medium text-blush-700">
                    {error}
                </p>
            ) : hint ? (
                <p id={hintId} className="text-sm text-ink-soft">
                    {hint}
                </p>
            ) : null}
        </div>
    )
}
