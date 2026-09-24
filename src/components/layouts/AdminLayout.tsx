import { useState } from 'react'
import { cva } from 'class-variance-authority'
import { ExternalLink, FileText, LogOut, Menu, Package, Tags } from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'

import type { AuthUser, UserRole } from '@/@types/admin'
import { ScrollToTop } from '@/components/route/ScrollToTop'
import { Button, Drawer } from '@/components/ui'
import { appConfig } from '@/configs/app.config'
import { ADMIN_ROUTES, ROUTES } from '@/constants/route.constant'
import { brandLines } from '@/utils/content'
import { useSiteContent } from '@/utils/hooks/useSiteContent'
import { useLogout, useSession } from '@/views/admin/hooks/useSession'

const ROLE_LABEL: Record<UserRole, string> = {
    ADMIN: 'Administrador',
    EDITOR: 'Editor',
}

const NAV_LINKS = [
    { label: 'Productos', to: ADMIN_ROUTES.products, icon: Package },
    { label: 'Categorías', to: ADMIN_ROUTES.categories, icon: Tags },
    { label: 'Contenido', to: ADMIN_ROUTES.content, icon: FileText },
] as const

const navLinkVariants = cva(
    'flex items-center gap-3 rounded-2xl px-4 py-3 font-display text-base transition duration-200',
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

function AdminBrand() {
    const { general } = useSiteContent()

    return (
        <Link
            to={ADMIN_ROUTES.products}
            aria-label={`${general.brandName} — panel de administración`}
            className="group inline-flex items-center gap-2.5 rounded-2xl"
        >
            <img
                src={appConfig.logo.src}
                srcSet={appConfig.logo.srcSet}
                sizes="48px"
                alt=""
                width={48}
                height={48}
                className="size-11 shrink-0 rounded-2xl ring-1 ring-ink/5 transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transform-none"
            />
            <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-semibold tracking-tight text-ink">
                    {brandLines(general.brandName)[0]}
                </span>
                <span className="text-[0.65rem] font-bold tracking-[0.22em] text-blush-500 uppercase">
                    Panel
                </span>
            </span>
        </Link>
    )
}

interface AdminNavProps {
    user: AuthUser
    onNavigate?: () => void
}

function AdminNav({ user, onNavigate }: AdminNavProps) {
    const navigate = useNavigate()
    const logout = useLogout()

    const handleLogout = async () => {
        // The session is cleared locally even if the request fails (see `useLogout`).
        await logout.mutateAsync().catch(() => undefined)
        onNavigate?.()
        await navigate(ADMIN_ROUTES.login, { replace: true })
    }

    return (
        <div className="flex h-full flex-col gap-6">
            <nav aria-label="Administración">
                <ul className="space-y-1">
                    {NAV_LINKS.map(({ label, to, icon: Icon }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                onClick={onNavigate}
                                className={({ isActive }) => navLinkVariants({ isActive })}
                            >
                                <Icon aria-hidden="true" className="size-5" />
                                {label}
                            </NavLink>
                        </li>
                    ))}
                    <li>
                        <a
                            href={ROUTES.home}
                            target="_blank"
                            rel="noreferrer"
                            className={navLinkVariants({ isActive: false })}
                        >
                            <ExternalLink aria-hidden="true" className="size-5" />
                            Ver tienda
                            <span className="sr-only">(se abre en una pestaña nueva)</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <div className="mt-auto space-y-3 rounded-3xl border border-line bg-white p-4">
                <div className="min-w-0">
                    <p className="truncate font-display text-base text-ink">{user.name}</p>
                    <p className="truncate text-xs text-ink-soft">
                        {ROLE_LABEL[user.role]} · {user.email}
                    </p>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => void handleLogout()}
                    isLoading={logout.isPending}
                    leadingIcon={<LogOut aria-hidden="true" className="size-4" />}
                >
                    Cerrar sesión
                </Button>
            </div>
        </div>
    )
}

/**
 * Back-office shell: a fixed sidebar on desktop and a top bar plus drawer on smaller
 * screens. None of the storefront chrome (header, footer, cart) is rendered here.
 */
export function AdminLayout() {
    const { data: user } = useSession()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // `RequireAdmin` only renders this layout with a session; this narrows the type.
    if (!user) return null

    const closeMenu = () => setIsMenuOpen(false)

    return (
        <div className="min-h-screen overflow-x-clip bg-cream">
            <ScrollToTop />

            <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col gap-8 border-r border-line bg-blush-50/60 px-5 py-6 lg:flex">
                <AdminBrand />
                <AdminNav user={user} />
            </aside>

            <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-line bg-cream/90 px-4 py-3 backdrop-blur lg:hidden">
                <AdminBrand />
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Abrir menú de administración"
                    aria-expanded={isMenuOpen}
                    className="flex size-11 items-center justify-center rounded-full text-ink transition hover:bg-blush-100 focus-visible:ring-2 focus-visible:ring-blush-400 focus-visible:ring-offset-2"
                >
                    <Menu aria-hidden="true" className="size-6" />
                </button>
            </header>

            <Drawer isOpen={isMenuOpen} onClose={closeMenu} title="Administración" side="left">
                <AdminNav user={user} onNavigate={closeMenu} />
            </Drawer>

            <main className="lg:pl-72">
                <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
