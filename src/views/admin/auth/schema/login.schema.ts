import { z } from 'zod'

import {
    TEXT_INPUT_MAX_LENGTH as MAX_TEXT,
    TEXT_INPUT_MAX_MESSAGE as MAX_TEXT_MESSAGE,
} from '@/constants/ui.constant'

/** Mirrors the API's `LoginDto`. */
export const LOGIN_PASSWORD_MAX_LENGTH = 200

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .max(MAX_TEXT, MAX_TEXT_MESSAGE)
        .pipe(z.email('Escribe un correo válido, por ejemplo hola@correo.com')),
    password: z
        .string()
        .min(1, 'Escribe tu contraseña')
        .max(LOGIN_PASSWORD_MAX_LENGTH, 'La contraseña es demasiado larga'),
})

export type LoginValues = z.infer<typeof loginSchema>
