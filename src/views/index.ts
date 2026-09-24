import { lazy } from 'react'

/**
 * Lazy barrel consumed by `routes.config`: every view ships in its own chunk so the
 * first paint only loads the layout plus the matched route.
 */
export const HomeView = lazy(() =>
    import('@/views/home/HomeView').then((module) => ({ default: module.HomeView })),
)

export const CatalogView = lazy(() =>
    import('@/views/catalog/CatalogView').then((module) => ({ default: module.CatalogView })),
)

export const ProductDetailView = lazy(() =>
    import('@/views/product/ProductDetailView').then((module) => ({
        default: module.ProductDetailView,
    })),
)

export const CartView = lazy(() =>
    import('@/views/cart/CartView').then((module) => ({ default: module.CartView })),
)

export const CheckoutView = lazy(() =>
    import('@/views/checkout/CheckoutView').then((module) => ({ default: module.CheckoutView })),
)

export const AboutView = lazy(() =>
    import('@/views/about/AboutView').then((module) => ({ default: module.AboutView })),
)

export const ContactView = lazy(() =>
    import('@/views/contact/ContactView').then((module) => ({ default: module.ContactView })),
)

export const NotFoundView = lazy(() =>
    import('@/views/others/NotFoundView').then((module) => ({ default: module.NotFoundView })),
)

/*
 * Back office: its own chunks, so storefront visitors never download the admin code.
 */
export const AdminShell = lazy(() =>
    import('@/views/admin/AdminShell').then((module) => ({ default: module.AdminShell })),
)

export const AdminLoginView = lazy(() =>
    import('@/views/admin/auth/AdminLoginView').then((module) => ({
        default: module.AdminLoginView,
    })),
)

export const AdminProductsView = lazy(() =>
    import('@/views/admin/products/AdminProductsView').then((module) => ({
        default: module.AdminProductsView,
    })),
)

export const AdminProductCreateView = lazy(() =>
    import('@/views/admin/products/AdminProductCreateView').then((module) => ({
        default: module.AdminProductCreateView,
    })),
)

export const AdminProductEditView = lazy(() =>
    import('@/views/admin/products/AdminProductEditView').then((module) => ({
        default: module.AdminProductEditView,
    })),
)

export const AdminCategoriesView = lazy(() =>
    import('@/views/admin/categories/AdminCategoriesView').then((module) => ({
        default: module.AdminCategoriesView,
    })),
)

export const AdminContentView = lazy(() =>
    import('@/views/admin/content/AdminContentView').then((module) => ({
        default: module.AdminContentView,
    })),
)
