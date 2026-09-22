import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { PartyPopper, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button, Input } from '@/components/ui'
import { cn } from '@/utils/cn'

const newsletterSchema = z.object({
    email: z.email('Escribe un correo válido, por ejemplo hola@correo.com'),
})

type NewsletterValues = z.infer<typeof newsletterSchema>

export interface NewsletterProps {
    title?: string
    description?: string
    /** Keeps the field above the button, for narrow columns such as the footer. */
    stacked?: boolean
    className?: string
}

export function Newsletter({
    title = 'Recibe ideas y descuentos',
    description = 'Un correo al mes con diseños nuevos y promos. Sin spam, prometido.',
    stacked = false,
    className,
}: NewsletterProps) {
    const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<NewsletterValues>({
        resolver: zodResolver(newsletterSchema),
        defaultValues: { email: '' },
    })

    const onSubmit = handleSubmit((values) => {
        setSubscribedEmail(values.email)
        reset()
    })

    return (
        <div className={cn('space-y-3', className)}>
            <div className="space-y-1">
                <p className="font-display text-lg text-ink">{title}</p>
                <p className="text-sm text-ink-soft">{description}</p>
            </div>

            {subscribedEmail ? (
                <p
                    role="status"
                    className="flex items-center gap-2 rounded-2xl bg-mint-200 px-4 py-3 text-sm font-semibold text-ink"
                >
                    <PartyPopper aria-hidden="true" className="size-4" />
                    ¡Listo! Te escribiremos a {subscribedEmail}.
                </p>
            ) : (
                <form
                    onSubmit={onSubmit}
                    noValidate
                    className={cn('flex flex-col gap-3', !stacked && 'sm:flex-row')}
                >
                    <Input
                        label="Tu correo"
                        hideLabel
                        type="email"
                        autoComplete="email"
                        placeholder="hola@correo.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        trailingIcon={<Send aria-hidden="true" className="size-4" />}
                        className="shrink-0"
                    >
                        Suscribirme
                    </Button>
                </form>
            )}
        </div>
    )
}
