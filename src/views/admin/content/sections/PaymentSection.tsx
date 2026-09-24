import { useWatch } from 'react-hook-form'

import { Input, Select, Textarea, type SelectOption } from '@/components/ui'
import { FieldGroup, FieldRow } from '@/views/admin/content/components/FieldGroup'
import { PaymentPreviewCard } from '@/views/admin/content/components/PaymentPreviewCard'
import { SectionFormLayout } from '@/views/admin/content/components/SectionFormLayout'
import { useSectionForm, type SectionFormProps } from '@/views/admin/content/hooks/useSectionForm'
import { SECTION_FORMS } from '@/views/admin/content/schema/content.schema'
import { VE_BANKS } from '@/views/admin/content/sections/banks'

const BANK_OPTIONS: SelectOption[] = VE_BANKS.map((bank) => ({
    value: bank.code,
    label: `${bank.code} - ${bank.name}`,
}))

export function PaymentSection(props: SectionFormProps<'payment'>) {
    const state = useSectionForm(SECTION_FORMS.payment, props)
    const {
        control,
        register,
        setValue,
        formState: { errors },
    } = state.form
    const payment = useWatch({ control })
    // A bank saved with a code outside the list still shows up as an option.
    const savedCode = props.saved.value.bankCode
    const options =
        savedCode && !BANK_OPTIONS.some((option) => option.value === savedCode)
            ? [
                  ...BANK_OPTIONS,
                  { value: savedCode, label: `${savedCode} - ${props.saved.value.bankName}` },
              ]
            : BANK_OPTIONS

    const bankField = register('bankCode', {
        onChange: (event: { target: { value: string } }) => {
            const bank = VE_BANKS.find((item) => item.code === event.target.value)
            if (bank) setValue('bankName', bank.name, { shouldDirty: true, shouldValidate: true })
        },
    })

    return (
        <SectionFormLayout state={state}>
            <FieldGroup
                title="Datos de Pago Móvil"
                description="Revisa bien cada dato: el cliente los copiará para pagarte."
            >
                <Select
                    label="Banco"
                    placeholder="Elige el banco"
                    options={options}
                    error={errors.bankCode?.message ?? errors.bankName?.message}
                    {...bankField}
                />
                <FieldRow>
                    <Input
                        label="Teléfono"
                        inputMode="tel"
                        placeholder="0412-5550134"
                        error={errors.phone?.message}
                        {...register('phone')}
                    />
                    <Input
                        label="Cédula o RIF"
                        placeholder="V-12345678"
                        autoCapitalize="characters"
                        spellCheck={false}
                        error={errors.idNumber?.message}
                        {...register('idNumber')}
                    />
                </FieldRow>
                <Input
                    label="Titular"
                    hint="Nombre de la persona o empresa dueña de la cuenta."
                    error={errors.holderName?.message}
                    {...register('holderName')}
                />
                <Textarea
                    label="Instrucciones"
                    optional
                    rows={3}
                    hint="Por ejemplo: envía la captura del pago por WhatsApp con tu número de pedido."
                    error={errors.instructions?.message}
                    {...register('instructions')}
                />
            </FieldGroup>

            <FieldGroup title="Vista previa">
                <PaymentPreviewCard
                    payment={{
                        bankCode: payment.bankCode ?? '',
                        bankName: payment.bankName ?? '',
                        phone: payment.phone?.trim() ?? '',
                        idNumber: payment.idNumber?.trim().toUpperCase() ?? '',
                        holderName: payment.holderName?.trim() ?? '',
                        instructions: payment.instructions?.trim() ?? '',
                    }}
                />
            </FieldGroup>
        </SectionFormLayout>
    )
}
