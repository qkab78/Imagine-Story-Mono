import { test } from '@japa/runner'
import { PublicationDate } from './PublicationDate.vo.js'
import { InvalidValueObjectException } from '#stories/domain/exceptions/InvalidValueObjectException'
import { IDateService } from '#stories/domain/services/IDateService'

class TestDateService implements IDateService {
  public now(): string {
    return '2025-01-01T00:00:00.000Z'
  }
}

test.group('PublicationDate Value Object', () => {
  test('should create PublicationDate from Date object', ({ assert }) => {
    const date = new Date('2025-01-01T00:00:00.000Z')
    const pubDate = PublicationDate.create(date)

    assert.isDefined(pubDate)
    assert.equal(pubDate.toISOString(), '2025-01-01T00:00:00.000Z')
  })

  test('should create PublicationDate from ISO string', ({ assert }) => {
    const isoString = '2025-01-01T00:00:00.000Z'
    const pubDate = PublicationDate.fromString(isoString)

    assert.isDefined(pubDate)
    assert.equal(pubDate.toISOString(), isoString)
  })

  test('should create PublicationDate with current date using now()', ({ assert }) => {
    const beforeDateString = new TestDateService().now()
    const afterDateString = new TestDateService().now()
    const before = new Date(beforeDateString)
    const pubDate = PublicationDate.now(new TestDateService())
    const after = new Date(afterDateString)
    assert.isDefined(pubDate)

    const dateValue = pubDate.toDate()
    assert.isTrue(dateValue >= before && dateValue <= after)
  })

  test('should throw error for invalid date', ({ assert }) => {
    assert.throws(
      () => PublicationDate.fromString('invalid-date'),
      InvalidValueObjectException,
      'Invalid date'
    )
  })

  test('should throw error for future dates', ({ assert }) => {
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)

    assert.throws(
      () => PublicationDate.create(futureDate),
      InvalidValueObjectException,
      'Publication date cannot be in the future'
    )
  })

  test('should check if publication is recent (within 7 days)', ({ assert }) => {
    const recentDate = new Date()
    recentDate.setDate(recentDate.getDate() - 3)
    const recentPubDate = PublicationDate.create(recentDate)

    const oldDate = new Date()
    oldDate.setDate(oldDate.getDate() - 30)
    const oldPubDate = PublicationDate.create(oldDate)

    assert.isTrue(recentPubDate.isRecent())
    assert.isFalse(oldPubDate.isRecent())
  })

  test('should calculate days since publication', ({ assert }) => {
    const date = new Date()
    date.setDate(date.getDate() - 5)
    const pubDate = PublicationDate.create(date)

    assert.equal(pubDate.daysSincePublication(), 5)
  })

  test('should compare two publication dates (isBefore)', ({ assert }) => {
    const date1 = PublicationDate.fromString('2025-01-01T00:00:00.000Z')
    const date2 = PublicationDate.fromString('2025-01-02T00:00:00.000Z')

    assert.isTrue(date1.isBefore(date2))
    assert.isFalse(date2.isBefore(date1))
  })

  test('should compare two publication dates (isAfter)', ({ assert }) => {
    const date1 = PublicationDate.fromString('2025-01-01T00:00:00.000Z')
    const date2 = PublicationDate.fromString('2025-01-02T00:00:00.000Z')

    assert.isTrue(date2.isAfter(date1))
    assert.isFalse(date1.isAfter(date2))
  })

  test('should check equality between two PublicationDates', ({ assert }) => {
    const date1 = PublicationDate.fromString('2025-01-01T00:00:00.000Z')
    const date2 = PublicationDate.fromString('2025-01-01T00:00:00.000Z')
    const date3 = PublicationDate.fromString('2025-01-02T00:00:00.000Z')

    assert.isTrue(date1.equals(date2))
    assert.isFalse(date1.equals(date3))
  })

  test('should convert to Date object', ({ assert }) => {
    const originalDate = new Date('2025-01-01T00:00:00.000Z')
    const pubDate = PublicationDate.create(originalDate)
    const convertedDate = pubDate.toDate()

    assert.instanceOf(convertedDate, Date)
    assert.equal(convertedDate.getTime(), originalDate.getTime())
    // Ensure it's a copy, not the same reference
    assert.notStrictEqual(convertedDate, originalDate)
  })
})
