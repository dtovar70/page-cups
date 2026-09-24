import { appConfig, type NavLink } from '@/configs/app.config'
import { categoryPath } from '@/constants/route.constant'
import { useCategories } from '@/views/catalog/hooks/useCategories'

/** Links to the first `limit` categories, in the order set in the admin. */
export function useCategoryLinks(limit?: number): NavLink[] {
    const { data: categories } = useCategories()
    return (categories ?? [])
        .slice(0, limit)
        .map((category) => ({ label: category.name, to: categoryPath(category.slug) }))
}

/** Main navigation with the live categories slotted in after "Catálogo". */
export function useNavLinks(categoryLimit?: number): NavLink[] {
    return [
        ...appConfig.navLinks.before,
        ...useCategoryLinks(categoryLimit),
        ...appConfig.navLinks.after,
    ]
}
