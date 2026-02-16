import { test } from '@japa/runner'
import { ExpirationDate } from '#subscription/domain/value-objects/expiration_date.vo'

test.group('ExpirationDate', () => {
  test('none() should return null value', ({ assert }) => {
    const date = ExpirationDate.none()
    assert.isNull(date.getValue())
  })

  test('create(null) should return null value', ({ assert }) => {
    const date = ExpirationDate.create(null)
    assert.isNull(date.getValue())
  })

  test('create(undefined) should return null value', ({ assert }) => {
    const date = ExpirationDate.create(undefined)
    assert.isNull(date.getValue())
  })

  test('should create from Date', ({ assert }) => {
    const d = new Date('2030-01-01')
    const date = ExpirationDate.create(d)
    assert.deepEqual(date.getValue(), d)
  })

  test('should create from string', ({ assert }) => {
    const date = ExpirationDate.create('2030-01-01T00:00:00Z')
    assert.instanceOf(date.getValue(), Date)
  })

  test('isExpired() should return false for future date', ({ assert }) => {
    const date = ExpirationDate.create(new Date(Date.now() + 86400000))
    assert.isFalse(date.isExpired())
  })

  test('isExpired() should return true for past date', ({ assert }) => {
    const date = ExpirationDate.create(new Date(Date.now() - 86400000))
    assert.isTrue(date.isExpired())
  })

  test('isExpired() should return false for null', ({ assert }) => {
    const date = ExpirationDate.none()
    assert.isFalse(date.isExpired())
  })

  test('getDaysRemaining() should return null for null date', ({ assert }) => {
    const date = ExpirationDate.none()
    assert.isNull(date.getDaysRemaining())
  })

  test('getDaysRemaining() should return positive for future date', ({ assert }) => {
    const futureDate = new Date(Date.now() + 5 * 86400000)
    const date = ExpirationDate.create(futureDate)
    const remaining = date.getDaysRemaining()
    assert.isNotNull(remaining)
    assert.isAbove(remaining!, 0)
  })

  test('getDaysRemaining() should return negative for past date', ({ assert }) => {
    const pastDate = new Date(Date.now() - 5 * 86400000)
    const date = ExpirationDate.create(pastDate)
    const remaining = date.getDaysRemaining()
    assert.isNotNull(remaining)
    assert.isBelow(remaining!, 0)
  })

  test('getWarningLevel() should return none when willRenew is true', ({ assert }) => {
    const date = ExpirationDate.create(new Date(Date.now() + 86400000))
    assert.equal(date.getWarningLevel(true), 'none')
  })

  test('getWarningLevel() should return none for null date', ({ assert }) => {
    const date = ExpirationDate.none()
    assert.equal(date.getWarningLevel(false), 'none')
  })

  test('getWarningLevel() should return urgent for <= 3 days', ({ assert }) => {
    const date = ExpirationDate.create(new Date(Date.now() + 2 * 86400000))
    assert.equal(date.getWarningLevel(false), 'urgent')
  })

  test('getWarningLevel() should return warning for <= 7 days', ({ assert }) => {
    const date = ExpirationDate.create(new Date(Date.now() + 5 * 86400000))
    assert.equal(date.getWarningLevel(false), 'warning')
  })

  test('getWarningLevel() should return info for <= 30 days', ({ assert }) => {
    const date = ExpirationDate.create(new Date(Date.now() + 15 * 86400000))
    assert.equal(date.getWarningLevel(false), 'info')
  })

  test('getWarningLevel() should return none for > 30 days', ({ assert }) => {
    const date = ExpirationDate.create(new Date(Date.now() + 60 * 86400000))
    assert.equal(date.getWarningLevel(false), 'none')
  })
})
