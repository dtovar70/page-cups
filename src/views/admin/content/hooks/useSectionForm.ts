import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    useForm,
    type DefaultValues,
    type FieldValues,
    type Resolver,
    type UseFormRegister,
    type UseFormReturn,
} from 'react-hook-form'

import type { AdminContentSection } from '@/@types/admin'
import type { ContentSection, SiteContent } from '@/@types/content'
import { getErrorMessage } from '@/services/errors'
import { schemaMaxLength } from '@/utils/schemaMaxLength'
import {
    useResetContentSection,
    useUpdateContentSection,
} from '@/views/admin/hooks/useAdminContent'
import { useSession } from '@/views/admin/hooks/useSession'
import type { SectionFormConfig } from '@/views/admin/content/schema/content.schema'
import { SECTION_META } from '@/views/admin/content/sections/sectionMeta'
import { applyContentErrors } from '@/views/admin/content/utils/applyContentErrors'

export interface SectionFormProps<K extends ContentSection> {
    saved: AdminContentSection<K>
    onDirtyChange: (section: ContentSection, isDirty: boolean) => void
}

export interface SectionFormState<F extends FieldValues> {
    section: ContentSection
    saved: AdminContentSection
    form: UseFormReturn<F>
    submit: () => void
    discard: () => void
    isSaving: boolean
    notice: string | null
    clearNotice: () => void
    serverError: string | null
    /** Only ADMIN can restore the built-in texts. */
    canRestore: boolean
    restore: {
        isOpen: boolean
        open: () => void
        close: () => void
        confirm: () => void
        isPending: boolean
        error: string | undefined
    }
}

/**
 * One section of the content editor: its form, save (full replace), discard and "restore the
 * original texts", plus the dirty flag the page needs for its tabs and navigation guard.
 */
export function useSectionForm<K extends ContentSection, F extends FieldValues>(
    config: SectionFormConfig<K, F>,
    { saved, onDirtyChange }: SectionFormProps<K>,
): SectionFormState<F> {
    const { section } = config
    const { label } = SECTION_META[section]
    const { data: session } = useSession()
    const update = useUpdateContentSection()
    const reset = useResetContentSection()
    const [notice, setNotice] = useState<string | null>(null)
    const [serverError, setServerError] = useState<string | null>(null)
    const [isRestoreOpen, setIsRestoreOpen] = useState(false)

    const rawForm = useForm<F>({
        resolver: zodResolver(config.schema as never) as unknown as Resolver<F>,
        defaultValues: config.toForm(saved.value) as DefaultValues<F>,
    })
    const { register: rawRegister } = rawForm
    // Every field stops at the length its schema allows, so the limit is never a surprise on save.
    const register = useCallback<UseFormRegister<F>>(
        (name, options) => {
            const maxLength = schemaMaxLength(config.schema, name)
            const registration = rawRegister(name, options)
            return maxLength === undefined ? registration : { ...registration, maxLength }
        },
        [config.schema, rawRegister],
    )
    const form: UseFormReturn<F> = { ...rawForm, register }
    const { isDirty } = form.formState

    useEffect(() => {
        onDirtyChange(section, isDirty)
    }, [isDirty, onDirtyChange, section])

    const loadSaved = (next: AdminContentSection) => {
        form.reset(config.toForm(next.value as SiteContent[K]) as DefaultValues<F>)
    }

    const submit = form.handleSubmit((values) => {
        setNotice(null)
        setServerError(null)
        update.mutate(
            { section, value: config.toValue(values) },
            {
                onSuccess: (next) => {
                    loadSaved(next)
                    setNotice(`Guardamos «${label}». La tienda ya muestra los cambios.`)
                },
                onError: (error) => {
                    const knownFields = Object.keys(form.getValues())
                    setServerError(applyContentErrors(error, form.setError, knownFields))
                },
            },
        )
    })

    const confirmRestore = () => {
        reset.mutate(section, {
            onSuccess: (next) => {
                loadSaved(next)
                setIsRestoreOpen(false)
                setServerError(null)
                setNotice(`Restauramos los textos originales de «${label}».`)
            },
        })
    }

    return {
        section,
        saved,
        form,
        submit: () => void submit(),
        discard: () => {
            form.reset()
            setServerError(null)
        },
        isSaving: update.isPending,
        notice,
        clearNotice: () => setNotice(null),
        serverError,
        canRestore: session?.role === 'ADMIN',
        restore: {
            isOpen: isRestoreOpen,
            open: () => {
                reset.reset()
                setNotice(null)
                setIsRestoreOpen(true)
            },
            close: () => setIsRestoreOpen(false),
            confirm: confirmRestore,
            isPending: reset.isPending,
            error: reset.isError ? getErrorMessage(reset.error) : undefined,
        },
    }
}
