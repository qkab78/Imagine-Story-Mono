import { test } from '@japa/runner'
import { StoryId } from './story_id.vo.js'
import { InvalidValueObjectException } from '#stories/domain/exceptions/invalid_value_object_exception'
import { IRandomService } from '#stories/domain/services/i_random_service'

class TestRandomService implements IRandomService {
  public generateRandomUuid(): string {
    return '1ed3df18-0bc3-4a08-aa6b-d5eb20e0dbc0'
  }
}
class OtherTestRandomService implements IRandomService {
  public generateRandomUuid(): string {
    return '123e4567-e89b-12d3-a456-426614174000'
  }
}

test.group('StoryId Value Object', () => {
  test('should create a StoryId from a valid UUID', ({ assert }) => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000'
    const storyId = StoryId.create(uuid)

    assert.isDefined(storyId)
    assert.equal(storyId.getValue(), uuid)
  })

  test('should generate a new StoryId with random UUID', ({ assert }) => {
    const storyId = StoryId.generate(new TestRandomService())

    assert.isDefined(storyId)
    assert.match(
      storyId.getValue(),
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  })

  test('should generate different UUIDs on each generate call', ({ assert }) => {
    const storyId1 = StoryId.generate(new TestRandomService())
    const storyId2 = StoryId.generate(new OtherTestRandomService())

    assert.notEqual(storyId1.getValue(), storyId2.getValue())
  })

  test('should throw error for invalid UUID format', ({ assert }) => {
    assert.throws(
      () => StoryId.create('not-a-uuid'),
      InvalidValueObjectException,
      'Invalid Story ID format'
    )
  })

  test('should throw error for empty string', ({ assert }) => {
    assert.throws(() => StoryId.create(''), InvalidValueObjectException, 'Invalid Story ID format')
  })

  test('should check equality between two StoryIds', ({ assert }) => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000'
    const storyId1 = StoryId.create(uuid)
    const storyId2 = StoryId.create(uuid)
    const storyId3 = StoryId.create('223e4567-e89b-12d3-a456-426614174000')

    assert.isTrue(storyId1.equals(storyId2))
    assert.isFalse(storyId1.equals(storyId3))
  })

  test('should convert to string', ({ assert }) => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000'
    const storyId = StoryId.create(uuid)

    assert.equal(storyId.toString(), uuid)
  })
})
