import { z } from 'zod'

export const CONTACT_TOPICS = ['personalizado', 'mayoreo', 'pedido', 'otro'] as const

export type ContactTopic = (typeof CONTACT_TOPICS)[number]

export const CONTACT_TOPIC_LABELS: Record<ContactTopic, string> = {
    personalizado: 'Quiero un diseño personalizado',
    mayoreo: 'Pedido por mayor',
    pedido: 'Consulta sobre un pedido',
    otro: 'Otro tema',
}

export const contactSchema = z.object({
    fullName: z.string().trim().min(3, 'Escribe tu nombre y apellido'),
    email: z.email('Escribe un correo válido, por ejemplo hola@correo.com'),
    topic: z.enum(CONTACT_TOPICS),
    message: z
        .string()
        .trim()
        .min(15, 'Cuéntanos un poco más, al menos 15 caracteres')
        .max(600, 'Máximo 600 caracteres'),
})

export type ContactValues = z.infer<typeof contactSchema>
