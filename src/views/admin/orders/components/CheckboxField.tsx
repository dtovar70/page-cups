import { useId, type ReactNode } from 'react'

import { FIELD_HINT_CLASS } from '@/components/ui/field.styles'

export interface CheckboxFieldProps {
    checked: boolean
    onChange: (checked: boolean) => void
    children: ReactNode
    hint?: string
    disabled?: boolean
}

/** A native checkbox with its label, e.g. an acknowledgement a dialog needs before confirming. */
export function CheckboxField({ checked, onChange, children, hint, disabled }: CheckboxFieldProps) {
    const id = useId()
    return (
        <div className="flex items-start gap-3 rounded-2xl border-2 border-line bg-white px-4 py-3">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={(event) => onChange(event.target.checked)}
                aria-describedby={hint ? `${id}-hint` : undefined}
                className="mt-0.5 size-5 shrink-0 accent-blush-500 focus-visible:ring-2 focus-visible:ring-blush-400 focus-visible:ring-offset-2"
            />
            <div className="min-w-0 space-y-1">
                <label htmlFor={id} className="text-sm font-semibold text-ink">
                    {children}
                </label>
                {hint ? (
                    <p id={`${id}-hint`} className={FIELD_HINT_CLASS}>
                        {hint}
                    </p>
                ) : null}
            </div>
        </div>
    )
}
