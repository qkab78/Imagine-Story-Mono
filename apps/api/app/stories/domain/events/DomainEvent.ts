/**
 * Base interface for all domain events
 *
 * Domain events represent something that happened in the domain that domain experts care about.
 * Events are immutable and represent facts that happened in the past.
 */
export interface DomainEvent {
  /**
   * When the event occurred
   */
  readonly occurredOn: Date

  /**
   * The ID of the aggregate that generated the event
   */
  readonly aggregateId: string

  /**
   * The name of the event (e.g., 'story.created', 'story.published')
   */
  readonly eventName: string
}
