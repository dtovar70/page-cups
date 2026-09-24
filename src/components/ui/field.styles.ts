/**
 * Shared shell for the text-entry fields (Input, Textarea, Select).
 *
 * The focus treatment is deliberately one element: the border turns blush and a soft halo
 * hugs it. A coloured border *plus* an offset ring reads as two stacked outlines.
 */
export const FIELD_BASE_CLASS =
    'w-full border-2 border-line bg-white text-base text-ink transition placeholder:text-ink-soft/70 focus-visible:border-blush-400 focus-visible:ring-4 focus-visible:ring-blush-200/70 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60'

/** Field label; `OptionalMark` sits inline after the text when a field can be left empty. */
export const FIELD_LABEL_CLASS = 'text-sm font-semibold text-ink'

/** One helper style for every field: small, muted, directly under the control. */
export const FIELD_HINT_CLASS = 'text-xs leading-snug text-ink-soft'

/** Validation message under a field; replaces the hint while it is shown. */
export const FIELD_MESSAGE_ERROR_CLASS = 'text-sm font-medium text-blush-700'

/** Invalid fields keep the halo but swap both layers to the stronger blush. */
export const FIELD_ERROR_CLASS = 'border-blush-500 focus-visible:ring-blush-300'
