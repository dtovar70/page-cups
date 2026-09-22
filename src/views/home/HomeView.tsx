import { CategoryStrip } from '@/views/home/components/CategoryStrip'
import { CtaBanner } from '@/views/home/components/CtaBanner'
import { FeaturedProducts } from '@/views/home/components/FeaturedProducts'
import { Hero } from '@/views/home/components/Hero'
import { HowItWorks } from '@/views/home/components/HowItWorks'
import { Testimonials } from '@/views/home/components/Testimonials'

export function HomeView() {
    return (
        <>
            <Hero />
            <CategoryStrip />
            <FeaturedProducts />
            <HowItWorks />
            <Testimonials />
            <CtaBanner />
        </>
    )
}
