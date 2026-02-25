import { Subscription } from '#subscription/domain/entities/subscription.entity'
import { SubscriptionStatus } from '#subscription/domain/value-objects/subscription_status.vo'
import { ExpirationDate } from '#subscription/domain/value-objects/expiration_date.vo'

export interface SubscriptionRow {
  id: string
  user_id: string
  status: string
  revenuecat_app_user_id: string | null
  product_id: string | null
  entitlement_id: string | null
  store: string | null
  expiration_date: Date | string | null
  original_purchase_date: Date | string | null
  will_renew: boolean
  grace_period_expires_date: Date | string | null
  management_url: string | null
  last_verified_at: Date | string | null
  last_webhook_event_id: string | null
  created_at: Date | string
  updated_at: Date | string
}

export class SubscriptionMapper {
  static toDomain(row: SubscriptionRow): Subscription {
    return Subscription.create({
      id: row.id,
      userId: row.user_id,
      status: SubscriptionStatus.create(row.status),
      revenuecatAppUserId: row.revenuecat_app_user_id,
      productId: row.product_id,
      entitlementId: row.entitlement_id,
      store: row.store,
      expirationDate: ExpirationDate.create(
        row.expiration_date ? new Date(row.expiration_date) : null
      ),
      originalPurchaseDate: row.original_purchase_date
        ? new Date(row.original_purchase_date)
        : null,
      willRenew: row.will_renew,
      gracePeriodExpiresDate: row.grace_period_expires_date
        ? new Date(row.grace_period_expires_date)
        : null,
      managementUrl: row.management_url,
      lastVerifiedAt: row.last_verified_at ? new Date(row.last_verified_at) : null,
      lastWebhookEventId: row.last_webhook_event_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    })
  }

  static toPersistence(subscription: Subscription): Record<string, any> {
    return {
      user_id: subscription.userId,
      status: subscription.status.getValue(),
      revenuecat_app_user_id: subscription.revenuecatAppUserId,
      product_id: subscription.productId,
      entitlement_id: subscription.entitlementId,
      store: subscription.store,
      expiration_date: subscription.expirationDate.getValue(),
      original_purchase_date: subscription.originalPurchaseDate,
      will_renew: subscription.willRenew,
      grace_period_expires_date: subscription.gracePeriodExpiresDate,
      management_url: subscription.managementUrl,
      last_verified_at: subscription.lastVerifiedAt,
      last_webhook_event_id: subscription.lastWebhookEventId,
      created_at: subscription.createdAt,
      updated_at: new Date(),
    }
  }
}
