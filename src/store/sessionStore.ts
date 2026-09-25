import { create } from 'zustand'

import type { SessionEndReason } from '@/configs/session.config'

interface SessionState {
    /**
     * Why the admin session is ending. Set just before the session is cleared, so
     * `RequireAdmin` can pass it to the login page (navigation state), which shows the notice.
     */
    endReason: SessionEndReason | null
    setEndReason: (reason: SessionEndReason | null) => void
}

export const useSessionStore = create<SessionState>()((set) => ({
    endReason: null,
    setEndReason: (endReason) => set({ endReason }),
}))
