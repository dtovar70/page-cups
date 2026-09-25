import { z } from 'zod'

import {
    TEXT_INPUT_MAX_LENGTH as MAX_TEXT,
    TEXT_INPUT_MAX_MESSAGE as MAX_TEXT_MESSAGE,
} from '@/constants/ui.constant'

export const MAX_PROOF_BYTES = 5 * 1024 * 1024
export const PROOF_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

/** "04141234567" / "0414 123 4567" -> "0414-1234567"; anything else is left as typed. */
export function normalizeVePhone(value: string): string {
    const digits = value.replace(/\D/g, '')
    return /^04\d{9}$/.test(digits) ? `${digits.slice(0, 4)}-${digits.slice(4)}` : value.trim()
}

/** "v12345678" / "V 12.345.678" -> "V-12345678"; empty stays empty. */
export function normalizeIdNumber(value: string): string {
    const compact = value.toUpperCase().replace(/[\s.]/g, '')
    const match = /^([VEJPG])-?(\d{6,9})$/.exec(compact)
    return match ? `${match[1]}-${match[2]}` : compact
}

/** "32.469,62" / "32469.62" -> 32469.62; NaN when it is not an amount. */
export function parseBsAmount(value: string): number {
    const text = value.trim().replace(/\s/g, '')
    const normalized = text.includes(',') ? text.replace(/\./g, '').replace(',', '.') : text
    return /^\d+(?:\.\d{1,2})?$/.test(normalized) ? Number(normalized) : Number.NaN
}

/** Same rules as the API's SubmitPaymentDto (dates are checked against the order there). */
export const paymentSchema = z.object({
    reference: z
        .string()
        .max(MAX_TEXT, MAX_TEXT_MESSAGE)
        .transform((value) => value.replace(/[\s.-]/g, ''))
        .pipe(z.string().regex(/^\d{4,20}$/, 'La referencia debe tener entre 4 y 20 dígitos')),
    payerBankCode: z.string().min(1, 'Elige el banco desde el que pagaste'),
    payerPhone: z
        .string()
        .max(MAX_TEXT, MAX_TEXT_MESSAGE)
        .transform(normalizeVePhone)
        .pipe(z.string().regex(/^04\d{2}-\d{7}$/, 'Escribe el teléfono así: 0412-5550134')),
    payerIdNumber: z
        .string()
        .max(MAX_TEXT, MAX_TEXT_MESSAGE)
        .transform(normalizeIdNumber)
        .pipe(z.string().regex(/^(?:[VEJPG]-\d{6,9})?$/, 'Escribe la cédula así: V-12345678')),
    paidOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Elige la fecha del pago'),
    amountBs: z
        .string()
        .max(MAX_TEXT, MAX_TEXT_MESSAGE)
        .refine(
            (value) => parseBsAmount(value) > 0,
            'Escribe el monto pagado, por ejemplo 1.234,56',
        ),
})

export type PaymentFormInput = z.input<typeof paymentSchema>
export type PaymentFormValues = z.output<typeof paymentSchema>

export const PAYMENT_FIELDS = Object.keys(paymentSchema.shape) as (keyof PaymentFormValues)[]

/** Problem with a chosen screenshot, or null when it can be sent. */
export function proofProblem(file: File): string | null {
    if (!(PROOF_TYPES as readonly string[]).includes(file.type)) {
        return 'La captura debe ser una imagen JPG, PNG o WEBP.'
    }
    if (file.size > MAX_PROOF_BYTES) return 'La captura puede pesar como máximo 5 MB.'
    return null
}
