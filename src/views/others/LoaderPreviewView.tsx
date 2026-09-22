import { RouteFallback } from '@/components/route/RouteFallback'

/**
 * Development sandbox: holds the global loader on screen indefinitely so its animation can
 * be reviewed without racing a real page load. The router only mounts this in dev, and the
 * bundler drops it from production builds along with the branch that references it.
 */
export function LoaderPreviewView() {
    return <RouteFallback />
}
