import { SubscriptionDomainException } from './subscription_domain_exception.js'

export class InvalidSubscriptionStateException extends SubscriptionDomainException {
  constructor(message: string) {
    super(message, 'INVALID_SUBSCRIPTION_STATE')
    this.name = 'InvalidSubscriptionStateException'
  }
}
