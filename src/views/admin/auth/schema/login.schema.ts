import { z } from 'zod'

export const loginSchema = z.object({
    email: z.email('Escribe un correo válido, por ejemplo hola@correo.com'),
    password: z
        .string()
        .min(1, 'Escribe tu contraseña')
        .max(200, 'La contraseña es demasiado larga'),
})

export type LoginValues = z.infer<typeof loginSchema>
