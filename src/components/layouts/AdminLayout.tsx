import { useEffect, useState, type ReactNode } from 'react'
import { cva } from 'class-variance-authority'
import {
    ClipboardList,
    ExternalLink,
    FileText,
    Landmark,
    ListChecks,
    LogOut,
    Menu,
    Package,
    PanelLeftClose,
    PanelLeftOpen,
    Tags,
} from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'

import type { AuthUser, UserRole } from '@/@types/admin'
import { RailTooltip } from '@/components/layouts/AdminRailTooltip'
import { ScrollToTop } from '@/components/route/ScrollToTop'
import { Drawer, Spinner } from '@/components/ui'
import { appConfig } from '@/configs/app.config'
import { ADMIN_ROUTES, ROUTES } from '@/constants/route.constant'
import { cn } from '@/utils/cn'
import { brandLines } from '@/utils/content'
import { useSiteContent } from '@/utils/hooks/useSiteContent'
import { useAdminOrdersSummary } from '@/views/admin/hooks/useAdminOrders'
import { useLogout, useSession } from '@/views/admin/hooks/useSession'

const ROLE_LABEL: Record<UserRole, string> = {
    ADMIN: 'Administrador',
    EDITOR: 'Editor',
}

/** `roles`: only these roles see the link (every role when omitted). */
const NAV_LINKS: readonly {
    label: string
    to: string
    icon: typeof ClipboardList
    roles?: readonly UserRole[]
}[] = [
    { label: 'Pedidos', to: ADMIN_ROUTES.orders, icon: ClipboardList },
    { label: 'Tasa BCV', to: ADMIN_ROUTES.exchangeRate, icon: Landmark },
    { label: 'Productos', to: ADMIN_ROUTES.products, icon: Package },
    { label: 'Categorías', to: ADMIN_ROUTES.categories, icon: Tags },
    { label: 'Contenido', to: ADMIN_ROUTES.content, icon: FileText },
    { label: 'Catálogos', to: ADMIN_ROUTES.catalogs, icon: ListChecks, roles: ['ADMIN'] },
]

const SIDEBAR_ID = 'admin-sidebar'
const SIDEBAR_STORAGE_KEY = 'mr-admin-sidebar-collapsed'
/** Tailwind's `lg`: the sidebar (and so the collapse) only exists from here up. */
const DESKTOP_QUERY = '(min-width: 64rem)'

const navLinkVariants = cva(
    'flex h-12 items-center gap-3 rounded-2xl font-display text-base whitespace-nowrap transition duration-200',
    {
        variants: {
            isActive: {
                true: 'bg-blush-100 text-blush-700',
                false: 'text-ink hover:bg-blush-50',
            },
            // The rail is exactly one 48px square wide, so every icon shares its centre.
            isCollapsed: {
                true: 'justify-center',
                false: 'px-4',
            },
        },
        defaultVariants: { isActive: false, isCollapsed: false },
    },
)

/** Icon-only buttons in the rail: the same 48px square and hover as its nav links. */
const RAIL_BUTTON_CLASS =
    'flex size-12 shrink-0 items-center justify-center rounded-2xl text-ink transition duration-200 hover:bg-blush-50'

/** Read synchronously for the first render, so a reload never flashes the other width. */
function readCollapsed(): boolean {
    try {
        return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1'
    } catch {
        return false
    }
}

function useSidebarCollapsed() {
    const [isCollapsed, setIsCollapsed] = useState(readCollapsed)

    useEffect(() => {
        try {
            window.localStorage.setItem(SIDEBAR_STORAGE_KEY, isCollapsed ? '1' : '0')
        } catch {
            // Storage disabled or full: the choice just lasts for this visit.
        }
    }, [isCollapsed])

    // Ctrl+B / ⌘B, only while the desktop sidebar is on screen.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return
            if (event.key.toLowerCase() !== 'b' || event.repeat) return
            if (!window.matchMedia(DESKTOP_QUERY).matches) return
            event.preventDefault()
            setIsCollapsed((value) => !value)
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [])

    return [isCollapsed, setIsCollapsed] as const
}

const SHORTCUT_LABEL =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)
        ? '⌘B'
        : 'Ctrl+B'

/** The rail tooltip body: a bold label and an optional quieter second line. */
interface RailTipProps {
    title: ReactNode
    /** Highlighted after the title, e.g. the pending count. */
    accent?: ReactNode
    /** A key combination, drawn as a key cap next to the title. */
    shortcut?: string
    /** Quieter lines under the title. */
    detail?: ReactNode
}

/** The rail tooltip body: a bold label plus optional extras. */
function RailTip({ title, accent, shortcut, detail }: RailTipProps) {
    return (
        <span className="flex flex-col gap-1 whitespace-nowrap">
            <span className="flex items-center gap-1.5">
                <span className="font-display font-semibold">{title}</span>
                {accent ? (
                    <span className="font-display font-semibold text-blush-600">· {accent}</span>
                ) : null}
                {shortcut ? (
                    <kbd className="rounded-md border border-line bg-cream px-1.5 py-0.5 font-sans text-[11px] font-semibold text-ink-soft">
                        {shortcut}
                    </kbd>
                ) : null}
            </span>
            {detail ? (
                <span className="flex flex-col gap-0.5 text-xs text-ink-soft">{detail}</span>
            ) : null}
        </span>
    )
}

function initialOf(name: string): string {
    return name.trim().charAt(0).toUpperCase() || '?'
}

function AdminBrand({ compact = false }: { compact?: boolean }) {
    const { general } = useSiteContent()

    return (
        <Link
            to={ADMIN_ROUTES.orders}
            aria-label={`${general.brandName} — panel de administración`}
            className="group inline-flex min-w-0 items-center gap-2.5 rounded-2xl"
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
            {compact ? null : (
                <span className="flex flex-col leading-none whitespace-nowrap">
                    <span className="font-display text-lg font-semibold tracking-tight text-ink">
                        {brandLines(general.brandName)[0]}
                    </span>
                    <span className="text-[0.65rem] font-bold tracking-[0.22em] text-blush-500 uppercase">
                        Panel
                    </span>
                </span>
            )}
        </Link>
    )
}

interface SidebarToggleProps {
    isCollapsed: boolean
    onToggle: () => void
}

function SidebarToggle({ isCollapsed, onToggle }: SidebarToggleProps) {
    const label = isCollapsed ? 'Expandir menú' : 'Contraer menú'
    const Icon = isCollapsed ? PanelLeftOpen : PanelLeftClose

    return (
        // The icon alone never says what it does, so it has a tooltip in both states.
        <RailTooltip enabled content={<RailTip title={label} shortcut={SHORTCUT_LABEL} />}>
            <button
                type="button"
                onClick={onToggle}
                aria-label={label}
                aria-expanded={!isCollapsed}
                aria-controls={SIDEBAR_ID}
                aria-keyshortcuts="Control+B Meta+B"
                className={
                    isCollapsed
                        ? RAIL_BUTTON_CLASS
                        : 'flex size-10 shrink-0 items-center justify-center rounded-xl text-ink-soft transition hover:bg-blush-100 hover:text-ink'
                }
            >
                <Icon aria-hidden="true" className="size-5" />
            </button>
        </RailTooltip>
    )
}

interface AdminNavProps {
    user: AuthUser
    onNavigate?: () => void
    /** Desktop rail: icons only, with tooltips instead of labels. */
    isCollapsed?: boolean
}

function AdminNav({ user, onNavigate, isCollapsed = false }: AdminNavProps) {
    const { data: summary } = useAdminOrdersSummary()
    const pending = summary?.pendingVerification ?? 0

    const links = NAV_LINKS.filter((link) => !link.roles || link.roles.includes(user.role))

    return (
        <nav aria-label="Administración">
            <ul className="space-y-1">
                {links.map(({ label, to, icon: Icon }) => {
                    const count = to === ADMIN_ROUTES.orders ? pending : 0
                    const countText = `${count} por verificar`

                    return (
                        <li key={to}>
                            <RailTooltip
                                enabled={isCollapsed}
                                content={
                                    <RailTip
                                        title={label}
                                        accent={count > 0 ? countText : undefined}
                                    />
                                }
                            >
                                <NavLink
                                    to={to}
                                    onClick={onNavigate}
                                    aria-label={
                                        isCollapsed
                                            ? count > 0
                                                ? `${label} (${countText})`
                                                : label
                                            : undefined
                                    }
                                    className={({ isActive }) =>
                                        navLinkVariants({ isActive, isCollapsed })
                                    }
                                >
                                    <span className="relative flex shrink-0">
                                        <Icon aria-hidden="true" className="size-5" />
                                        {isCollapsed && count > 0 ? (
                                            <span
                                                aria-hidden="true"
                                                className="absolute -top-2 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blush-500 px-1 text-[10px] leading-none font-bold text-white tabular-nums ring-2 ring-cream"
                                            >
                                                {count > 99 ? '99+' : count}
                                            </span>
                                        ) : null}
                                    </span>
                                    {isCollapsed ? null : (
                                        <>
                                            <span className="flex-1">{label}</span>
                                            {count > 0 ? (
                                                <>
                                                    <span
                                                        aria-hidden="true"
                                                        className="flex min-w-6 items-center justify-center rounded-full bg-blush-500 px-1.5 text-xs font-bold text-white tabular-nums"
                                                    >
                                                        {count}
                                                    </span>
                                                    <span className="sr-only">({countText})</span>
                                                </>
                                            ) : null}
                                        </>
                                    )}
                                </NavLink>
                            </RailTooltip>
                        </li>
                    )
                })}
                <li>
                    <RailTooltip
                        enabled={isCollapsed}
                        content={
                            <RailTip title="Ver tienda" detail="Se abre en una pestaña nueva" />
                        }
                    >
                        <a
                            href={ROUTES.home}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={
                                isCollapsed
                                    ? 'Ver tienda (se abre en una pestaña nueva)'
                                    : undefined
                            }
                            className={navLinkVariants({ isCollapsed })}
                        >
                            <ExternalLink aria-hidden="true" className="size-5 shrink-0" />
                            {isCollapsed ? null : (
                                <>
                                    Ver tienda
                                    <span className="sr-only">(se abre en una pestaña nueva)</span>
                                </>
                            )}
                        </a>
                    </RailTooltip>
                </li>
            </ul>
        </nav>
    )
}

interface AdminUserBlockProps {
    user: AuthUser
    onNavigate?: () => void
    /** Desktop rail: the initial and the logout icon, stacked. */
    isCollapsed?: boolean
}

/** Who is signed in, and the way out: one compact row (or a stack in the rail). */
function AdminUserBlock({ user, onNavigate, isCollapsed = false }: AdminUserBlockProps) {
    const navigate = useNavigate()
    const logout = useLogout()
    const roleLabel = ROLE_LABEL[user.role]

    const handleLogout = async () => {
        // The session is cleared locally even if the request fails (see `useLogout`).
        await logout.mutateAsync().catch(() => undefined)
        onNavigate?.()
        await navigate(ADMIN_ROUTES.login, { replace: true })
    }

    const userTip = (
        <RailTip
            title={user.name}
            detail={
                <>
                    <span className="text-[0.65rem] font-bold tracking-[0.18em] text-blush-500 uppercase">
                        {roleLabel}
                    </span>
                    <span>{user.email}</span>
                </>
            }
        />
    )

    const avatar = (size: string) => (
        <span
            aria-hidden="true"
            className={cn(
                'flex shrink-0 items-center justify-center rounded-full bg-blush-100 font-display font-semibold text-blush-700 ring-1 ring-blush-200',
                size,
            )}
        >
            {initialOf(user.name)}
        </span>
    )

    const logoutButton = (className: string) => (
        <RailTooltip
            enabled
            placement={isCollapsed ? 'side' : 'top'}
            content={<RailTip title="Cerrar sesión" />}
        >
            <button
                type="button"
                onClick={() => void handleLogout()}
                disabled={logout.isPending}
                aria-busy={logout.isPending || undefined}
                aria-label="Cerrar sesión"
                className={cn(
                    'text-ink-soft hover:text-blush-700 disabled:pointer-events-none disabled:opacity-60',
                    className,
                )}
            >
                {logout.isPending ? (
                    <Spinner size="sm" label="Cerrando sesión" />
                ) : (
                    <LogOut aria-hidden="true" className="size-5" />
                )}
            </button>
        </RailTooltip>
    )

    if (isCollapsed) {
        return (
            <div className="flex flex-col items-center gap-2 border-t border-line pt-4">
                <RailTooltip enabled content={userTip}>
                    {/* Focusable only so keyboard users can reach the same details. */}
                    <span
                        role="img"
                        tabIndex={0}
                        aria-label={`Sesión de ${user.name}, ${roleLabel}, ${user.email}`}
                        className="flex rounded-full"
                    >
                        {avatar('size-10 text-base')}
                    </span>
                </RailTooltip>
                {logoutButton(RAIL_BUTTON_CLASS)}
            </div>
        )
    }

    return (
        <div className="flex items-center gap-1 rounded-2xl border border-line bg-white p-1.5 pl-2">
            {/* The row is narrow: the role, and the email when it truncates, live in a tooltip. */}
            <RailTooltip
                enabled
                placement="top"
                content={userTip}
                className="flex min-w-0 flex-1 items-center gap-2.5"
            >
                {avatar('size-9 text-sm')}
                <span className="flex min-w-0 flex-col">
                    <span className="truncate font-display text-sm leading-5 font-semibold text-ink">
                        {user.name}
                    </span>
                    <span className="truncate text-xs leading-4 text-ink-soft">{user.email}</span>
                </span>
            </RailTooltip>
            {logoutButton(
                'flex size-10 shrink-0 items-center justify-center rounded-xl transition duration-200 hover:bg-blush-50',
            )}
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
    const [isCollapsed, setIsCollapsed] = useSidebarCollapsed()
    const { data: summary } = useAdminOrdersSummary()
    const pending = summary?.pendingVerification ?? 0

    // `RequireAdmin` only renders this layout with a session; this narrows the type.
    if (!user) return null

    const closeMenu = () => setIsMenuOpen(false)

    return (
        <div className="min-h-screen overflow-x-clip bg-cream">
            <ScrollToTop />

            <aside
                id={SIDEBAR_ID}
                className={cn(
                    'fixed inset-y-0 left-0 hidden flex-col overflow-hidden border-r border-line bg-blush-50/60 py-5 transition-[width,padding] duration-300 ease-out motion-reduce:transition-none lg:flex',
                    // Collapsed, the content box (80 - 16 - 15 - the 1px border) is exactly
                    // one 48px rail button wide, so every icon shares the rail's centre.
                    isCollapsed ? 'w-20 pr-[15px] pl-4' : 'w-72 px-5',
                )}
            >
                <div
                    className={cn(
                        'flex shrink-0',
                        isCollapsed
                            ? 'flex-col items-center gap-2'
                            : 'items-center justify-between gap-2',
                    )}
                >
                    <AdminBrand compact={isCollapsed} />
                    <SidebarToggle
                        isCollapsed={isCollapsed}
                        onToggle={() => setIsCollapsed((value) => !value)}
                    />
                </div>
                {/* Scrolls only as a last resort, on very short windows. The padding keeps
                    focus outlines clear of the scroll box's clipping edge. */}
                <div
                    data-sidebar-scroll=""
                    className="-mx-1 mt-6 min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-1"
                >
                    <AdminNav user={user} isCollapsed={isCollapsed} />
                </div>
                <div className="mt-4 shrink-0">
                    <AdminUserBlock user={user} isCollapsed={isCollapsed} />
                </div>
            </aside>

            <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-line bg-cream/90 px-4 py-3 backdrop-blur lg:hidden">
                <AdminBrand />
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(true)}
                    aria-label={
                        pending > 0
                            ? `Abrir menú de administración (${pending} pedidos por verificar)`
                            : 'Abrir menú de administración'
                    }
                    aria-expanded={isMenuOpen}
                    className="relative flex size-11 items-center justify-center rounded-full text-ink transition hover:bg-blush-100 focus-visible:ring-2 focus-visible:ring-blush-400 focus-visible:ring-offset-2"
                >
                    <Menu aria-hidden="true" className="size-6" />
                    {pending > 0 ? (
                        <span
                            aria-hidden="true"
                            className="absolute top-0.5 right-0.5 flex min-w-5 items-center justify-center rounded-full bg-blush-500 px-1 text-[11px] font-bold text-white tabular-nums"
                        >
                            {pending}
                        </span>
                    ) : null}
                </button>
            </header>

            <Drawer isOpen={isMenuOpen} onClose={closeMenu} title="Administración" side="left">
                <div className="flex min-h-full flex-col gap-6">
                    <AdminNav user={user} onNavigate={closeMenu} />
                    <div className="mt-auto">
                        <AdminUserBlock user={user} onNavigate={closeMenu} />
                    </div>
                </div>
            </Drawer>

            <main
                className={cn(
                    'transition-[padding] duration-300 ease-out motion-reduce:transition-none',
                    isCollapsed ? 'lg:pl-20' : 'lg:pl-72',
                )}
            >
                {/* The rail frees room, so collapsed pages may also grow wider on large screens. */}
                <div
                    className={cn(
                        'mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10',
                        isCollapsed && 'lg:max-w-7xl',
                    )}
                >
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
