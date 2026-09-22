import { z } from 'zod'

export const DELIVERY_METHODS = ['delivery', 'pickup'] as const

export type DeliveryMethod = (typeof DELIVERY_METHODS)[number]

export const DELIVERY_METHOD_LABELS: Record<DeliveryMethod, string> = {
    delivery: 'Envío a domicilio',
    pickup: 'Retiro en el taller',
}

const PHONE_PATTERN = /^[\d+\s()-]{7,20}$/

export const checkoutSchema = z.object({
    fullName: z.string().trim().min(3, 'Escribe tu nombre y apellido'),
    email: z.email('Escribe un correo válido, por ejemplo hola@correo.com'),
    phone: z.string().trim().regex(PHONE_PATTERN, 'Escribe un teléfono válido'),
    city: z.string().trim().min(2, 'Escribe tu ciudad'),
    address: z.string().trim().min(6, 'Escribe una dirección completa'),
    notes: z.string().trim().max(300, 'Máximo 300 caracteres'),
    deliveryMethod: z.enum(DELIVERY_METHODS),
})

export type CheckoutValues = z.infer<typeof checkoutSchema>
