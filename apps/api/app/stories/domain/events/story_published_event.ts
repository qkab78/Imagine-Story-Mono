import type { DomainEvent } from './domain_event.js'
import type { StoryId } from '../value-objects/ids/story_id.vo.js'
import type { OwnerId } from '../value-objects/ids/owner_id.vo.js'

/**
 * Story Published Event
 *
 * Published when a story is made public.
 * Useful for:
 * - Notification to subscribers
 * - SEO indexing triggers
 * - Social media sharing
 * - Analytics tracking
 */
export class StoryPublishedEvent implements DomainEvent {
  public readonly eventName = 'story.published'

  constructor(
    public readonly aggregateId: string,
    public readonly occurredOn: Date,
    public readonly storyId: StoryId,
    public readonly ownerId: OwnerId,
    public readonly title: string
  ) {}

  /**
   * Create a StoryPublishedEvent
   */
  public static create(storyId: StoryId, ownerId: OwnerId, title: string): StoryPublishedEvent {
    return new StoryPublishedEvent(storyId.getValue(), new Date(), storyId, ownerId, title)
  }
}
