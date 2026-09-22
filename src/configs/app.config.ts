import { categoryPath, ROUTES } from '@/constants/route.constant'

export interface NavLink {
    label: string
    to: string
}

export interface SocialLink {
    label: string
    handle: string
    href: string
}

export const FREE_SHIPPING_THRESHOLD = 35

export const appConfig = {
    brand: 'Manada Russo Creativa',
    /** The wordmark is set on two lines so the long name fits the header lockup. */
    brandLines: ['Manada Russo', 'Creativa'] as const,
    logo: {
        src: '/img/logo-mark.webp',
        srcSet: '/img/logo-mark.webp 256w, /img/logo-mark@2x.webp 512w',
        alt: 'Manada Russo Creativa: perro de la manada rodeado de acuarelas e íconos creativos',
    },
    tagline: 'Sublimación hecha con amor',
    description:
        'Tazas, franelas y llaveros personalizados con sublimación. Tú mandas el diseño, nosotros lo hacemos realidad.',
    navLinks: [
        { label: 'Inicio', to: ROUTES.home },
        { label: 'Catálogo', to: ROUTES.catalog },
        { label: 'Tazas', to: categoryPath('mugs') },
        { label: 'Franelas', to: categoryPath('tees') },
        { label: 'Llaveros', to: categoryPath('keychains') },
        { label: 'Nosotros', to: ROUTES.about },
        { label: 'Contacto', to: ROUTES.contact },
    ] satisfies NavLink[],
    socials: [
        {
            label: 'Instagram',
            handle: '@manadarussocreativa',
            href: 'https://instagram.com/manadarussocreativa',
        },
        {
            label: 'TikTok',
            handle: '@manadarussocreativa',
            href: 'https://tiktok.com/@manadarussocreativa',
        },
        {
            label: 'WhatsApp',
            handle: '+58 412 555 0134',
            href: 'https://wa.me/584125550134',
        },
    ] satisfies SocialLink[],
    contact: {
        email: 'hola@manadarusso.com',
        phone: '+58 412 555 0134',
        city: 'Valencia, Carabobo',
        address: 'Av. Bolívar Norte, Torre Kalu, piso 3',
        schedule: 'Lunes a viernes, 9:00 a.m. – 6:00 p.m.',
    },
    shipping: {
        freeThreshold: FREE_SHIPPING_THRESHOLD,
        flatRate: 4,
        freeShippingCopy: `Envío gratis desde $${FREE_SHIPPING_THRESHOLD}`,
        productionCopy: 'Producción en 3 a 5 días hábiles',
        announcements: [
            `Envío gratis desde $${FREE_SHIPPING_THRESHOLD}`,
            'Diseños 100% personalizables',
            'Hecho a mano en Venezuela',
        ],
    },
} as const
