import { ValueObject } from '#stories/domain/value-objects/base/value_object'

export type ExpirationWarningLevel = 'none' | 'info' | 'warning' | 'urgent'

export class ExpirationDate extends ValueObject<Date | null> {
  protected readonly value: Date | null

  private constructor(value: Date | null) {
    super()
    this.value = value
  }

  static create(date: Date | string | null | undefined): ExpirationDate {
    if (date === null || date === undefined) {
      return new ExpirationDate(null)
    }
    return new ExpirationDate(date instanceof Date ? date : new Date(date))
  }

  static none(): ExpirationDate {
    return new ExpirationDate(null)
  }

  isExpired(): boolean {
    if (!this.value) return false
    return this.value < new Date()
  }

  getDaysRemaining(): number | null {
    if (!this.value) return null
    const now = new Date()
    const diffMs = this.value.getTime() - now.getTime()
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  }

  getWarningLevel(willRenew: boolean): ExpirationWarningLevel {
    if (willRenew) return 'none'
    const days = this.getDaysRemaining()
    if (days === null) return 'none'
    if (days <= 3) return 'urgent'
    if (days <= 7) return 'warning'
    if (days <= 30) return 'info'
    return 'none'
  }
}
