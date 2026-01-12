import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import type { Story } from '#stories/domain/entities/story.entity'

/**
 * Get Latest Public Stories Use Case
 *
 * Retrieves the most recently created public stories.
 * Used for displaying latest/newest stories on the home page or discovery section.
 */
@inject()
export class GetLatestPublicStoriesUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(params: {
    limit?: number
  }): Promise<{
    stories: Story[]
  }> {
    // 1. Setup limit (default to 5 latest stories)
    const limit = params.limit || 5

    // 2. Fetch latest public stories (sorted by creation date desc)
    const result = await this.storyRepository.findPublicStories(
      {}, // No filters
      {
        page: 1,
        limit,
      }
    )

    // 3. Return stories (most recent first)
    return {
      stories: result.data,
    }
  }
}
