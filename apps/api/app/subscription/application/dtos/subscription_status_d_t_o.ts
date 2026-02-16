import type { ExpirationWarningLevel } from '#subscription/domain/value-objects/expiration_date.vo'

export interface SubscriptionStatusDTO {
  status: 'free' | 'premium' | 'expired' | 'cancelled' | 'billing_issue'
  isSubscribed: boolean
  hasAccess: boolean
  expirationDate: string | null
  daysUntilExpiration: number | null
  expirationWarningLevel: ExpirationWarningLevel
  willRenew: boolean
  productId: string | null
  store: string | null
  managementUrl: string | null
}
