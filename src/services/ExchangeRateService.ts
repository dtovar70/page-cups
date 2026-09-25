import type { AdminExchangeRate, PublicCurrentRate, RateSyncResult } from '@/@types/exchange-rate'
import { apiClient } from '@/services/ApiClient'

const ADMIN = '/admin/exchange-rate'

/** BCV bolívar/dollar rate: public current value, admin history, manual rate and refresh. */
export const ExchangeRateService = {
    getCurrent: (signal?: AbortSignal) =>
        apiClient.get<PublicCurrentRate>('/exchange-rate/current', { signal }),

    getAdmin: () => apiClient.get<AdminExchangeRate>(ADMIN),
    /** ADMIN only. Used until the BCV publishes a different rate. */
    setManual: (rate: number, effectiveDate?: string) =>
        apiClient.post<AdminExchangeRate>(`${ADMIN}/manual`, { rate, effectiveDate }),
    refresh: () => apiClient.post<AdminExchangeRate & { sync: RateSyncResult }>(`${ADMIN}/refresh`),
} as const
