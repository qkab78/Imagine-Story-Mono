import type { Subscription } from '#subscription/domain/entities/subscription.entity'
import type { SubscriptionStatusDTO } from '#subscription/application/dtos/subscription_status_d_t_o'
import type { SubscriptionStatusValue } from '#subscription/domain/value-objects/subscription_status.vo'

export class SubscriptionPresenter {
  static toDTO(subscription: Subscription): SubscriptionStatusDTO {
    const status = subscription.status.getValue() as SubscriptionStatusValue

    return {
      status,
      isSubscribed: subscription.status.isPremium(),
      hasAccess: subscription.hasAccess(),
      expirationDate: subscription.expirationDate.getValue()?.toISOString() ?? null,
      daysUntilExpiration: subscription.getDaysRemaining(),
      expirationWarningLevel: subscription.getWarningLevel(),
      willRenew: subscription.willRenew,
      productId: subscription.productId,
      store: subscription.store,
      managementUrl: subscription.managementUrl,
    }
  }

  static freeDTO(): SubscriptionStatusDTO {
    return {
      status: 'free',
      isSubscribed: false,
      hasAccess: false,
      expirationDate: null,
      daysUntilExpiration: null,
      expirationWarningLevel: 'none',
      willRenew: false,
      productId: null,
      store: null,
      managementUrl: null,
    }
  }
}
