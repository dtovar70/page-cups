import { useNavigate } from 'react-router'

import type { ProductInput } from '@/@types/admin'
import { adminProductPath } from '@/constants/route.constant'
import { AdminPageHeader } from '@/views/admin/components/AdminPageHeader'
import { useCreateProduct } from '@/views/admin/hooks/useAdminProducts'
import { BackToProducts } from '@/views/admin/products/components/BackToProducts'
import { ProductForm } from '@/views/admin/products/components/ProductForm'
import {
    EMPTY_PRODUCT_FORM,
    type ProductCreatedState,
} from '@/views/admin/products/schema/product.schema'

export function AdminProductCreateView() {
    const navigate = useNavigate()
    const createProduct = useCreateProduct()

    const handleSubmit = async (input: ProductInput) => {
        const product = await createProduct.mutateAsync(input)
        // Photos need a product id, so the edit page is where they are added.
        await navigate(adminProductPath(product.id), {
            replace: true,
            state: { created: true } satisfies ProductCreatedState,
        })
        return product
    }

    return (
        <>
            <AdminPageHeader
                eyebrow={<BackToProducts />}
                title="Nuevo producto"
                description="Después de crearlo podrás agregarle fotos."
            />
            <ProductForm mode="create" initialValues={EMPTY_PRODUCT_FORM} onSubmit={handleSubmit} />
        </>
    )
}
