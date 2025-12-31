import type { DomainEvent } from './DomainEvent.js'

/**
 * Domain Event Publisher interface
 *
 * Responsible for publishing domain events to subscribers.
 * Allows for decoupling between the domain logic and side effects.
 */
export interface IDomainEventPublisher {
  /**
   * Publish a single domain event
   */
  publish(event: DomainEvent): Promise<void>

  /**
   * Publish multiple domain events
   */
  publishMany(events: DomainEvent[]): Promise<void>
}
