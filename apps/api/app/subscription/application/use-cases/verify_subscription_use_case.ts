import { inject } from '@adonisjs/core'
import { ISubscriptionRepository } from '#subscription/domain/repositories/i_subscription_repository'
import { IRevenueCatService } from '#subscription/domain/services/i_revenuecat_service'
import { SubscriptionPresenter } from '#subscription/application/presenters/subscription_presenter'
import { Subscription } from '#subscription/domain/entities/subscription.entity'
import { SubscriptionStatus } from '#subscription/domain/value-objects/subscription_status.vo'
import { Role } from '#users/models/role'
import type { SubscriptionStatusDTO } from '#subscription/application/dtos/subscription_status_d_t_o'

export interface VerifySubscriptionInputDTO {
  userId: string
  revenuecatAppUserId: string
}

@inject()
export class VerifySubscriptionUseCase {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly revenueCatService: IRevenueCatService
  ) {}

  async execute(input: VerifySubscriptionInputDTO): Promise<SubscriptionStatusDTO> {
    console.log(
      `[VerifySubscriptionUseCase] Verifying subscription for user ${input.userId} (RC: ${input.revenuecatAppUserId})`
    )

    // 1. Call RevenueCat REST API
    const customerInfo = await this.revenueCatService.getCustomerInfo(input.revenuecatAppUserId)

    // 2. Determine status from entitlements
    const activeEntitlement = customerInfo.entitlements.find((e) => e.isActive)
    let status: SubscriptionStatus

    if (activeEntitlement) {
      status = SubscriptionStatus.premium()
    } else {
      const anyEntitlement = customerInfo.entitlements[0]
      if (
        anyEntitlement?.expirationDate &&
        new Date(anyEntitlement.expirationDate) < new Date()
      ) {
        status = SubscriptionStatus.expired()
      } else {
        status = SubscriptionStatus.free()
      }
    }

    // 3. Get or create subscription record
    let subscription = await this.subscriptionRepository.findByUserId(input.userId)
    if (!subscription) {
      subscription = Subscription.createFree(input.userId)
    }

    // 4. Apply verification data
    subscription = subscription.applyVerification({
      status,
      expirationDate: activeEntitlement?.expirationDate ?? null,
      willRenew: activeEntitlement?.willRenew ?? false,
      managementUrl: customerInfo.managementUrl,
    })

    // 5. Persist
    await this.subscriptionRepository.upsert(subscription)

    // 6. Also update user role for backward compat
    const newRole = subscription.hasAccess() ? Role.PREMIUM : Role.CUSTOMER
    await this.subscriptionRepository.updateUserRole(input.revenuecatAppUserId, newRole)

    console.log(
      `[VerifySubscriptionUseCase] Verification complete. Status: ${status.getValue()}, Role: ${newRole}`
    )

    return SubscriptionPresenter.toDTO(subscription)
  }
}
