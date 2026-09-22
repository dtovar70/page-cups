/**
 * Shared shell for the text-entry fields (Input, Textarea, Select).
 *
 * The focus treatment is deliberately one element: the border turns blush and a soft halo
 * hugs it. A coloured border *plus* an offset ring reads as two stacked outlines.
 */
export const FIELD_BASE_CLASS =
    'w-full border-2 border-line bg-white text-base text-ink transition placeholder:text-ink-soft/70 focus-visible:border-blush-400 focus-visible:ring-4 focus-visible:ring-blush-200/70 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60'

/** Invalid fields keep the halo but swap both layers to the stronger blush. */
export const FIELD_ERROR_CLASS = 'border-blush-500 focus-visible:ring-blush-300'
