import type { CategorySlug } from '@/@types/product'

export const ROUTES = {
    home: '/',
    catalog: '/catalogo',
    catalogByCategory: '/catalogo/:category',
    product: '/producto/:slug',
    cart: '/carrito',
    checkout: '/checkout',
    about: '/nosotros',
    contact: '/contacto',
    notFound: '*',
} as const

export type RouteKey = keyof typeof ROUTES
export type RoutePath = (typeof ROUTES)[RouteKey]

/** Sandboxes for reviewing UI in isolation. Wired into the router only in development. */
export const DEV_ROUTES = {
    loaderPreview: '/dev/loader',
} as const

export function productPath(slug: string): string {
    return `/producto/${slug}`
}

export function categoryPath(slug: CategorySlug): string {
    return `/catalogo/${slug}`
}
