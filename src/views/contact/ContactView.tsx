import { SectionHeading } from '@/components/shared/SectionHeading'
import { Sticker } from '@/components/ui'
import { CONTAINER } from '@/constants/layout.constant'
import { cn } from '@/utils/cn'
import { ContactFaq } from '@/views/contact/components/ContactFaq'
import { ContactForm } from '@/views/contact/components/ContactForm'
import { ContactInfo } from '@/views/contact/components/ContactInfo'

export function ContactView() {
    return (
        <div className="space-y-16 pb-20">
            <section className={cn(CONTAINER, 'relative isolate space-y-6 pt-12 lg:pt-20')}>
                <div
                    aria-hidden="true"
                    className="absolute -top-20 left-1/3 -z-10 size-72 rounded-full bg-blush-200 opacity-60 blur-3xl"
                />

                <Sticker tone="sky" rotation="right">
                    Respondemos rápido
                </Sticker>

                <h1 className="max-w-3xl font-display text-4xl leading-tight tracking-tight text-ink uppercase sm:text-5xl lg:text-6xl text-balance">
                    Cuéntanos qué quieres <span className="text-blush-500">sublimar</span>
                </h1>

                <p className="max-w-xl text-lg text-ink-soft">
                    Un regalo, el uniforme del equipo o el detalle de tu evento. Escríbenos y armamos
                    la propuesta contigo.
                </p>
            </section>

            <section className={cn(CONTAINER, 'grid gap-8 lg:grid-cols-[1fr_22rem]')}>
                <ContactForm />
                <ContactInfo />
            </section>

            <section aria-labelledby="faq-heading" className={cn(CONTAINER, 'space-y-8')}>
                <SectionHeading
                    headingId="faq-heading"
                    eyebrow="Dudas comunes"
                    title="Preguntas frecuentes"
                    highlight="frecuentes"
                />
                <ContactFaq />
            </section>
        </div>
    )
}
