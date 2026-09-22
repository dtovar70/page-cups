import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

interface LoadingState {
    /**
     * How many global loaders are mounted. A counter rather than a boolean, so two
     * overlapping ones (a route swap starting while another is still unmounting) cannot
     * switch the flag off early.
     */
    globalCount: number
    beginGlobal: () => void
    endGlobal: () => void
}

const useLoadingStore = create<LoadingState>((set) => ({
    globalCount: 0,
    beginGlobal: () => set((state) => ({ globalCount: state.globalCount + 1 })),
    endGlobal: () => set((state) => ({ globalCount: Math.max(0, state.globalCount - 1) })),
}))

/**
 * True while the full-screen loader owns the screen. Spot loaders (button spinners,
 * skeletons) read this and stay out of the way, so the two are never on screen together.
 */
export function useIsGlobalLoading(): boolean {
    return useLoadingStore((state) => state.globalCount > 0)
}

export function useGlobalLoadingActions(): Pick<LoadingState, 'beginGlobal' | 'endGlobal'> {
    return useLoadingStore(
        useShallow((state) => ({ beginGlobal: state.beginGlobal, endGlobal: state.endGlobal })),
    )
}
