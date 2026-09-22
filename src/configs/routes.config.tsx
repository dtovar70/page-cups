import { Suspense, type ReactElement } from 'react'
import type { RouteObject } from 'react-router'

import { StoreLayout } from '@/components/layouts/StoreLayout'
import { RouteError } from '@/components/route/RouteError'
import { RouteFallback } from '@/components/route/RouteFallback'
import { DEV_ROUTES, ROUTES } from '@/constants/route.constant'
import { LoaderPreviewView } from '@/views/others/LoaderPreviewView'
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

/**
 * `import.meta.env.DEV` is replaced by a literal at build time, so this whole branch — and
 * the sandbox view it imports — is dead code the bundler strips from production.
 */
const devRoutes: RouteObject[] = import.meta.env.DEV
    ? [{ path: DEV_ROUTES.loaderPreview, element: <LoaderPreviewView /> }]
    : []

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
            ...devRoutes,
            { path: ROUTES.notFound, element: withSuspense(<NotFoundView />) },
        ],
    },
]
