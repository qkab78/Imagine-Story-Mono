import logger from '@adonisjs/core/services/logger'
import env from '#start/env'
import {
  IRevenueCatService,
  type RevenueCatCustomerInfoResult,
} from '#subscription/domain/services/i_revenuecat_service'

export class RevenueCatApiService extends IRevenueCatService {
  private readonly baseUrl = 'https://api.revenuecat.com/v2'

  async getCustomerInfo(appUserId: string): Promise<RevenueCatCustomerInfoResult> {
    const apiKey = env.get('REVENUECAT_API_KEY')
    const projectId = env.get('REVENUECAT_PROJECT_ID')

    logger.debug(
      { appUserId, apiKeyPrefix: apiKey.slice(0, 6) },
      'Fetching RevenueCat customer info'
    )

    const response = await fetch(
      `${this.baseUrl}/projects/${projectId}/customers/${encodeURIComponent(appUserId)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      const errorBody = await response.text()
      logger.error(
        { status: response.status, appUserId, errorBody },
        'RevenueCat API request failed'
      )
      throw new Error(
        `RevenueCat API error: ${response.status} ${response.statusText} — ${errorBody}`
      )
    }

    const data = await response.json()
    return this.mapToResult(appUserId, data)
  }

  private mapToResult(appUserId: string, data: any): RevenueCatCustomerInfoResult {
    const activeEntitlements = data.active_entitlements?.items || []

    const entitlements = activeEntitlements.map((entitlement: any) => ({
      id: entitlement.entitlement_id,
      isActive: true,
      expirationDate: entitlement.expires_at || null,
      willRenew: entitlement.auto_renewal_status === 'will_renew',
      productIdentifier: entitlement.product_identifier,
      purchaseDate: entitlement.purchase_date,
    }))

    return {
      appUserId,
      entitlements,
      managementUrl: null,
      activeSubscriptions: entitlements
        .filter((e: any) => e.isActive)
        .map((e: any) => e.productIdentifier),
      firstSeen: data.first_seen_at,
    }
  }
}
