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

/**
 * Back office. Deliberately not linked from the storefront: staff reach it by URL.
 */
export const ADMIN_ROUTES = {
    login: '/admin/login',
    root: '/admin',
    products: '/admin/productos',
    productNew: '/admin/productos/nuevo',
    productEdit: '/admin/productos/:id',
    categories: '/admin/categorias',
    content: '/admin/contenido',
} as const

export function adminProductPath(id: string): string {
    return `/admin/productos/${encodeURIComponent(id)}`
}

/**
 * Login URL that sends the user back to `next` (an admin path) once signed in. `reason`
 * explains why the session ended (e.g. `inactividad`) so the login page can say so.
 */
export function adminLoginPath(next?: string, reason?: string): string {
    const params = new URLSearchParams()
    if (next) params.set('next', next)
    if (reason) params.set('reason', reason)
    const query = params.toString()
    return query ? `${ADMIN_ROUTES.login}?${query}` : ADMIN_ROUTES.login
}

/** Sandboxes for reviewing UI in isolation. Wired into the router only in development. */
export const DEV_ROUTES = {
    loaderPreview: '/dev/loader',
} as const

export function productPath(slug: string): string {
    return `/producto/${slug}`
}

export function categoryPath(slug: CategorySlug): string {
    return `/catalogo/${encodeURIComponent(slug)}`
}
