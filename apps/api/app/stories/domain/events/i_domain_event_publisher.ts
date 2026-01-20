import type { DomainEvent } from './domain_event.js'

/**
 * Domain Event Publisher
 *
 * Responsible for publishing domain events to subscribers.
 * Allows for decoupling between the domain logic and side effects.
 */
export abstract class IDomainEventPublisher {
  /**
   * Publish a single domain event
   */
  abstract publish(event: DomainEvent): Promise<void>

  /**
   * Publish multiple domain events
   */
  abstract publishMany(events: DomainEvent[]): Promise<void>
}
