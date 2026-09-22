import { Spinner } from '@/components/ui/Spinner'

export interface RouteFallbackProps {
    message?: string
}

export function RouteFallback({ message = 'Preparando todo…' }: RouteFallbackProps) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
            <Spinner size="lg" className="text-blush-400" label={message} />
            <p className="font-display text-lg text-ink-soft">{message}</p>
        </div>
    )
}
