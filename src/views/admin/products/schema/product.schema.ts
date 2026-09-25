import { z } from 'zod'

import type { AdminProduct, ProductInput } from '@/@types/admin'
import type { ProductTag } from '@/@types/product'
import { ADMIN_ROUTES } from '@/constants/route.constant'
import {
    TEXT_INPUT_MAX_LENGTH as MAX_TEXT,
    TEXT_INPUT_MAX_MESSAGE as MAX_TEXT_MESSAGE,
} from '@/constants/ui.constant'

/** Mirrors the API's `CreateProductDto` rules so most mistakes never reach the server. */
export const PRODUCT_TAGS = [
    'nuevo',
    'bestseller',
    'oferta',
    'personalizable',
] as const satisfies readonly ProductTag[]

export const PRODUCT_TAG_LABELS: Record<ProductTag, string> = {
    nuevo: 'Nuevo',
    bestseller: 'Bestseller',
    oferta: 'Oferta',
    personalizable: 'Personalizable',
}

/** Router state the create page hands to the edit page right after saving. */
export interface ProductCreatedState {
    created: true
}

/** Router state the list hands to the edit page: the list URL (search and page) to return to. */
export interface ProductEditFromState {
    from: string
}

/** Router state the edit page hands back to the list after a successful save. */
export interface ProductSavedState {
    savedNotice: string
}

/**
 * The list URL the edit page returns to. Only the products list itself is accepted (with
 * its query string), so the state can never send the admin anywhere else.
 */
export function readProductsListUrl(state: unknown): string {
    if (typeof state === 'object' && state !== null && 'from' in state) {
        const { from } = state as { from: unknown }
        if (
            typeof from === 'string' &&
            (from === ADMIN_ROUTES.products || from.startsWith(`${ADMIN_ROUTES.products}?`))
        ) {
            return from
        }
    }
    return ADMIN_ROUTES.products
}

export function readSavedNotice(state: unknown): string | null {
    if (typeof state !== 'object' || state === null || !('savedNotice' in state)) return null
    const { savedNotice } = state as { savedNotice: unknown }
    return typeof savedNotice === 'string' && savedNotice ? savedNotice : null
}

export const MAX_HIGHLIGHTS = 6
export const MAX_VARIANTS = 30
export const PRODUCT_DESCRIPTION_MAX_LENGTH = 4000

const MAX_PRICE = 99_999_999.99
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const HEX_COLOR_PATTERN = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
const HEX_MESSAGE = 'Usa un color hexadecimal, por ejemplo #FFB3D1'

/** At most two decimals, checked on the text form to dodge floating-point noise. */
function hasTwoDecimalsAtMost(value: number): boolean {
    return /^-?\d+(\.\d{1,2})?$/.test(String(value))
}

function money(requiredMessage: string, min = 0) {
    return z
        .number({ error: requiredMessage })
        .min(min, min === 0 ? 'No puede ser negativo' : `Debe ser mayor o igual a ${min}`)
        .max(MAX_PRICE, 'El monto es demasiado alto')
        .refine(hasTwoDecimalsAtMost, 'Usa como máximo dos decimales')
}

export const productFormSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'Escribe el nombre del producto')
            .max(MAX_TEXT, MAX_TEXT_MESSAGE),
        slug: z
            .string()
            .trim()
            .max(80, 'Máximo 80 caracteres')
            .refine(
                (value) => value === '' || SLUG_PATTERN.test(value),
                'Solo minúsculas, números y guiones, por ejemplo taza-cafe-primero',
            ),
        // The options come from the API; the server checks that the category still exists.
        categorySlug: z.string({ error: 'Elige una categoría' }).min(1, 'Elige una categoría'),
        price: money('Escribe el precio'),
        compareAtPrice: money('Escribe el precio anterior').optional(),
        stock: z
            .number({ error: 'Escribe el stock disponible' })
            .int('El stock debe ser un número entero')
            .min(0, 'No puede ser negativo'),
        printText: z.string().max(80, 'Máximo 80 caracteres'),
        colorHex: z
            .string()
            .trim()
            .max(MAX_TEXT, MAX_TEXT_MESSAGE)
            .regex(HEX_COLOR_PATTERN, HEX_MESSAGE),
        description: z
            .string()
            .max(
                PRODUCT_DESCRIPTION_MAX_LENGTH,
                `Máximo ${PRODUCT_DESCRIPTION_MAX_LENGTH} caracteres`,
            ),
        highlights: z
            .array(
                z.object({
                    value: z
                        .string()
                        .trim()
                        .min(1, 'Escribe el detalle o elimínalo')
                        .max(MAX_TEXT, MAX_TEXT_MESSAGE),
                }),
            )
            .max(MAX_HIGHLIGHTS, `Máximo ${MAX_HIGHLIGHTS} detalles`),
        tags: z.array(z.enum(PRODUCT_TAGS)),
        variants: z
            .array(
                z.object({
                    label: z
                        .string()
                        .trim()
                        .min(1, 'Escribe el nombre de la variante')
                        .max(80, 'Máximo 80 caracteres'),
                    priceDelta: money('Escribe el ajuste de precio (0 si no cambia)', -MAX_PRICE),
                    colorHex: z
                        .string()
                        .trim()
                        .max(MAX_TEXT, MAX_TEXT_MESSAGE)
                        .refine(
                            (value) => value === '' || HEX_COLOR_PATTERN.test(value),
                            HEX_MESSAGE,
                        ),
                }),
            )
            .max(MAX_VARIANTS, `Máximo ${MAX_VARIANTS} variantes`),
        isActive: z.boolean(),
    })
    .superRefine((values, context) => {
        if (values.compareAtPrice !== undefined && values.compareAtPrice <= values.price) {
            context.addIssue({
                code: 'custom',
                path: ['compareAtPrice'],
                message: 'Debe ser mayor que el precio',
            })
        }
    })

export type ProductFormValues = z.infer<typeof productFormSchema>

/** Number inputs report "" when empty; the schema expects `undefined` for "no value". */
export function toOptionalNumber(value: unknown): number | undefined {
    if (value === '' || value === null || value === undefined) return undefined
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : parsed
}

export const EMPTY_PRODUCT_FORM: Partial<ProductFormValues> = {
    name: '',
    slug: '',
    printText: '',
    colorHex: '#FFB3D1',
    description: '',
    highlights: [],
    tags: [],
    variants: [{ label: 'Estándar', priceDelta: 0, colorHex: '' }],
    isActive: true,
}

export function toProductFormValues(product: AdminProduct): ProductFormValues {
    return {
        name: product.name,
        slug: product.slug,
        categorySlug: product.category,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        printText: product.printText,
        colorHex: product.colorHex,
        description: product.description,
        highlights: product.highlights.map((value) => ({ value })),
        tags: product.tags,
        variants: product.variants.map((variant) => ({
            label: variant.label,
            priceDelta: variant.priceDelta,
            colorHex: variant.colorHex ?? '',
        })),
        isActive: product.isActive,
    }
}

/**
 * Form values to request body. On update a cleared "before" price is sent as `null`,
 * which is how the API removes it; on create it is simply omitted.
 */
export function toProductInput(values: ProductFormValues, mode: 'create' | 'edit'): ProductInput {
    const slug = values.slug.trim()

    return {
        name: values.name.trim(),
        ...(slug ? { slug } : {}),
        categorySlug: values.categorySlug,
        price: values.price,
        ...(values.compareAtPrice !== undefined
            ? { compareAtPrice: values.compareAtPrice }
            : mode === 'edit'
              ? { compareAtPrice: null }
              : {}),
        stock: values.stock,
        printText: values.printText,
        colorHex: values.colorHex.trim().toUpperCase(),
        description: values.description,
        highlights: values.highlights.map((highlight) => highlight.value.trim()),
        tags: values.tags,
        variants: values.variants.map((variant) => ({
            label: variant.label.trim(),
            priceDelta: variant.priceDelta,
            ...(variant.colorHex.trim() ? { colorHex: variant.colorHex.trim().toUpperCase() } : {}),
        })),
        isActive: values.isActive,
    }
}
