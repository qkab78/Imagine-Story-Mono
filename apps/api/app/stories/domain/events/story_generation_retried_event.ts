import type { DomainEvent } from './domain_event.js'
import type { StoryId } from '../value-objects/ids/story_id.vo.js'
import type { OwnerId } from '../value-objects/ids/owner_id.vo.js'

/**
 * Story Generation Retried Event
 *
 * Published when a failed story generation is retried.
 * Useful for:
 * - Analytics tracking (retry rate)
 * - Notification systems
 * - Audit logs
 */
export class StoryGenerationRetriedEvent implements DomainEvent {
  public readonly eventName = 'story.generation.retried'

  constructor(
    public readonly aggregateId: string,
    public readonly occurredOn: Date,
    public readonly storyId: StoryId,
    public readonly ownerId: OwnerId,
    public readonly jobId: string
  ) {}

  /**
   * Create a StoryGenerationRetriedEvent from Story data
   */
  public static create(
    storyId: StoryId,
    ownerId: OwnerId,
    jobId: string
  ): StoryGenerationRetriedEvent {
    return new StoryGenerationRetriedEvent(
      storyId.getValue(),
      new Date(),
      storyId,
      ownerId,
      jobId
    )
  }
}
