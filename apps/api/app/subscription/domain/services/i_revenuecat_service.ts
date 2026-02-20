export interface RevenueCatEntitlementInfo {
  id: string
  isActive: boolean
  expirationDate: string | null
  willRenew: boolean
  productIdentifier: string
  purchaseDate: string
}

export interface RevenueCatCustomerInfoResult {
  appUserId: string
  entitlements: RevenueCatEntitlementInfo[]
  managementUrl: string | null
  activeSubscriptions: string[]
  firstSeen: string
}

export abstract class IRevenueCatService {
  abstract getCustomerInfo(appUserId: string): Promise<RevenueCatCustomerInfoResult>
}
