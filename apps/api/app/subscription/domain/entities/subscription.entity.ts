import { SubscriptionStatus } from '../value-objects/subscription_status.vo.js'
import { ExpirationDate } from '../value-objects/expiration_date.vo.js'
import type { ExpirationWarningLevel } from '../value-objects/expiration_date.vo.js'

export interface SubscriptionProps {
  id: string
  userId: string
  status: SubscriptionStatus
  revenuecatAppUserId: string | null
  productId: string | null
  entitlementId: string | null
  store: string | null
  expirationDate: ExpirationDate
  originalPurchaseDate: Date | null
  willRenew: boolean
  gracePeriodExpiresDate: Date | null
  managementUrl: string | null
  lastVerifiedAt: Date | null
  lastWebhookEventId: string | null
  createdAt: Date
  updatedAt: Date
}

export class Subscription {
  private constructor(private readonly props: SubscriptionProps) {}

  static create(props: SubscriptionProps): Subscription {
    return new Subscription(props)
  }

  static createFree(userId: string): Subscription {
    const now = new Date()
    return new Subscription({
      id: '',
      userId,
      status: SubscriptionStatus.free(),
      revenuecatAppUserId: null,
      productId: null,
      entitlementId: null,
      store: null,
      expirationDate: ExpirationDate.none(),
      originalPurchaseDate: null,
      willRenew: false,
      gracePeriodExpiresDate: null,
      managementUrl: null,
      lastVerifiedAt: null,
      lastWebhookEventId: null,
      createdAt: now,
      updatedAt: now,
    })
  }

  // --- Getters ---

  get id(): string {
    return this.props.id
  }

  get userId(): string {
    return this.props.userId
  }

  get status(): SubscriptionStatus {
    return this.props.status
  }

  get revenuecatAppUserId(): string | null {
    return this.props.revenuecatAppUserId
  }

  get productId(): string | null {
    return this.props.productId
  }

  get entitlementId(): string | null {
    return this.props.entitlementId
  }

  get store(): string | null {
    return this.props.store
  }

  get expirationDate(): ExpirationDate {
    return this.props.expirationDate
  }

  get originalPurchaseDate(): Date | null {
    return this.props.originalPurchaseDate
  }

  get willRenew(): boolean {
    return this.props.willRenew
  }

  get gracePeriodExpiresDate(): Date | null {
    return this.props.gracePeriodExpiresDate
  }

  get managementUrl(): string | null {
    return this.props.managementUrl
  }

  get lastVerifiedAt(): Date | null {
    return this.props.lastVerifiedAt
  }

  get lastWebhookEventId(): string | null {
    return this.props.lastWebhookEventId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  // --- Business Logic ---

  hasAccess(): boolean {
    return this.props.status.hasAccess()
  }

  getDaysRemaining(): number | null {
    return this.props.expirationDate.getDaysRemaining()
  }

  getWarningLevel(): ExpirationWarningLevel {
    return this.props.expirationDate.getWarningLevel(this.props.willRenew)
  }

  isExpired(): boolean {
    return this.props.expirationDate.isExpired()
  }

  applyWebhookEvent(params: {
    status: SubscriptionStatus
    productId?: string | null
    entitlementId?: string | null
    store?: string | null
    expirationDate?: Date | string | null
    willRenew?: boolean
    webhookEventId: string
    revenuecatAppUserId?: string
  }): Subscription {
    return new Subscription({
      ...this.props,
      status: params.status,
      productId: params.productId !== undefined ? params.productId : this.props.productId,
      entitlementId:
        params.entitlementId !== undefined ? params.entitlementId : this.props.entitlementId,
      store: params.store !== undefined ? params.store : this.props.store,
      expirationDate:
        params.expirationDate !== undefined
          ? ExpirationDate.create(params.expirationDate)
          : this.props.expirationDate,
      willRenew: params.willRenew !== undefined ? params.willRenew : this.props.willRenew,
      lastWebhookEventId: params.webhookEventId,
      revenuecatAppUserId: params.revenuecatAppUserId ?? this.props.revenuecatAppUserId,
      updatedAt: new Date(),
    })
  }

  applyVerification(params: {
    status: SubscriptionStatus
    expirationDate: Date | string | null
    willRenew: boolean
    managementUrl: string | null
  }): Subscription {
    return new Subscription({
      ...this.props,
      status: params.status,
      expirationDate: ExpirationDate.create(params.expirationDate),
      willRenew: params.willRenew,
      managementUrl: params.managementUrl,
      lastVerifiedAt: new Date(),
      updatedAt: new Date(),
    })
  }
}
