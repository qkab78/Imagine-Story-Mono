import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import type { IDomainEventPublisher } from '#stories/domain/events/i_domain_event_publisher'
import { StoryDeletedEvent } from '#stories/domain/events/story_deleted_event'
import { StoryId } from '#stories/domain/value-objects/ids/story_id.vo'
import { StoryNotFoundException } from '#stories/application/exceptions/story_not_found_exception'

/**
 * Delete Story Use Case
 *
 * Deletes a story and publishes StoryDeletedEvent.
 * The repository implementation determines if it's soft or hard delete.
 */
@inject()
export class DeleteStoryUseCase {
  constructor(
    private readonly storyRepository: IStoryRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(storyId: string, userId: string): Promise<void> {
    // 1. Find story by ID to ensure it exists and get data for event
    const story = await this.storyRepository.findById(storyId)

    if (!story) {
      throw StoryNotFoundException.byId(storyId)
    }

    // 2. Verify the user is the owner of the story
    if (story.ownerId.getValue() !== userId) {
      throw new Error('You are not authorized to delete this story')
    }

    // 3. Delete the story
    await this.storyRepository.delete(StoryId.create(storyId))

    // 3. Publish domain event
    await this.eventPublisher.publish(
      StoryDeletedEvent.create(story.id, story.ownerId, story.title)
    )
  }
}
