import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import type { IDomainEventPublisher } from '#stories/domain/events/IDomainEventPublisher'
import { StoryUnpublishedEvent } from '#stories/domain/events/StoryUnpublishedEvent'
import { StoryNotFoundException } from '#stories/application/exceptions/StoryNotFoundException'

/**
 * Unpublish Story Use Case
 *
 * Makes a public story private.
 * Publishes StoryUnpublishedEvent for notifications, analytics, etc.
 */
@inject()
export class UnpublishStoryUseCase {
  constructor(
    private readonly storyRepository: IStoryRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(storyId: string): Promise<void> {
    // 1. Find story by ID
    const story = await this.storyRepository.findById(storyId)

    if (!story) {
      throw StoryNotFoundException.byId(storyId)
    }

    // 2. Check if already private
    if (story.isPrivate()) {
      return // Already private, nothing to do
    }

    // 3. Unpublish the story (returns new instance)
    const unpublishedStory = story.unpublish()

    // 4. Persist changes
    await this.storyRepository.save(unpublishedStory)

    // 5. Publish domain event
    await this.eventPublisher.publish(
      StoryUnpublishedEvent.create(
        unpublishedStory.id,
        unpublishedStory.ownerId,
        unpublishedStory.title
      )
    )
  }
}
