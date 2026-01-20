import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { StoryId } from '#stories/domain/value-objects/ids/story_id.vo'
import type { Story } from '#stories/domain/entities/story.entity'

/**
 * Get Story By ID Use Case
 *
 * Retrieves a story by its unique identifier (UUID).
 * Returns null if the story doesn't exist.
 */
@inject()
export class GetStoryByIdUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(id: string): Promise<Story | null> {
    // 1. Create StoryId value object with validation
    const storyId = StoryId.create(id)

    // 2. Find story by ID
    const story = await this.storyRepository.findById(storyId)

    if (!story) {
      return null
    }

    // 3. Return story entity (presenter will transform to DTO at controller level)
    return story
  }
}
