import type { DomainEvent } from './domain_event.js'
import type { StoryId } from '../value-objects/ids/story_id.vo.js'
import type { OwnerId } from '../value-objects/ids/owner_id.vo.js'

/**
 * Story Unpublished Event
 *
 * Published when a story is made private.
 * Useful for:
 * - SEO de-indexing
 * - Access control updates
 * - Analytics tracking
 * - Notification to subscribers
 */
export class StoryUnpublishedEvent implements DomainEvent {
  public readonly eventName = 'story.unpublished'

  constructor(
    public readonly aggregateId: string,
    public readonly occurredOn: Date,
    public readonly storyId: StoryId,
    public readonly ownerId: OwnerId,
    public readonly title: string
  ) {}

  /**
   * Create a StoryUnpublishedEvent
   */
  public static create(storyId: StoryId, ownerId: OwnerId, title: string): StoryUnpublishedEvent {
    return new StoryUnpublishedEvent(storyId.getValue(), new Date(), storyId, ownerId, title)
  }
}
