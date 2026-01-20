import { test } from '@japa/runner'
import { Tone } from './tone.vo.js'
import { InvalidValueObjectException } from '#stories/domain/exceptions/invalid_value_object_exception'

test.group('Tone Value Object', () => {
  test('should create a valid Tone', ({ assert }) => {
    const tone = Tone.create(
      '123e4567-e89b-12d3-a456-426614174000',
      'Happy',
      'A joyful and uplifting tone'
    )

    assert.equal(tone.name, 'Happy')
    assert.equal(tone.description, 'A joyful and uplifting tone')
    assert.equal(tone.getIdValue(), '123e4567-e89b-12d3-a456-426614174000')
  })

  test('should throw error for invalid UUID', ({ assert }) => {
    assert.throws(
      () => Tone.create('invalid-uuid', 'Happy', 'Description'),
      InvalidValueObjectException
    )
  })

  test('should check equality based on ID', ({ assert }) => {
    const tone1 = Tone.create('123e4567-e89b-12d3-a456-426614174000', 'Happy', 'Description 1')
    const tone2 = Tone.create('123e4567-e89b-12d3-a456-426614174000', 'Sad', 'Description 2')
    const tone3 = Tone.create('223e4567-e89b-12d3-a456-426614174000', 'Happy', 'Description 1')

    assert.isTrue(tone1.equals(tone2))
    assert.isFalse(tone1.equals(tone3))
  })

  test('should return false when comparing with null or undefined', ({ assert }) => {
    const tone = Tone.create('123e4567-e89b-12d3-a456-426614174000', 'Happy', 'Description')

    assert.isFalse(tone.equals(null as any))
    assert.isFalse(tone.equals(undefined as any))
  })

  test('should return UUID string via getIdValue', ({ assert }) => {
    const toneId = '123e4567-e89b-12d3-a456-426614174000'
    const tone = Tone.create(toneId, 'Happy', 'Description')

    assert.equal(tone.getIdValue(), toneId)
    assert.typeOf(tone.getIdValue(), 'string')
  })
})
