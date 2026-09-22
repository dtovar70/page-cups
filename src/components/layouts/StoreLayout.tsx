import { Outlet } from 'react-router'

import { CartDrawer } from '@/components/layouts/CartDrawer'
import { Footer } from '@/components/layouts/Footer'
import { Header } from '@/components/layouts/Header'
import { MobileMenu } from '@/components/layouts/MobileMenu'
import { Marquee } from '@/components/shared/Marquee'
import { ScrollToTop } from '@/components/route/ScrollToTop'
import { appConfig } from '@/configs/app.config'

export function StoreLayout() {
    return (
        <div className="flex min-h-screen flex-col overflow-x-clip">
            <ScrollToTop />
            <Marquee items={appConfig.shipping.announcements} />
            <Header />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />

            <CartDrawer />
            <MobileMenu />
        </div>
    )
}
