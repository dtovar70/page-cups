import { useEffect, useState } from 'react'

/** Milliseconds left until `deadline` (never negative), updated every second. */
export function useCountdown(deadline: string | null | undefined): number {
    const target = deadline ? new Date(deadline).getTime() : Number.NaN
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        if (Number.isNaN(target)) return
        const timer = window.setInterval(() => setNow(Date.now()), 1000)
        return () => window.clearInterval(timer)
    }, [target])

    return Number.isNaN(target) ? 0 : Math.max(0, target - now)
}

/** 5_400_000 -> "1 h 30 min"; under a minute -> "menos de 1 min". */
export function formatRemaining(ms: number): string {
    const totalMinutes = Math.floor(ms / 60_000)
    if (totalMinutes < 1) return ms > 0 ? 'menos de 1 min' : '0 min'
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours === 0) return `${minutes} min`
    return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`
}
