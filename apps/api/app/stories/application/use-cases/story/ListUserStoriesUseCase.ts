import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import { OwnerId } from '#stories/domain/value-objects/ids/OwnerId.vo'
import type { Story } from '#stories/domain/entities/story.entity'

/**
 * List User Stories Use Case
 *
 * Retrieves all stories owned by a specific user with pagination.
 * Includes both public and private stories.
 */
@inject()
export class ListUserStoriesUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(params: { ownerId: string; page?: number; limit?: number }): Promise<{
    stories: Story[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    // 1. Create OwnerId value object
    const ownerIdVO = OwnerId.create(params.ownerId)

    // 2. Setup pagination
    const page = params.page || 1
    const limit = params.limit || 10

    // 3. Fetch stories with pagination
    const result = await this.storyRepository.findByOwnerId(ownerIdVO, {
      page,
      limit,
    })

    // 4. Return paginated result
    return {
      stories: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    }
  }
}
