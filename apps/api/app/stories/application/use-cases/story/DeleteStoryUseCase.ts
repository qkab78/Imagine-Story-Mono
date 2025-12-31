import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import type { IDomainEventPublisher } from '#stories/domain/events/IDomainEventPublisher'
import { StoryDeletedEvent } from '#stories/domain/events/StoryDeletedEvent'
import { StoryId } from '#stories/domain/value-objects/ids/StoryId.vo'
import { StoryNotFoundException } from '#stories/application/exceptions/StoryNotFoundException'

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

  async execute(storyId: string): Promise<void> {
    // 1. Find story by ID to ensure it exists and get data for event
    const story = await this.storyRepository.findById(storyId)

    if (!story) {
      throw StoryNotFoundException.byId(storyId)
    }

    // 2. Delete the story
    await this.storyRepository.delete(StoryId.create(storyId))

    // 3. Publish domain event
    await this.eventPublisher.publish(
      StoryDeletedEvent.create(story.id, story.ownerId, story.title)
    )
  }
}
