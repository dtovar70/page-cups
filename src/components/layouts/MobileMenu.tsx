import { cva } from 'class-variance-authority'
import { NavLink } from 'react-router'

import { ButtonLink, Drawer } from '@/components/ui'
import { SearchField } from '@/components/layouts/SearchField'
import { appConfig } from '@/configs/app.config'
import { ROUTES } from '@/constants/route.constant'
import { useMobileMenu } from '@/store/uiStore'

const mobileLinkVariants = cva(
    'block rounded-2xl px-4 py-3 font-display text-lg transition duration-200',
    {
        variants: {
            isActive: {
                true: 'bg-blush-100 text-blush-700',
                false: 'text-ink hover:bg-blush-50',
            },
        },
        defaultVariants: { isActive: false },
    },
)

export function MobileMenu() {
    const { isOpen, close } = useMobileMenu()

    return (
        <Drawer isOpen={isOpen} onClose={close} title="Menú" side="left">
            <div className="space-y-6">
                <SearchField onNavigate={close} />

                <nav aria-label="Navegación móvil">
                    <ul className="space-y-1">
                        {appConfig.navLinks.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    end
                                    onClick={close}
                                    className={({ isActive }) => mobileLinkVariants({ isActive })}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <ButtonLink to={ROUTES.catalog} fullWidth onClick={close}>
                    Explorar catálogo
                </ButtonLink>

                <p className="text-sm text-ink-soft">{appConfig.shipping.freeShippingCopy}</p>
            </div>
        </Drawer>
    )
}
