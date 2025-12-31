import type { DomainEvent } from '#stories/domain/events/DomainEvent'
import type { IDomainEventPublisher } from '#stories/domain/events/IDomainEventPublisher'

/**
 * In-Memory Event Publisher
 *
 * Simple implementation of domain event publisher using in-memory handlers.
 * Useful for:
 * - Development and testing
 * - Simple applications without message broker
 * - Synchronous event handling
 *
 * For production, consider using:
 * - RabbitMQ
 * - Redis Pub/Sub
 * - AWS EventBridge
 * - Google Cloud Pub/Sub
 */
export class InMemoryEventPublisher implements IDomainEventPublisher {
  private handlers: Map<string, Array<(event: DomainEvent) => Promise<void>>> = new Map()

  /**
   * Publish a single domain event
   */
  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) || []

    // Execute all handlers in parallel
    await Promise.all(handlers.map((handler) => handler(event)))
  }

  /**
   * Publish multiple domain events
   */
  async publishMany(events: DomainEvent[]): Promise<void> {
    await Promise.all(events.map((event) => this.publish(event)))
  }

  /**
   * Subscribe to a specific event type
   *
   * @param eventName The name of the event to listen for
   * @param handler The handler function to execute when the event is published
   */
  subscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void {
    const handlers = this.handlers.get(eventName) || []
    handlers.push(handler)
    this.handlers.set(eventName, handlers)
  }

  /**
   * Unsubscribe from a specific event type
   *
   * @param eventName The name of the event to stop listening for
   * @param handler The handler function to remove
   */
  unsubscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void {
    const handlers = this.handlers.get(eventName) || []
    const index = handlers.indexOf(handler)

    if (index > -1) {
      handlers.splice(index, 1)
      this.handlers.set(eventName, handlers)
    }
  }

  /**
   * Clear all subscriptions
   */
  clearAllSubscriptions(): void {
    this.handlers.clear()
  }

  /**
   * Get the number of handlers for a specific event
   */
  getHandlerCount(eventName: string): number {
    return (this.handlers.get(eventName) || []).length
  }
}
