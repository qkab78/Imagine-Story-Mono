import env from '#start/env'
import {
  IRevenueCatService,
  type RevenueCatCustomerInfoResult,
} from '#subscription/domain/services/i_revenuecat_service'

export class RevenueCatApiService extends IRevenueCatService {
  private readonly baseUrl = 'https://api.revenuecat.com/v1'

  async getCustomerInfo(appUserId: string): Promise<RevenueCatCustomerInfoResult> {
    const apiKey = env.get('REVENUECAT_API_KEY')

    const response = await fetch(
      `${this.baseUrl}/subscribers/${encodeURIComponent(appUserId)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `RevenueCat API error: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return this.mapToResult(appUserId, data)
  }

  private mapToResult(appUserId: string, data: any): RevenueCatCustomerInfoResult {
    const subscriber = data.subscriber

    const entitlements = Object.entries(subscriber.entitlements || {}).map(
      ([id, entitlement]: [string, any]) => ({
        id,
        isActive: entitlement.expires_date
          ? new Date(entitlement.expires_date) > new Date()
          : true,
        expirationDate: entitlement.expires_date || null,
        willRenew: !entitlement.unsubscribe_detected_at,
        productIdentifier: entitlement.product_identifier,
        purchaseDate: entitlement.purchase_date,
      })
    )

    return {
      appUserId,
      entitlements,
      managementUrl: subscriber.management_url || null,
      activeSubscriptions: subscriber.subscriptions
        ? Object.keys(subscriber.subscriptions)
        : [],
      firstSeen: subscriber.first_seen,
    }
  }
}
