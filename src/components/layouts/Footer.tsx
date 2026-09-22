import { Link } from 'react-router'

import { BrandLogo } from '@/components/layouts/BrandLogo'
import { Newsletter } from '@/components/shared/Newsletter'
import { appConfig } from '@/configs/app.config'
import { CONTAINER } from '@/constants/layout.constant'
import { categoryPath, ROUTES } from '@/constants/route.constant'
import { cn } from '@/utils/cn'

const PRODUCT_LINKS = [
    { label: 'Tazas', to: categoryPath('mugs') },
    { label: 'Franelas', to: categoryPath('tees') },
    { label: 'Llaveros', to: categoryPath('keychains') },
    { label: 'Todo el catálogo', to: ROUTES.catalog },
]

const HELP_LINKS = [
    { label: 'Nosotros', to: ROUTES.about },
    { label: 'Contacto', to: ROUTES.contact },
    { label: 'Carrito', to: ROUTES.cart },
    { label: 'Checkout', to: ROUTES.checkout },
]

const linkClass = 'text-sm text-ink-soft transition hover:text-blush-600'

export function Footer() {
    return (
        <footer className="mt-20 border-t border-line bg-white">
            <div className={cn(CONTAINER, 'grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4')}>
                <div className="space-y-4">
                    <BrandLogo withTagline />
                    <p className="max-w-xs text-sm text-ink-soft">{appConfig.description}</p>
                    <ul className="space-y-1.5">
                        {appConfig.socials.map((social) => (
                            <li key={social.label}>
                                <a
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={linkClass}
                                >
                                    {social.label} · {social.handle}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <nav aria-labelledby="footer-products" className="space-y-4">
                    <h2 id="footer-products" className="font-display text-base text-ink">
                        Productos
                    </h2>
                    <ul className="space-y-2">
                        {PRODUCT_LINKS.map((link) => (
                            <li key={link.to}>
                                <Link to={link.to} className={linkClass}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <nav aria-labelledby="footer-help" className="space-y-4">
                    <h2 id="footer-help" className="font-display text-base text-ink">
                        Ayuda
                    </h2>
                    <ul className="space-y-2">
                        {HELP_LINKS.map((link) => (
                            <li key={link.to}>
                                <Link to={link.to} className={linkClass}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <li className="text-sm text-ink-soft">{appConfig.contact.schedule}</li>
                        <li>
                            <a href={`mailto:${appConfig.contact.email}`} className={linkClass}>
                                {appConfig.contact.email}
                            </a>
                        </li>
                    </ul>
                </nav>

                <Newsletter
                    title="Newsletter"
                    description="Diseños nuevos y promos, una vez al mes."
                    stacked
                    className="lg:max-w-sm"
                />
            </div>

            <div className="border-t border-line">
                <div
                    className={cn(
                        CONTAINER,
                        'flex flex-col gap-2 py-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between',
                    )}
                >
                    <p>
                        © {new Date().getFullYear()} {appConfig.brand}. Todos los derechos reservados.
                    </p>
                    <p>
                        {appConfig.contact.city} · {appConfig.shipping.productionCopy}
                    </p>
                </div>
            </div>
        </footer>
    )
}
