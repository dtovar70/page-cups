import type { CSSProperties } from 'react'

import type { CategorySlug } from '@/@types/product'
import {
    CATEGORY_SURFACE_CLASS,
    genericCategoryTheme,
    hasDedicatedArtwork,
    PALETTE,
    type ArtworkCategory,
    type CategoryTheme,
} from '@/constants/theme.constant'

/** Every artwork draws inside this box so all products share one scale. */
export const ARTWORK_VIEW_BOX = '0 0 240 200'

export interface ArtworkProps {
    /** Main body color of the product, usually the variant or product `colorHex`. */
    color: string
    theme: CategoryTheme
    printText: string
}

const ARTWORK_NOUN: Record<ArtworkCategory, string> = {
    mugs: 'Taza personalizada',
    tees: 'Franela personalizada',
    keychains: 'Llavero personalizado',
}

/** Accessible name of a generated illustration. */
export function artworkLabel(category: CategorySlug, printText: string): string {
    const noun = hasDedicatedArtwork(category) ? ARTWORK_NOUN[category] : 'Producto personalizado'
    return `${noun} con el texto “${printText}”`
}

export interface CategorySurface {
    className?: string
    style?: CSSProperties
}

/**
 * Backdrop for a product's media slot: the category's own token when it has dedicated
 * artwork, otherwise a light tint of `accent` (the category color).
 */
export function categorySurface(category: CategorySlug, accent: string): CategorySurface {
    if (hasDedicatedArtwork(category)) return { className: CATEGORY_SURFACE_CLASS[category] }
    return { style: { backgroundColor: genericCategoryTheme(accent).surface } }
}

function channel(hex: string, start: number): number {
    const parsed = Number.parseInt(hex.slice(start, start + 2), 16)
    return Number.isNaN(parsed) ? 255 : parsed
}

function perceivedLightness(hex: string): number {
    const raw = hex.replace('#', '')
    const full =
        raw.length === 3
            ? raw
                  .split('')
                  .map((char) => char + char)
                  .join('')
            : raw

    return (0.299 * channel(full, 0) + 0.587 * channel(full, 2) + 0.114 * channel(full, 4)) / 255
}

/** Keeps the printed text legible on dark bodies such as the magic black mug. */
export function readablePrintColor(background: string, preferred: string): string {
    return perceivedLightness(background) < 0.55 ? PALETTE.cream : preferred
}
