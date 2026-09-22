import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button, Input, Select, Textarea, type SelectOption } from '@/components/ui'
import {
    checkoutSchema,
    DELIVERY_METHOD_LABELS,
    DELIVERY_METHODS,
    type CheckoutValues,
} from '@/views/checkout/schema/checkout.schema'

const DELIVERY_OPTIONS: SelectOption[] = DELIVERY_METHODS.map((method) => ({
    value: method,
    label: DELIVERY_METHOD_LABELS[method],
}))

export interface CheckoutFormProps {
    onConfirm: (values: CheckoutValues) => Promise<void>
}

export function CheckoutForm({ onConfirm }: CheckoutFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CheckoutValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            city: '',
            address: '',
            notes: '',
            deliveryMethod: 'delivery',
        },
    })

    return (
        <form onSubmit={handleSubmit(onConfirm)} noValidate className="space-y-6">
            <fieldset className="grid gap-5 sm:grid-cols-2" disabled={isSubmitting}>
                <legend className="mb-3 font-display text-xl text-ink">Tus datos</legend>

                <Input
                    label="Nombre y apellido"
                    autoComplete="name"
                    error={errors.fullName?.message}
                    {...register('fullName')}
                />
                <Input
                    label="Correo"
                    type="email"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email')}
                />
                <Input
                    label="Teléfono"
                    type="tel"
                    autoComplete="tel"
                    error={errors.phone?.message}
                    {...register('phone')}
                />
                <Input
                    label="Ciudad"
                    autoComplete="address-level2"
                    error={errors.city?.message}
                    {...register('city')}
                />

                <div className="sm:col-span-2">
                    <Input
                        label="Dirección"
                        autoComplete="street-address"
                        error={errors.address?.message}
                        {...register('address')}
                    />
                </div>

                <div className="sm:col-span-2">
                    <Select
                        label="Método de entrega"
                        options={DELIVERY_OPTIONS}
                        error={errors.deliveryMethod?.message}
                        {...register('deliveryMethod')}
                    />
                </div>

                <div className="sm:col-span-2">
                    <Textarea
                        label="Notas para el taller"
                        hint="Cuéntanos si hay un color, una fecha o un detalle que debamos cuidar."
                        error={errors.notes?.message}
                        {...register('notes')}
                    />
                </div>
            </fieldset>

            <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                {isSubmitting ? 'Confirmando pedido…' : 'Confirmar pedido'}
            </Button>
        </form>
    )
}
