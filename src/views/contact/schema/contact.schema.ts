import { z } from 'zod'

import {
    TEXT_INPUT_MAX_LENGTH as MAX_TEXT,
    TEXT_INPUT_MAX_MESSAGE as MAX_TEXT_MESSAGE,
} from '@/constants/ui.constant'

export const CONTACT_TOPICS = ['personalizado', 'mayoreo', 'pedido', 'otro'] as const

export type ContactTopic = (typeof CONTACT_TOPICS)[number]

export const CONTACT_TOPIC_LABELS: Record<ContactTopic, string> = {
    personalizado: 'Quiero un diseño personalizado',
    mayoreo: 'Pedido por mayor',
    pedido: 'Consulta sobre un pedido',
    otro: 'Otro tema',
}

export const CONTACT_MESSAGE_MAX_LENGTH = 600

export const contactSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(3, 'Escribe tu nombre y apellido')
        .max(MAX_TEXT, MAX_TEXT_MESSAGE),
    email: z
        .string()
        .trim()
        .max(MAX_TEXT, MAX_TEXT_MESSAGE)
        .pipe(z.email('Escribe un correo válido, por ejemplo hola@correo.com')),
    topic: z.enum(CONTACT_TOPICS),
    message: z
        .string()
        .trim()
        .min(15, 'Cuéntanos un poco más, al menos 15 caracteres')
        .max(CONTACT_MESSAGE_MAX_LENGTH, `Máximo ${CONTACT_MESSAGE_MAX_LENGTH} caracteres`),
})

export type ContactValues = z.infer<typeof contactSchema>
