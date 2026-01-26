/**
 * RevenueCat Webhook Event Types
 * 
 * Based on RevenueCat webhook documentation:
 * https://www.revenuecat.com/docs/integrations/webhooks
 */

export const RevenueCatEventType = {
  INITIAL_PURCHASE: 'INITIAL_PURCHASE',
  RENEWAL: 'RENEWAL',
  CANCELLATION: 'CANCELLATION',
  EXPIRATION: 'EXPIRATION',
  BILLING_ISSUE: 'BILLING_ISSUE',
  PRODUCT_CHANGE: 'PRODUCT_CHANGE',
  NON_RENEWING_PURCHASE: 'NON_RENEWING_PURCHASE',
  SUBSCRIPTION_PAUSED: 'SUBSCRIPTION_PAUSED',
  TRANSFER: 'TRANSFER',
  TEST: 'TEST',
} as const

export type RevenueCatEventType =
  (typeof RevenueCatEventType)[keyof typeof RevenueCatEventType]

export type RevenueCatEnvironment = 'PRODUCTION' | 'SANDBOX'

export interface RevenueCatCustomerInfo {
  app_user_id: string
  original_app_user_id: string
}

export interface RevenueCatEntitlement {
  expires_date: string | null
  grace_period_expires_date: string | null
  product_identifier: string
  purchase_date: string
}

export interface RevenueCatSubscription {
  expires_date: string
  is_sandbox: boolean
  original_purchase_date: string
  period_type: string
  product_id: string
  purchase_date: string
  store: string
  unsubscribe_detected_at: string | null
}

export interface RevenueCatEvent {
  app_id: string
  app_user_id: string
  original_app_user_id: string
  environment: RevenueCatEnvironment
  event_timestamp_ms: number
  id: string
  type: RevenueCatEventType
  
  // RevenueCat real payload fields
  entitlement_id?: string | null
  entitlement_ids?: string[]
  product_id?: string
  period_type?: string
  purchased_at_ms?: number
  expiration_at_ms?: number
  presented_offering_id?: string | null
  transaction_id?: string
  original_transaction_id?: string
  aliases?: string[]
  currency?: string
  price?: number
  price_in_purchased_currency?: number
  store?: string
  takehome_percentage?: number
  offer_code?: string | null
  tax_percentage?: number
  commission_percentage?: number
  metadata?: any | null
  renewal_number?: number
  country_code?: string | null
  is_family_share?: boolean
  subscriber_attributes?: Record<string, any>
}

export interface RevenueCatWebhookPayload {
  api_version: string
  event: RevenueCatEvent
}

/**
 * Internal types for processing
 */
export interface ProcessedWebhookResult {
  success: boolean
  message: string
  userId?: string
  newRole?: number
  eventId: string
  processed: boolean
}