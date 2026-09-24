import { z } from 'zod'

import { HEX_COLOR_PATTERN, SLUG_PATTERN } from '@/views/admin/products/schema/product.schema'

export const CATEGORY_NAME_MAX_LENGTH = 60
export const CATEGORY_SLUG_MAX_LENGTH = 60

/** Mirrors the API's `CreateCategoryDto`. The slug is only sent on create. */
export const categoryFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Escribe el nombre')
        .max(CATEGORY_NAME_MAX_LENGTH, `Máximo ${CATEGORY_NAME_MAX_LENGTH} caracteres`),
    slug: z
        .string()
        .trim()
        .max(CATEGORY_SLUG_MAX_LENGTH, `Máximo ${CATEGORY_SLUG_MAX_LENGTH} caracteres`)
        .refine(
            (value) => value === '' || SLUG_PATTERN.test(value),
            'Solo minúsculas, números y guiones, por ejemplo gorras-bordadas',
        ),
    tagline: z.string().trim().max(120, 'Máximo 120 caracteres'),
    description: z.string().trim().max(1000, 'Máximo 1000 caracteres'),
    colorHex: z
        .string()
        .trim()
        .regex(HEX_COLOR_PATTERN, 'Usa un color hexadecimal, por ejemplo #FFB3D1'),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>

export const EMPTY_CATEGORY_FORM: CategoryFormValues = {
    name: '',
    slug: '',
    tagline: '',
    description: '',
    colorHex: '#FFD979',
}
