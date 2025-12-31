import type { DomainEvent } from './DomainEvent.js'
import type { StoryId } from '../value-objects/ids/StoryId.vo.js'
import type { OwnerId } from '../value-objects/ids/OwnerId.vo.js'

/**
 * Story Deleted Event
 *
 * Published when a story is deleted (soft or hard delete).
 * Useful for:
 * - Cleanup operations
 * - Analytics tracking
 * - Audit logs
 * - Cascade deletions
 */
export class StoryDeletedEvent implements DomainEvent {
  public readonly eventName = 'story.deleted'

  constructor(
    public readonly aggregateId: string,
    public readonly occurredOn: Date,
    public readonly storyId: StoryId,
    public readonly ownerId: OwnerId,
    public readonly title: string
  ) {}

  /**
   * Create a StoryDeletedEvent
   */
  public static create(storyId: StoryId, ownerId: OwnerId, title: string): StoryDeletedEvent {
    return new StoryDeletedEvent(storyId.getValue(), new Date(), storyId, ownerId, title)
  }
}
