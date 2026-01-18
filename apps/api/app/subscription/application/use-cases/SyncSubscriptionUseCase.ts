import { inject } from '@adonisjs/core'

import type { SyncSubscriptionInputDTO, SyncSubscriptionOutputDTO } from '../dtos/SyncSubscriptionDTO.js'
import { Role } from '#users/models/role'
import { ISubscriptionRepository } from '#subscription/domain/repositories/ISubscriptionRepository'

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
