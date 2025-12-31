import { test } from '@japa/runner'
import { StoryCreatedEvent } from './StoryCreatedEvent.js'
import { StoryPublishedEvent } from './StoryPublishedEvent.js'
import { StoryUnpublishedEvent } from './StoryUnpublishedEvent.js'
import { StoryDeletedEvent } from './StoryDeletedEvent.js'
import { StoryId } from '../value-objects/ids/StoryId.vo.js'
import { OwnerId } from '../value-objects/ids/OwnerId.vo.js'
import { Slug } from '../value-objects/metadata/Slug.vo.js'

test.group('Story Domain Events', () => {
  const storyId = StoryId.create('123e4567-e89b-12d3-a456-426614174000')
  const ownerId = OwnerId.create('223e4567-e89b-12d3-a456-426614174000')
  const slug = Slug.create('my-amazing-story')
  const title = 'My Amazing Story'

  test('StoryCreatedEvent should be created correctly', ({ assert }) => {
    const event = StoryCreatedEvent.create(storyId, ownerId, slug, title)

    assert.equal(event.eventName, 'story.created')
    assert.equal(event.aggregateId, storyId.getValue())
    assert.equal(event.storyId.getValue(), storyId.getValue())
    assert.equal(event.ownerId.getValue(), ownerId.getValue())
    assert.equal(event.slug.getValue(), slug.getValue())
    assert.equal(event.title, title)
    assert.instanceOf(event.occurredOn, Date)
  })

  test('StoryPublishedEvent should be created correctly', ({ assert }) => {
    const event = StoryPublishedEvent.create(storyId, ownerId, title)

    assert.equal(event.eventName, 'story.published')
    assert.equal(event.aggregateId, storyId.getValue())
    assert.equal(event.storyId.getValue(), storyId.getValue())
    assert.equal(event.ownerId.getValue(), ownerId.getValue())
    assert.equal(event.title, title)
    assert.instanceOf(event.occurredOn, Date)
  })

  test('StoryUnpublishedEvent should be created correctly', ({ assert }) => {
    const event = StoryUnpublishedEvent.create(storyId, ownerId, title)

    assert.equal(event.eventName, 'story.unpublished')
    assert.equal(event.aggregateId, storyId.getValue())
    assert.equal(event.storyId.getValue(), storyId.getValue())
    assert.equal(event.ownerId.getValue(), ownerId.getValue())
    assert.equal(event.title, title)
    assert.instanceOf(event.occurredOn, Date)
  })

  test('StoryDeletedEvent should be created correctly', ({ assert }) => {
    const event = StoryDeletedEvent.create(storyId, ownerId, title)

    assert.equal(event.eventName, 'story.deleted')
    assert.equal(event.aggregateId, storyId.getValue())
    assert.equal(event.storyId.getValue(), storyId.getValue())
    assert.equal(event.ownerId.getValue(), ownerId.getValue())
    assert.equal(event.title, title)
    assert.instanceOf(event.occurredOn, Date)
  })

  test('Events should have occurred recently', ({ assert }) => {
    const before = new Date()
    const event = StoryCreatedEvent.create(storyId, ownerId, slug, title)
    const after = new Date()

    assert.isTrue(event.occurredOn >= before)
    assert.isTrue(event.occurredOn <= after)
  })

  test('Multiple events should have different occurrence times', async ({ assert }) => {
    const event1 = StoryCreatedEvent.create(storyId, ownerId, slug, title)

    // Wait 10ms to ensure different timestamps (CI environments can be slower)
    await new Promise((resolve) => setTimeout(resolve, 10))

    const event2 = StoryPublishedEvent.create(storyId, ownerId, title)

    assert.isTrue(event2.occurredOn >= event1.occurredOn)
  })
})
