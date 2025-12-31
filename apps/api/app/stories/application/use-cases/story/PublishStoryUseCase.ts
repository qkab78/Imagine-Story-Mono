import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import type { IDomainEventPublisher } from '#stories/domain/events/IDomainEventPublisher'
import { StoryPublishedEvent } from '#stories/domain/events/StoryPublishedEvent'

/**
 * Publish Story Use Case
 *
 * Makes a private story public.
 * Publishes StoryPublishedEvent for notifications, SEO indexing, etc.
 */
@inject()
export class PublishStoryUseCase {
  constructor(
    private readonly storyRepository: IStoryRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(storyId: string): Promise<void> {
    // 1. Find story by ID
    const story = await this.storyRepository.findById(storyId)

    if (!story) {
      throw new Error(`Story with ID ${storyId} not found`)
    }

    // 2. Check if already public
    if (story.isPublic()) {
      return // Already public, nothing to do
    }

    // 3. Publish the story (returns new instance)
    const publishedStory = story.publish()

    // 4. Persist changes
    await this.storyRepository.save(publishedStory)

    // 5. Publish domain event
    await this.eventPublisher.publish(
      StoryPublishedEvent.create(publishedStory.id, publishedStory.ownerId, publishedStory.title)
    )
  }
}
