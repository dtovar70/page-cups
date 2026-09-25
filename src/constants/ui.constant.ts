/** How long success notices stay on screen before their countdown dismisses them. */
export const NOTICE_DISMISS_MS = 5000

/**
 * Longest text any single-line field accepts (text, email, search, tel). `Input` applies it
 * unless a field sets a smaller `maxLength`; the API DTOs and the database columns use the same
 * limit. Multi-line fields (`Textarea`) always set their own.
 */
export const TEXT_INPUT_MAX_LENGTH = 100

/** Character counters appear once a field holds more than this share of its limit… */
export const CHARACTER_COUNT_THRESHOLD = 0.8

/** …and only on limits this long: short format fields (phone, bank code) do not need one. */
export const CHARACTER_COUNT_MIN_LIMIT = 20

/** Zod message for `TEXT_INPUT_MAX_LENGTH`. */
export const TEXT_INPUT_MAX_MESSAGE = `Máximo ${TEXT_INPUT_MAX_LENGTH} caracteres`
