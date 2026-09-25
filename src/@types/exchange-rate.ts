/** Mirrors backend-cups/src/exchange-rate/exchange-rate.service.ts. */
export type RateSource = 'bcv' | 'dolarapi' | 'manual'

/** `GET /exchange-rate/current`: the rate the checkout would use right now. */
export type PublicCurrentRate =
    | {
          available: true
          /** Bolívares per US dollar (4 decimals). */
          rate: number
          source: RateSource
          sourceLabel: string
          /** BCV "fecha valor", "YYYY-MM-DD". */
          effectiveDate: string
          fetchedAt: string
          isManual: boolean
          usableUntil: string
          isStale: false
      }
    | { available: false; reason: 'missing' | 'stale'; message: string }

export interface ExchangeRateEntry {
    id: string
    rate: number
    source: RateSource
    sourceLabel: string
    effectiveDate: string
    fetchedAt: string
    isManual: boolean
    createdBy: { id: string; name: string } | null
}

export interface CurrentExchangeRate extends ExchangeRateEntry {
    usableUntil: string
    isStale: boolean
}

export interface RateSyncAttempt {
    source: Exclude<RateSource, 'manual'>
    ok: boolean
    rate?: number
    effectiveDate?: string
    error?: string
}

export interface RateSyncResult {
    at: string
    outcome: 'stored' | 'unchanged' | 'failed'
    attempts: RateSyncAttempt[]
}

/** `GET /admin/exchange-rate`. */
export interface AdminExchangeRate {
    current: CurrentExchangeRate | null
    history: ExchangeRateEntry[]
    lastSync: RateSyncResult | null
    maxAgeHours: number
    syncIntervalMinutes: number
}
