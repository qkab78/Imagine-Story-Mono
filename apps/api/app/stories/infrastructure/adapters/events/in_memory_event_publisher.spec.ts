import { test } from '@japa/runner'
import { InMemoryEventPublisher } from './in_memory_event_publisher.js'
import { StoryCreatedEvent } from '#stories/domain/events/story_created_event'
import { StoryPublishedEvent } from '#stories/domain/events/story_published_event'
import { StoryId } from '#stories/domain/value-objects/ids/story_id.vo'
import { OwnerId } from '#stories/domain/value-objects/ids/owner_id.vo'
import { Slug } from '#stories/domain/value-objects/metadata/slug.vo'
import type { DomainEvent } from '#stories/domain/events/domain_event'

test.group('InMemoryEventPublisher', () => {
  test('should publish event to subscribed handlers', async ({ assert }) => {
    const publisher = new InMemoryEventPublisher()
    let handlerCalled = false
    let receivedEvent: DomainEvent | undefined

    // Subscribe to event
    publisher.subscribe('story.created', async (event) => {
      handlerCalled = true
      receivedEvent = event
    })

    // Create and publish event
    const storyId = StoryId.create('123e4567-e89b-12d3-a456-426614174000')
    const ownerId = OwnerId.create('223e4567-e89b-12d3-a456-426614174000')
    const slug = Slug.create('my-story')
    const event = StoryCreatedEvent.create(storyId, ownerId, slug, 'My Story')

    await publisher.publish(event)

    assert.isTrue(handlerCalled)
    assert.isDefined(receivedEvent)
    assert.equal(receivedEvent?.eventName, 'story.created')
    assert.equal(receivedEvent?.aggregateId, storyId.getValue())
  })

  test('should call multiple handlers for same event', async ({ assert }) => {
    const publisher = new InMemoryEventPublisher()
    let handler1Called = false
    let handler2Called = false

    publisher.subscribe('story.created', async () => {
      handler1Called = true
    })

    publisher.subscribe('story.created', async () => {
      handler2Called = true
    })

    const storyId = StoryId.create('123e4567-e89b-12d3-a456-426614174000')
    const ownerId = OwnerId.create('223e4567-e89b-12d3-a456-426614174000')
    const slug = Slug.create('my-story')
    const event = StoryCreatedEvent.create(storyId, ownerId, slug, 'My Story')

    await publisher.publish(event)

    assert.isTrue(handler1Called)
    assert.isTrue(handler2Called)
  })

  test('should not call handlers for different event types', async ({ assert }) => {
    const publisher = new InMemoryEventPublisher()
    let createdHandlerCalled = false
    let publishedHandlerCalled = false

    publisher.subscribe('story.created', async () => {
      createdHandlerCalled = true
    })

    publisher.subscribe('story.published', async () => {
      publishedHandlerCalled = true
    })

    const storyId = StoryId.create('123e4567-e89b-12d3-a456-426614174000')
    const ownerId = OwnerId.create('223e4567-e89b-12d3-a456-426614174000')
    const slug = Slug.create('my-story')
    const event = StoryCreatedEvent.create(storyId, ownerId, slug, 'My Story')

    await publisher.publish(event)

    assert.isTrue(createdHandlerCalled)
    assert.isFalse(publishedHandlerCalled)
  })

  test('should publish multiple events', async ({ assert }) => {
    const publisher = new InMemoryEventPublisher()
    const receivedEvents: DomainEvent[] = []

    publisher.subscribe('story.created', async (event) => {
      receivedEvents.push(event)
    })

    publisher.subscribe('story.published', async (event) => {
      receivedEvents.push(event)
    })

    const storyId = StoryId.create('123e4567-e89b-12d3-a456-426614174000')
    const ownerId = OwnerId.create('223e4567-e89b-12d3-a456-426614174000')
    const slug = Slug.create('my-story')

    const events = [
      StoryCreatedEvent.create(storyId, ownerId, slug, 'My Story'),
      StoryPublishedEvent.create(storyId, ownerId, 'My Story'),
    ]

    await publisher.publishMany(events)

    assert.equal(receivedEvents.length, 2)
    assert.equal(receivedEvents[0].eventName, 'story.created')
    assert.equal(receivedEvents[1].eventName, 'story.published')
  })

  test('should unsubscribe handler', async ({ assert }) => {
    const publisher = new InMemoryEventPublisher()
    let handlerCalled = false

    const handler = async () => {
      handlerCalled = true
    }

    publisher.subscribe('story.created', handler)
    publisher.unsubscribe('story.created', handler)

    const storyId = StoryId.create('123e4567-e89b-12d3-a456-426614174000')
    const ownerId = OwnerId.create('223e4567-e89b-12d3-a456-426614174000')
    const slug = Slug.create('my-story')
    const event = StoryCreatedEvent.create(storyId, ownerId, slug, 'My Story')

    await publisher.publish(event)

    assert.isFalse(handlerCalled)
  })

  test('should clear all subscriptions', async ({ assert }) => {
    const publisher = new InMemoryEventPublisher()
    let handlerCalled = false

    publisher.subscribe('story.created', async () => {
      handlerCalled = true
    })

    publisher.clearAllSubscriptions()

    const storyId = StoryId.create('123e4567-e89b-12d3-a456-426614174000')
    const ownerId = OwnerId.create('223e4567-e89b-12d3-a456-426614174000')
    const slug = Slug.create('my-story')
    const event = StoryCreatedEvent.create(storyId, ownerId, slug, 'My Story')

    await publisher.publish(event)

    assert.isFalse(handlerCalled)
  })

  test('should return correct handler count', ({ assert }) => {
    const publisher = new InMemoryEventPublisher()

    assert.equal(publisher.getHandlerCount('story.created'), 0)

    publisher.subscribe('story.created', async () => {})
    assert.equal(publisher.getHandlerCount('story.created'), 1)

    publisher.subscribe('story.created', async () => {})
    assert.equal(publisher.getHandlerCount('story.created'), 2)

    publisher.subscribe('story.published', async () => {})
    assert.equal(publisher.getHandlerCount('story.created'), 2)
    assert.equal(publisher.getHandlerCount('story.published'), 1)
  })
})
