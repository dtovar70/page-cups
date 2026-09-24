import { createBrowserRouter, RouterProvider } from 'react-router'

import { SiteContentGate } from '@/components/route/SiteContentGate'
import { routes } from '@/configs/routes.config'

const router = createBrowserRouter(routes)

export function App() {
    return (
        <SiteContentGate>
            <RouterProvider router={router} />
        </SiteContentGate>
    )
}
