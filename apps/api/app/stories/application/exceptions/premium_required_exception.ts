import { ApplicationException } from './application_exception.js'

/**
 * Premium Required Exception
 *
 * Thrown when a non-premium user attempts to access a premium-only feature.
 */
export class PremiumRequiredException extends ApplicationException {
  constructor(feature: string = 'this feature') {
    super(
      `Premium subscription required to access ${feature}`,
      'PREMIUM_REQUIRED',
      403
    )
    this.name = 'PremiumRequiredException'
  }
}
