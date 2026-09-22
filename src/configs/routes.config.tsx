import { Suspense, type ReactElement } from 'react'
import type { RouteObject } from 'react-router'

import { StoreLayout } from '@/components/layouts/StoreLayout'
import { RouteError } from '@/components/route/RouteError'
import { RouteFallback } from '@/components/route/RouteFallback'
import { ROUTES } from '@/constants/route.constant'
import {
    AboutView,
    CartView,
    CatalogView,
    CheckoutView,
    ContactView,
    HomeView,
    NotFoundView,
    ProductDetailView,
} from '@/views'

/** Every lazy view gets the same fallback, so routes stay declarative. */
function withSuspense(view: ReactElement): ReactElement {
    return <Suspense fallback={<RouteFallback />}>{view}</Suspense>
}

export const routes: RouteObject[] = [
    {
        path: ROUTES.home,
        element: <StoreLayout />,
        errorElement: <RouteError />,
        children: [
            { index: true, element: withSuspense(<HomeView />) },
            { path: ROUTES.catalog, element: withSuspense(<CatalogView />) },
            { path: ROUTES.catalogByCategory, element: withSuspense(<CatalogView />) },
            { path: ROUTES.product, element: withSuspense(<ProductDetailView />) },
            { path: ROUTES.cart, element: withSuspense(<CartView />) },
            { path: ROUTES.checkout, element: withSuspense(<CheckoutView />) },
            { path: ROUTES.about, element: withSuspense(<AboutView />) },
            { path: ROUTES.contact, element: withSuspense(<ContactView />) },
            { path: ROUTES.notFound, element: withSuspense(<NotFoundView />) },
        ],
    },
]
