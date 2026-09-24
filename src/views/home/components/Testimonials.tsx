import { MessageCircleHeart } from 'lucide-react'

import { EmptyState } from '@/components/shared/EmptyState'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Button, Card, Rating, Skeleton } from '@/components/ui'
import { CONTAINER } from '@/constants/layout.constant'
import { cn } from '@/utils/cn'
import { useSiteContent } from '@/utils/hooks/useSiteContent'
import { useTestimonials } from '@/views/home/hooks/useTestimonials'

const VISIBLE_TESTIMONIALS = 3

export function Testimonials() {
    const { data: testimonials, isPending, isError, refetch } = useTestimonials()
    const { home } = useSiteContent()

    return (
        <section aria-labelledby="testimonials-heading" className="py-16 lg:py-24">
            <div className={cn(CONTAINER, 'space-y-10')}>
                <SectionHeading
                    headingId="testimonials-heading"
                    eyebrow={home.testimonialsEyebrow}
                    title={home.testimonialsTitle}
                    align="center"
                />

                {isError ? (
                    <EmptyState
                        title="No pudimos cargar las reseñas"
                        icon={<MessageCircleHeart className="size-6" />}
                        action={
                            <Button variant="secondary" onClick={() => void refetch()}>
                                Reintentar
                            </Button>
                        }
                    />
                ) : (
                    <ul className="grid gap-6 md:grid-cols-3">
                        {isPending
                            ? Array.from({ length: VISIBLE_TESTIMONIALS }, (_, index) => (
                                  <li key={index}>
                                      <Skeleton shape="block" className="h-56 w-full" />
                                  </li>
                              ))
                            : (testimonials ?? [])
                                  .slice(0, VISIBLE_TESTIMONIALS)
                                  .map((testimonial) => (
                                      <li key={testimonial.id} className="h-full">
                                          <Card tone="cream" className="flex h-full flex-col gap-4">
                                              <Rating value={testimonial.rating} />
                                              <blockquote className="flex-1 text-sm leading-relaxed text-ink">
                                                  “{testimonial.quote}”
                                              </blockquote>
                                              <footer className="text-sm">
                                                  <p className="font-display text-base text-ink">
                                                      {testimonial.author}
                                                  </p>
                                                  <p className="text-ink-soft">
                                                      {testimonial.city} · {testimonial.productName}
                                                  </p>
                                              </footer>
                                          </Card>
                                      </li>
                                  ))}
                    </ul>
                )}
            </div>
        </section>
    )
}
