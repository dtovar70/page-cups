import { useFieldArray, useWatch } from 'react-hook-form'

import { Input } from '@/components/ui'
import { placeholderValues } from '@/utils/content'
import { useFillPlaceholders, useSiteContent } from '@/utils/hooks/useSiteContent'
import { FieldGroup } from '@/views/admin/content/components/FieldGroup'
import { placeholderHint } from '@/views/admin/content/components/placeholders'
import { SectionFormLayout } from '@/views/admin/content/components/SectionFormLayout'
import { SortableList } from '@/views/admin/content/components/SortableList'
import { TickerPreview } from '@/views/admin/content/components/TickerPreview'
import { useSectionForm, type SectionFormProps } from '@/views/admin/content/hooks/useSectionForm'
import {
    ANNOUNCEMENT_PLACEHOLDERS,
    CONTENT_LIST_SIZES,
    SECTION_FORMS,
} from '@/views/admin/content/schema/content.schema'

export function AnnouncementsSection(props: SectionFormProps<'announcements'>) {
    const state = useSectionForm(SECTION_FORMS.announcements, props)
    const {
        control,
        register,
        formState: { errors },
    } = state.form
    const messages = useFieldArray({ control, name: 'messages' })
    const watched = useWatch({ control, name: 'messages' })
    const fill = useFillPlaceholders()
    const values = placeholderValues(useSiteContent())

    return (
        <SectionFormLayout state={state}>
            <FieldGroup
                title="Mensajes"
                description={
                    <>
                        Entre 1 y {CONTENT_LIST_SIZES.announcements.max} mensajes cortos.{' '}
                        {placeholderHint(ANNOUNCEMENT_PLACEHOLDERS, values)} Así el mensaje de envío
                        gratis se actualiza solo cuando cambias el monto en «Envíos».
                    </>
                }
            >
                <SortableList
                    label="Mensajes de la cinta"
                    itemIds={messages.fields.map((field) => field.id)}
                    itemName={(position) => `Mensaje ${position}`}
                    onMove={messages.move}
                    onRemove={messages.remove}
                    onAdd={() => messages.append({ value: '' })}
                    addLabel="Agregar mensaje"
                    minItems={CONTENT_LIST_SIZES.announcements.min}
                    maxItems={CONTENT_LIST_SIZES.announcements.max}
                    error={errors.messages?.message ?? errors.messages?.root?.message}
                    renderItem={(index) => (
                        <Input
                            label={`Mensaje ${index + 1}`}
                            hideLabel
                            placeholder="Envío gratis desde {envioGratis}"
                            error={errors.messages?.[index]?.value?.message}
                            {...register(`messages.${index}.value`)}
                        />
                    )}
                />
                <TickerPreview messages={(watched ?? []).map((item) => fill(item.value))} />
            </FieldGroup>
        </SectionFormLayout>
    )
}
