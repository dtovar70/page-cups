import { AdminLayout } from '@/components/layouts/AdminLayout'
import { RequireAdmin } from '@/views/admin/components/RequireAdmin'
import { SessionTimeoutManager } from '@/views/admin/session/SessionTimeoutManager'

/** Guarded back-office shell: session check first, then the inactivity timeout and chrome. */
export function AdminShell() {
    return (
        <RequireAdmin>
            <SessionTimeoutManager />
            <AdminLayout />
        </RequireAdmin>
    )
}
