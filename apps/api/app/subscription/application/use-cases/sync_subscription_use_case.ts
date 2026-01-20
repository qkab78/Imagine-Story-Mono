import { inject } from '@adonisjs/core'

import type {
  SyncSubscriptionInputDTO,
  SyncSubscriptionOutputDTO,
} from '../dtos/sync_subscription_d_t_o.js'
import { Role } from '#users/models/role'
import { ISubscriptionRepository } from '#subscription/domain/repositories/i_subscription_repository'

@inject()
export class SyncSubscriptionUseCase {
  constructor(private readonly subscriptionRepository: ISubscriptionRepository) {}

  async execute(input: SyncSubscriptionInputDTO): Promise<SyncSubscriptionOutputDTO> {
    const newRole = input.isPremium ? Role.PREMIUM : Role.CUSTOMER

    await this.subscriptionRepository.updateUserRole(input.userId, newRole)

    return {
      success: true,
      user: {
        id: input.userId,
        role: newRole,
      },
    }
  }
}
