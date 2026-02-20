export class SubscriptionDomainException extends Error {
  public readonly code: string

  constructor(message: string, code: string = 'SUBSCRIPTION_DOMAIN_ERROR') {
    super(message)
    this.name = 'SubscriptionDomainException'
    this.code = code
    Error.captureStackTrace(this, this.constructor)
  }
}
