import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'

import { FIELD_BASE_CLASS, FIELD_ERROR_CLASS } from '@/components/ui/field.styles'
import { cn } from '@/utils/cn'

export interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'id'> {
    label: string
    /** Hides the label visually while keeping it available to screen readers. */
    hideLabel?: boolean
    hint?: string
    error?: string
    leadingIcon?: ReactNode
    /** Interactive slot pinned to the right edge, e.g. a clear button. */
    trailingAction?: ReactNode
}

export function Input({
    label,
    hideLabel = false,
    hint,
    error,
    leadingIcon,
    trailingAction,
    className,
    ...rest
}: InputProps) {
    const inputId = useId()
    const hintId = `${inputId}-hint`
    const errorId = `${inputId}-error`

    return (
        <div className="flex w-full flex-col gap-1.5">
            <label
                htmlFor={inputId}
                className={cn('text-sm font-semibold text-ink', hideLabel && 'sr-only')}
            >
                {label}
            </label>

            <div className="relative">
                {leadingIcon ? (
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-ink-soft"
                    >
                        {leadingIcon}
                    </span>
                ) : null}

                <input
                    id={inputId}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : hint ? hintId : undefined}
                    className={cn(
                        FIELD_BASE_CLASS,
                        'h-11 rounded-full px-4',
                        leadingIcon && 'pl-11',
                        trailingAction && 'pr-11',
                        error && FIELD_ERROR_CLASS,
                        className,
                    )}
                    {...rest}
                />

                {trailingAction ? (
                    <span className="absolute inset-y-0 right-1.5 flex items-center">
                        {trailingAction}
                    </span>
                ) : null}
            </div>

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
