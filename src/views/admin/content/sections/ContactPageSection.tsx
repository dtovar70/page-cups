import { useFieldArray, useWatch } from 'react-hook-form'

import { Input, Textarea } from '@/components/ui'
import { placeholderValues } from '@/utils/content'
import { useSiteContent } from '@/utils/hooks/useSiteContent'
import { FieldGroup } from '@/views/admin/content/components/FieldGroup'
import { placeholderHint } from '@/views/admin/content/components/placeholders'
import { SectionFormLayout } from '@/views/admin/content/components/SectionFormLayout'
import { SortableList } from '@/views/admin/content/components/SortableList'
import { TitleField } from '@/views/admin/content/components/TitleField'
import { useSectionForm, type SectionFormProps } from '@/views/admin/content/hooks/useSectionForm'
import {
    CONTENT_LIST_SIZES,
    FAQ_PLACEHOLDERS,
    SECTION_FORMS,
} from '@/views/admin/content/schema/content.schema'

export function ContactPageSection(props: SectionFormProps<'contactPage'>) {
    const state = useSectionForm(SECTION_FORMS.contactPage, props)
    const {
        control,
        register,
        formState: { errors },
    } = state.form
    const faq = useFieldArray({ control, name: 'faq' })
    const [title, faqTitle] = useWatch({ control, name: ['title', 'faqTitle'] })
    const placeholders = placeholderValues(useSiteContent())

    return (
        <SectionFormLayout state={state}>
            <FieldGroup title="Encabezado">
                <Input label="Etiqueta" error={errors.badge?.message} {...register('badge')} />
                <TitleField
                    label="Título"
                    size="hero"
                    value={title}
                    error={errors.title?.message}
                    registration={register('title')}
                />
                <Textarea
                    label="Introducción"
                    rows={2}
                    error={errors.intro?.message}
                    {...register('intro')}
                />
            </FieldGroup>

            <FieldGroup
                title="Preguntas frecuentes"
                description={placeholderHint(FAQ_PLACEHOLDERS, placeholders)}
            >
                <Input
                    label="Antetítulo"
                    error={errors.faqEyebrow?.message}
                    {...register('faqEyebrow')}
                />
                <TitleField
                    label="Título"
                    value={faqTitle}
                    error={errors.faqTitle?.message}
                    registration={register('faqTitle')}
                />
                <SortableList
                    label="Preguntas frecuentes"
                    itemIds={faq.fields.map((field) => field.id)}
                    itemName={(position) => `Pregunta ${position}`}
                    onMove={faq.move}
                    onRemove={faq.remove}
                    onAdd={() => faq.append({ question: '', answer: '' })}
                    addLabel="Agregar pregunta"
                    minItems={CONTENT_LIST_SIZES.faq.min}
                    maxItems={CONTENT_LIST_SIZES.faq.max}
                    error={errors.faq?.message ?? errors.faq?.root?.message}
                    renderItem={(index) => (
                        <>
                            <Input
                                label="Pregunta"
                                error={errors.faq?.[index]?.question?.message}
                                {...register(`faq.${index}.question`)}
                            />
                            <Textarea
                                label="Respuesta"
                                rows={3}
                                error={errors.faq?.[index]?.answer?.message}
                                {...register(`faq.${index}.answer`)}
                            />
                        </>
                    )}
                />
            </FieldGroup>
        </SectionFormLayout>
    )
}
