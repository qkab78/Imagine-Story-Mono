import { inject } from '@adonisjs/core'
import { ISubscriptionRepository } from '#subscription/domain/repositories/i_subscription_repository'
import { SubscriptionPresenter } from '#subscription/application/presenters/subscription_presenter'
import type { SubscriptionStatusDTO } from '#subscription/application/dtos/subscription_status_d_t_o'

@inject()
export class GetSubscriptionStatusUseCase {
  constructor(private readonly subscriptionRepository: ISubscriptionRepository) {}

  async execute(userId: string): Promise<SubscriptionStatusDTO> {
    const subscription = await this.subscriptionRepository.findByUserId(userId)

    if (!subscription) {
      return SubscriptionPresenter.freeDTO()
    }

    return SubscriptionPresenter.toDTO(subscription)
  }
}
