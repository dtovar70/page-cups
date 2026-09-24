import type { CategorySlug } from '@/@types/product'
import { mixHex } from '@/utils/color'

/**
 * Hex mirror of the `@theme` tokens in `index.css`. Inline SVG illustrations need
 * literal color values, which Tailwind utility classes cannot provide.
 */
export const PALETTE = {
    blush50: '#FFF5F9',
    blush100: '#FFE7F1',
    blush200: '#FFD1E4',
    blush300: '#FFB3D1',
    blush400: '#FF8FB8',
    blush500: '#FB6FA5',
    blush600: '#E75F9B',
    blush700: '#C44A80',
    blush800: '#9C3A66',
    blush900: '#7A2E50',
    sky50: '#F2F9FF',
    sky100: '#E0F1FF',
    sky200: '#C4E4FF',
    sky300: '#A8D8FF',
    sky400: '#7CC0FF',
    sky500: '#57A9F5',
    sky600: '#3E9BE0',
    sky700: '#2F7CB8',
    sky800: '#255F8D',
    sky900: '#1C4869',
    lilac200: '#E4D9FF',
    lilac400: '#C0AEFF',
    mint200: '#C9F2E0',
    mint400: '#7FD9B4',
    butter200: '#FFEFC2',
    butter400: '#FFD979',
    cream: '#FFF9FB',
    ink: '#2E2438',
    inkSoft: '#6B5F78',
    line: '#F0E4EC',
} as const

export type PaletteKey = keyof typeof PALETTE

export interface CategoryTheme {
    /** Backdrop behind the illustration. */
    surface: string
    /** Structural strokes and outlines. */
    stroke: string
    /** Secondary decorative fill. */
    accent: string
    /** Color of the `printText` drawn on the product. */
    print: string
}

/**
 * Categories that have their own illustration and palette. Categories created later from the
 * admin fall back to the generic artwork, tinted with the category color.
 */
export const ARTWORK_CATEGORIES = ['mugs', 'tees', 'keychains'] as const

export type ArtworkCategory = (typeof ARTWORK_CATEGORIES)[number]

export function hasDedicatedArtwork(slug: CategorySlug): slug is ArtworkCategory {
    return (ARTWORK_CATEGORIES as readonly string[]).includes(slug)
}

export const CATEGORY_THEME: Record<ArtworkCategory, CategoryTheme> = {
    mugs: {
        surface: PALETTE.blush50,
        stroke: PALETTE.blush600,
        accent: PALETTE.blush200,
        print: PALETTE.ink,
    },
    tees: {
        surface: PALETTE.sky50,
        stroke: PALETTE.sky600,
        accent: PALETTE.sky200,
        print: PALETTE.ink,
    },
    keychains: {
        surface: PALETTE.lilac200,
        stroke: PALETTE.lilac400,
        accent: PALETTE.butter200,
        print: PALETTE.ink,
    },
} as const

/** Tailwind backdrop behind a product of a category with dedicated artwork. */
export const CATEGORY_SURFACE_CLASS: Record<ArtworkCategory, string> = {
    mugs: 'bg-blush-50',
    tees: 'bg-sky-50',
    keychains: 'bg-lilac-200/45',
}

/** Palette for the generic artwork, derived from one accent (usually the category color). */
export function genericCategoryTheme(accent: string): CategoryTheme {
    return {
        surface: mixHex(accent, '#FFFFFF', 0.82),
        stroke: mixHex(accent, PALETTE.ink, 0.45),
        accent: mixHex(accent, '#FFFFFF', 0.4),
        print: PALETTE.ink,
    }
}

export function categoryTheme(slug: CategorySlug, accent: string): CategoryTheme {
    return hasDedicatedArtwork(slug) ? CATEGORY_THEME[slug] : genericCategoryTheme(accent)
}
