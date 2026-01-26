import vine from '@vinejs/vine'

/**
 * RevenueCat Webhook Validator
 * 
 * Validates incoming RevenueCat webhook payloads according to their schema.
 * Based on RevenueCat webhook documentation.
 */
export const revenuecatWebhookValidator = vine.compile(
  vine.object({
    api_version: vine.string().trim(),
    event: vine.object({
      id: vine.string().trim().minLength(1),
      type: vine.enum([
        'INITIAL_PURCHASE',
        'RENEWAL', 
        'CANCELLATION',
        'EXPIRATION',
        'BILLING_ISSUE',
        'PRODUCT_CHANGE',
        'NON_RENEWING_PURCHASE',
        'SUBSCRIPTION_PAUSED',
        'TRANSFER',
        'TEST',
      ]),
      event_timestamp_ms: vine.number().positive(),
      app_id: vine.string().trim(),
      app_user_id: vine.string().trim().minLength(1),
      original_app_user_id: vine.string().trim(),
      environment: vine.enum(['PRODUCTION', 'SANDBOX']),
      
      // RevenueCat real payload structure
      entitlement_id: vine.string().trim().nullable().optional(),
      entitlement_ids: vine.array(vine.string().trim()).optional(),
      product_id: vine.string().trim().optional(),
      period_type: vine.string().trim().optional(),
      purchased_at_ms: vine.number().positive().optional(),
      expiration_at_ms: vine.number().positive().optional(),
      presented_offering_id: vine.string().trim().nullable().optional(),
      transaction_id: vine.string().trim().optional(),
      original_transaction_id: vine.string().trim().optional(),
      aliases: vine.array(vine.string().trim()).optional(),
      currency: vine.string().trim().optional(),
      price: vine.number().optional(),
      price_in_purchased_currency: vine.number().optional(),
      store: vine.string().trim().optional(),
      takehome_percentage: vine.number().optional(),
      offer_code: vine.string().trim().nullable().optional(),
      tax_percentage: vine.number().optional(),
      commission_percentage: vine.number().optional(),
      metadata: vine.any().nullable().optional(),
      renewal_number: vine.number().optional(),

      subscriber_attributes: vine.record(vine.any()).optional(),
    }),
  })
)