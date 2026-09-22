import { useEffect } from 'react'

/**
 * Compensates the scrollbar width while locking so the page does not shift
 * horizontally when an overlay opens.
 */
export function useLockBodyScroll(isLocked: boolean): void {
    useEffect(() => {
        if (!isLocked) return

        const { body, documentElement } = document
        const previousOverflow = body.style.overflow
        const previousPaddingRight = body.style.paddingRight
        const scrollbarWidth = window.innerWidth - documentElement.clientWidth

        body.style.overflow = 'hidden'
        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${scrollbarWidth}px`
        }

        return () => {
            body.style.overflow = previousOverflow
            body.style.paddingRight = previousPaddingRight
        }
    }, [isLocked])
}
