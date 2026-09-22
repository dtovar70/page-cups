import { useId, type ComponentPropsWithRef } from 'react'
import { ChevronDown } from 'lucide-react'

import { FIELD_BASE_CLASS, FIELD_ERROR_CLASS } from '@/components/ui/field.styles'
import { cn } from '@/utils/cn'

export interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

export interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'id'> {
    label: string
    options: SelectOption[]
    hideLabel?: boolean
    hint?: string
    error?: string
    placeholder?: string
}

export function Select({
    label,
    options,
    hideLabel = false,
    hint,
    error,
    placeholder,
    className,
    ...rest
}: SelectProps) {
    const selectId = useId()
    const hintId = `${selectId}-hint`
    const errorId = `${selectId}-error`

    return (
        <div className="flex w-full flex-col gap-1.5">
            <label
                htmlFor={selectId}
                className={cn('text-sm font-semibold text-ink', hideLabel && 'sr-only')}
            >
                {label}
            </label>

            <div className="relative">
                <select
                    id={selectId}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : hint ? hintId : undefined}
                    className={cn(
                        FIELD_BASE_CLASS,
                        'h-11 appearance-none rounded-full pr-11 pl-4',
                        error && FIELD_ERROR_CLASS,
                        className,
                    )}
                    {...rest}
                >
                    {placeholder ? (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    ) : null}
                    {options.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-soft"
                />
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
