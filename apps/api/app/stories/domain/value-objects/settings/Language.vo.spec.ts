import { test } from '@japa/runner'
import { Language } from './Language.vo.js'
import { InvalidValueObjectException } from '#stories/domain/exceptions/InvalidValueObjectException'

test.group('Language Value Object', () => {
  test('should create a valid Language', ({ assert }) => {
    const language = Language.create(
      '123e4567-e89b-12d3-a456-426614174000',
      'English',
      'en',
      true
    )

    assert.equal(language.name, 'English')
    assert.equal(language.code, 'en')
    assert.isTrue(language.isFree)
    assert.equal(language.getIdValue(), '123e4567-e89b-12d3-a456-426614174000')
  })

  test('should throw error for invalid UUID', ({ assert }) => {
    assert.throws(
      () => Language.create('invalid-uuid', 'English', 'en', true),
      InvalidValueObjectException
    )
  })

  test('should check equality based on ID', ({ assert }) => {
    const language1 = Language.create(
      '123e4567-e89b-12d3-a456-426614174000',
      'English',
      'en',
      true
    )
    const language2 = Language.create(
      '123e4567-e89b-12d3-a456-426614174000',
      'French',
      'fr',
      false
    )
    const language3 = Language.create(
      '223e4567-e89b-12d3-a456-426614174000',
      'English',
      'en',
      true
    )

    assert.isTrue(language1.equals(language2))
    assert.isFalse(language1.equals(language3))
  })

  test('should return false when comparing with null or undefined', ({ assert }) => {
    const language = Language.create(
      '123e4567-e89b-12d3-a456-426614174000',
      'English',
      'en',
      true
    )

    assert.isFalse(language.equals(null as any))
    assert.isFalse(language.equals(undefined as any))
  })

  test('should correctly identify premium languages', ({ assert }) => {
    const freeLanguage = Language.create(
      '123e4567-e89b-12d3-a456-426614174000',
      'English',
      'en',
      true
    )
    const premiumLanguage = Language.create(
      '223e4567-e89b-12d3-a456-426614174000',
      'Japanese',
      'ja',
      false
    )

    assert.isFalse(freeLanguage.isPremium())
    assert.isTrue(premiumLanguage.isPremium())
  })

  test('should return UUID string via getIdValue', ({ assert }) => {
    const languageId = '123e4567-e89b-12d3-a456-426614174000'
    const language = Language.create(languageId, 'English', 'en', true)

    assert.equal(language.getIdValue(), languageId)
    assert.typeOf(language.getIdValue(), 'string')
  })
})
