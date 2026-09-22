import type { CategorySlug } from '@/@types/product'
import { PALETTE, type CategoryTheme } from '@/constants/theme.constant'

/** Every artwork draws inside this box so the three products share one scale. */
export const ARTWORK_VIEW_BOX = '0 0 240 200'

export interface ArtworkProps {
    /** Main body color of the product, usually the variant or product `colorHex`. */
    color: string
    theme: CategoryTheme
    printText: string
}

export const CATEGORY_NOUN: Record<CategorySlug, string> = {
    mugs: 'Taza',
    tees: 'Franela',
    keychains: 'Llavero',
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
