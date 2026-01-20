import { ValueObject } from '../base/ValueObject'
import { InvalidValueObjectException } from '../../exceptions/InvalidValueObjectException'

/**
 * Publication date value object
 *
 * Represents when a story was published/created.
 * Provides business logic methods for date comparisons and calculations.
 */
export class PublicationDate extends ValueObject<Date> {
  protected readonly value: Date

  private constructor(date: Date) {
    super()
    this.validate(date)
    this.value = date
  }

  /**
   * Create PublicationDate from a Date object
   * @param date Date object
   * @returns PublicationDate instance
   */
  public static create(date: Date): PublicationDate {
    return new PublicationDate(date)
  }

  /**
   * Create PublicationDate from an ISO string
   * @param dateString ISO 8601 date string
   * @returns PublicationDate instance
   */
  public static fromString(dateString: string): PublicationDate {
    const date = new Date(dateString)
    return new PublicationDate(date)
  }

  /**
   * Create PublicationDate with current date/time
   * @returns PublicationDate instance with current date
   */
  public static now(): PublicationDate {
    return new PublicationDate(new Date())
  }

  /**
   * Convert to ISO 8601 string
   */
  public toISOString(): string {
    return this.value.toISOString()
  }

  /**
   * Get the underlying Date object
   */
  public toDate(): Date {
    return new Date(this.value.getTime())
  }

  /**
   * Check if the publication date is recent (within X days)
   * @param days Number of days to consider recent (default: 7)
   */
  public isRecent(days: number = 7): boolean {
    const now = new Date()
    const diffInMs = now.getTime() - this.value.getTime()
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    return diffInDays <= days
  }

  /**
   * Calculate days since publication
   */
  public daysSincePublication(): number {
    const now = new Date()
    const diffInMs = now.getTime() - this.value.getTime()
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  }

  /**
   * Check if this publication date is before another
   */
  public isBefore(other: PublicationDate): boolean {
    return this.value.getTime() < other.value.getTime()
  }

  /**
   * Check if this publication date is after another
   */
  public isAfter(other: PublicationDate): boolean {
    return this.value.getTime() > other.value.getTime()
  }

  /**
   * Override equals to compare dates properly
   */
  public override equals(other: PublicationDate): boolean {
    if (other === null || other === undefined) {
      return false
    }

    if (!(other instanceof PublicationDate)) {
      return false
    }

    return this.value.getTime() === other.value.getTime()
  }

  private validate(date: Date): void {
    if (!(date instanceof Date)) {
      throw new InvalidValueObjectException('PublicationDate must be a Date object')
    }

    if (Number.isNaN(date.getTime())) {
      throw new InvalidValueObjectException('Invalid date')
    }

    // Don't allow future dates
    const now = new Date()
    if (date.getTime() > now.getTime()) {
      throw new InvalidValueObjectException('Publication date cannot be in the future')
    }
  }
}
