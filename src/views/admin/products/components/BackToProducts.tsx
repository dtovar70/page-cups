import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

import { ADMIN_ROUTES } from '@/constants/route.constant'

export function BackToProducts() {
    return (
        <Link
            to={ADMIN_ROUTES.products}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition hover:text-blush-600"
        >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Volver a productos
        </Link>
    )
}
