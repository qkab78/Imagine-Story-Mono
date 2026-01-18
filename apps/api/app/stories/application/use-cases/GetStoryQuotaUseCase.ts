import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import { OwnerId } from '#stories/domain/value-objects/ids/OwnerId.vo'
import { Role } from '#users/models/role'
import env from '#start/env'

/**
 * Story Quota DTO
 *
 * Represents the current quota status for a user
 */
export interface StoryQuotaDTO {
  storiesCreatedThisMonth: number
  limit: number | null // null = unlimited
  remaining: number | null // null = unlimited
  resetDate: Date | null // null = no reset (unlimited)
  isUnlimited: boolean
  canCreate: boolean
}

export interface GetStoryQuotaPayload {
  userId: string
  userRole: number
}

/**
 * Get Story Quota Use Case
 *
 * Returns the current story creation quota for a user.
 * Premium users have unlimited quota, free users are limited by monthly count.
 */
@inject()
export class GetStoryQuotaUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(payload: GetStoryQuotaPayload): Promise<StoryQuotaDTO> {
    // Premium and Admin users have unlimited quota
    const storiesCreatedThisMonth = await this.getCurrentMonthCount(payload.userId)

    if (payload.userRole >= Role.PREMIUM) {
      return {
        storiesCreatedThisMonth,
        limit: null,
        remaining: null,
        resetDate: null,
        isUnlimited: true,
        canCreate: true,
      }
    }

    // Free users (CUSTOMER role) have limited quota
    const limit = env.get('FREE_USER_MONTHLY_STORY_LIMIT', 3)
    const remaining = Math.max(0, limit - storiesCreatedThisMonth)
    const resetDate = this.getNextMonthFirstDay()

    return {
      storiesCreatedThisMonth,
      limit,
      remaining,
      resetDate,
      isUnlimited: false,
      canCreate: storiesCreatedThisMonth < limit,
    }
  }

  /**
   * Get the count of stories created by the user in the current month
   */
  private async getCurrentMonthCount(userId: string): Promise<number> {
    const now = new Date()
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    const startOfNextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))

    return this.storyRepository.countByOwnerIdAndDateRange(
      OwnerId.create(userId),
      startOfMonth,
      startOfNextMonth
    )
  }

  /**
   * Get the first day of next month (when quota resets)
   */
  private getNextMonthFirstDay(): Date {
    const now = new Date()
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
  }
}
