import { ValueObject } from '#stories/domain/value-objects/base/value_object'
import { InvalidSubscriptionStateException } from '../exceptions/invalid_subscription_state_exception.js'

export type SubscriptionStatusValue = 'free' | 'premium' | 'expired' | 'cancelled' | 'billing_issue'

const VALID_STATUSES: SubscriptionStatusValue[] = [
  'free',
  'premium',
  'expired',
  'cancelled',
  'billing_issue',
]

export class SubscriptionStatus extends ValueObject<SubscriptionStatusValue> {
  protected readonly value: SubscriptionStatusValue

  private constructor(value: SubscriptionStatusValue) {
    super()
    this.value = value
  }

  static create(value: string): SubscriptionStatus {
    if (!VALID_STATUSES.includes(value as SubscriptionStatusValue)) {
      throw new InvalidSubscriptionStateException(
        `Invalid subscription status: ${value}. Must be one of: ${VALID_STATUSES.join(', ')}`
      )
    }
    return new SubscriptionStatus(value as SubscriptionStatusValue)
  }

  static free(): SubscriptionStatus {
    return new SubscriptionStatus('free')
  }

  static premium(): SubscriptionStatus {
    return new SubscriptionStatus('premium')
  }

  static expired(): SubscriptionStatus {
    return new SubscriptionStatus('expired')
  }

  static cancelled(): SubscriptionStatus {
    return new SubscriptionStatus('cancelled')
  }

  static billingIssue(): SubscriptionStatus {
    return new SubscriptionStatus('billing_issue')
  }

  isPremium(): boolean {
    return this.value === 'premium'
  }

  isFree(): boolean {
    return this.value === 'free'
  }

  isExpired(): boolean {
    return this.value === 'expired'
  }

  isCancelled(): boolean {
    return this.value === 'cancelled'
  }

  hasBillingIssue(): boolean {
    return this.value === 'billing_issue'
  }

  /**
   * Whether the user should have access to premium features.
   * Premium and billing_issue (grace period) both grant access.
   */
  hasAccess(): boolean {
    return this.value === 'premium' || this.value === 'billing_issue'
  }
}
