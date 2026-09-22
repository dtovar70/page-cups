import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Resets the scroll position on navigation. Hash links keep the browser's own
 * anchor behavior.
 */
export function ScrollToTop() {
    const { pathname, hash } = useLocation()

    useEffect(() => {
        if (hash) return

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    }, [pathname, hash])

    return null
}
