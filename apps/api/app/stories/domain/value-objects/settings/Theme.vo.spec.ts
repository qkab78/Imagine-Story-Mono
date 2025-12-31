import { test } from '@japa/runner'
import { Theme } from './Theme.vo.js'
import { InvalidValueObjectException } from '#stories/domain/exceptions/InvalidValueObjectException'

test.group('Theme Value Object', () => {
  test('should create a valid Theme', ({ assert }) => {
    const theme = Theme.create(
      '123e4567-e89b-12d3-a456-426614174000',
      'Adventure',
      'An exciting adventure story'
    )

    assert.equal(theme.name, 'Adventure')
    assert.equal(theme.description, 'An exciting adventure story')
    assert.equal(theme.getIdValue(), '123e4567-e89b-12d3-a456-426614174000')
  })

  test('should throw error for invalid UUID', ({ assert }) => {
    assert.throws(
      () => Theme.create('invalid-uuid', 'Adventure', 'Description'),
      InvalidValueObjectException
    )
  })

  test('should check equality based on ID', ({ assert }) => {
    const theme1 = Theme.create(
      '123e4567-e89b-12d3-a456-426614174000',
      'Adventure',
      'Description 1'
    )
    const theme2 = Theme.create(
      '123e4567-e89b-12d3-a456-426614174000',
      'Different Name',
      'Description 2'
    )
    const theme3 = Theme.create(
      '223e4567-e89b-12d3-a456-426614174000',
      'Adventure',
      'Description 1'
    )

    assert.isTrue(theme1.equals(theme2))
    assert.isFalse(theme1.equals(theme3))
  })

  test('should return false when comparing with null or undefined', ({ assert }) => {
    const theme = Theme.create(
      '123e4567-e89b-12d3-a456-426614174000',
      'Adventure',
      'Description'
    )

    assert.isFalse(theme.equals(null as any))
    assert.isFalse(theme.equals(undefined as any))
  })

  test('should return UUID string via getIdValue', ({ assert }) => {
    const themeId = '123e4567-e89b-12d3-a456-426614174000'
    const theme = Theme.create(themeId, 'Adventure', 'Description')

    assert.equal(theme.getIdValue(), themeId)
    assert.typeOf(theme.getIdValue(), 'string')
  })
})
