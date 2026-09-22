import {
    fetchCategories,
    fetchFeaturedProducts,
    fetchProductBySlug,
    fetchProducts,
    fetchRelatedProducts,
    fetchTestimonials,
} from '@/mock/api/products.api'

/**
 * Single seam between the views and the data source. Swapping the mock module for
 * an HTTP client only touches this file.
 */
export const ProductService = {
    getProducts: fetchProducts,
    getProductBySlug: fetchProductBySlug,
    getFeaturedProducts: fetchFeaturedProducts,
    getRelatedProducts: fetchRelatedProducts,
    getCategories: fetchCategories,
    getTestimonials: fetchTestimonials,
} as const

export { NotFoundError } from '@/mock/api/products.api'
