import type {
    AdminBank,
    AdminOrderStatusCatalog,
    Bank,
    BankCreateInput,
    BankInput,
    OrderStatusCatalog,
    OrderStatusGroupInput,
    OrderStatusInput,
} from '@/@types/catalog'
import { apiClient } from '@/services/ApiClient'

const ADMIN = '/admin/catalogs'

function codePath(base: string, code: string): string {
    return `${base}/${encodeURIComponent(code)}`
}

/** Business catalogs kept in the database: order statuses (labels, tabs) and banks. */
export const CatalogService = {
    getOrderStatuses: (signal?: AbortSignal) =>
        apiClient.get<OrderStatusCatalog>('/catalogs/order-statuses', { signal }),
    /** Active banks only, in select order. */
    getBanks: (signal?: AbortSignal) => apiClient.get<Bank[]>('/catalogs/banks', { signal }),

    /** ADMIN only: the catalog with the WhatsApp templates. */
    getAdminOrderStatuses: () => apiClient.get<AdminOrderStatusCatalog>(`${ADMIN}/order-statuses`),
    /** ADMIN only. Each edit returns the whole (admin) catalog as saved. */
    updateOrderStatus: (code: string, input: OrderStatusInput) =>
        apiClient.patch<AdminOrderStatusCatalog>(codePath(`${ADMIN}/order-statuses`, code), input),
    updateOrderStatusGroup: (code: string, input: OrderStatusGroupInput) =>
        apiClient.patch<AdminOrderStatusCatalog>(
            codePath(`${ADMIN}/order-statuses/groups`, code),
            input,
        ),

    /** Every bank, inactive ones included, with what references it. */
    getAdminBanks: () => apiClient.get<AdminBank[]>(`${ADMIN}/banks`),
    createBank: (input: BankCreateInput) => apiClient.post<AdminBank>(`${ADMIN}/banks`, input),
    updateBank: (code: string, input: BankInput) =>
        apiClient.patch<AdminBank>(codePath(`${ADMIN}/banks`, code), input),
    /** `codes` must list every bank exactly once; returns the list in its new order. */
    reorderBanks: (codes: string[]) =>
        apiClient.patch<AdminBank[]>(`${ADMIN}/banks/order`, { codes }),
    /** Rejected with 409 while a payment or the Pago Móvil details use the bank. */
    deleteBank: (code: string) => apiClient.delete(codePath(`${ADMIN}/banks`, code)),
} as const
