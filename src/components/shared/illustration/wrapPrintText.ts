const DEFAULT_MAX_LINES = 3

/**
 * Splits a short print text into balanced lines. Print texts are 1–3 words, so an
 * even word distribution reads better than a greedy character-width wrap.
 */
export function wrapPrintText(text: string, maxLines = DEFAULT_MAX_LINES): string[] {
    const words = text.trim().split(/\s+/).filter(Boolean)
    if (words.length === 0) return []

    const lineCount = Math.min(Math.max(1, maxLines), words.length)
    const wordsPerLine = Math.ceil(words.length / lineCount)
    const lines: string[] = []

    for (let index = 0; index < words.length; index += wordsPerLine) {
        lines.push(words.slice(index, index + wordsPerLine).join(' '))
    }

    return lines
}
