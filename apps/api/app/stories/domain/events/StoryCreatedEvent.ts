import type { DomainEvent } from './DomainEvent.js'
import type { StoryId } from '../value-objects/ids/StoryId.vo.js'
import type { OwnerId } from '../value-objects/ids/OwnerId.vo.js'
import type { Slug } from '../value-objects/metadata/Slug.vo.js'

/**
 * Story Created Event
 *
 * Published when a new story is successfully created.
 * Useful for:
 * - Analytics tracking
 * - Notification systems
 * - Event sourcing
 * - Audit logs
 */
export class StoryCreatedEvent implements DomainEvent {
  public readonly eventName = 'story.created'

  constructor(
    public readonly aggregateId: string,
    public readonly occurredOn: Date,
    public readonly storyId: StoryId,
    public readonly ownerId: OwnerId,
    public readonly slug: Slug,
    public readonly title: string
  ) {}

  /**
   * Create a StoryCreatedEvent from Story data
   */
  public static create(
    storyId: StoryId,
    ownerId: OwnerId,
    slug: Slug,
    title: string
  ): StoryCreatedEvent {
    return new StoryCreatedEvent(storyId.getValue(), new Date(), storyId, ownerId, slug, title)
  }
}
