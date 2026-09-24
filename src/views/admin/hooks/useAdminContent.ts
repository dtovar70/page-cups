import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'

import type { AdminContent, AdminContentSection } from '@/@types/admin'
import type { ContentSection, SiteContent } from '@/@types/content'
import { queryKeys } from '@/constants/query-keys.constant'
import { ContentService } from '@/services/ContentService'

export function useAdminContent() {
    return useQuery({
        queryKey: queryKeys.admin.content(),
        queryFn: ContentService.getAdminContent,
        // A section edited in another tab should not be overwritten with stale values.
        refetchOnWindowFocus: false,
    })
}

/** Stores the saved section in the admin cache and refreshes the storefront's content. */
function applySavedSection(queryClient: QueryClient, saved: AdminContentSection): Promise<void> {
    queryClient.setQueryData<AdminContent>(queryKeys.admin.content(), (current) =>
        current ? { ...current, [saved.section]: saved } : current,
    )
    return queryClient.invalidateQueries({ queryKey: queryKeys.content })
}

export function useUpdateContentSection() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            section,
            value,
        }: {
            section: ContentSection
            value: SiteContent[ContentSection]
        }): Promise<AdminContentSection> => ContentService.updateSection(section, value),
        onSuccess: (saved) => applySavedSection(queryClient, saved),
    })
}

/** ADMIN only. */
export function useResetContentSection() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (section: ContentSection) =>
            ContentService.resetSection(section) as Promise<AdminContentSection>,
        onSuccess: (saved) => applySavedSection(queryClient, saved),
    })
}
