import { SubscriptionDomainException } from '#subscription/domain/exceptions/subscription_domain_exception'

export class SubscriptionNotFoundException extends SubscriptionDomainException {
  public readonly statusCode = 404

  constructor(userId: string) {
    super(`Subscription for user "${userId}" not found`, 'SUBSCRIPTION_NOT_FOUND')
    this.name = 'SubscriptionNotFoundException'
  }
}
