import { Fragment } from 'react'

import { cn } from '@/utils/cn'
import { splitHighlights } from '@/utils/content'

export interface HighlightedTextProps {
    /** Words between asterisks are highlighted: "Tus *favoritos*". */
    text: string
    className?: string
}

/** Paints the *marked* words in blush, the brand's signature headline accent. */
export function HighlightedText({ text, className }: HighlightedTextProps) {
    return splitHighlights(text).map((segment, index) =>
        segment.highlighted ? (
            <span key={index} className={cn('text-blush-500', className)}>
                {segment.text}
            </span>
        ) : (
            <Fragment key={index}>{segment.text}</Fragment>
        ),
    )
}
