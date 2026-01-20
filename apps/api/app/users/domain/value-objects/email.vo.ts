import { ValueObject } from '#stories/domain/value-objects/base/value_object'
import { InvalidValueObjectException } from '#stories/domain/exceptions/invalid_value_object_exception'

/**
 * Email value object
 *
 * Encapsulates email validation and normalization
 * Always stored in lowercase for consistency
 */
export class Email extends ValueObject<string> {
  protected readonly value: string

  private constructor(email: string) {
    super()
    if (!this.isValidEmail(email)) {
      throw new InvalidValueObjectException(`Invalid email format: ${email}`)
    }
    // Normalize to lowercase
    this.value = email.toLowerCase()
  }

  public static create(email: string): Email {
    return new Email(email)
  }

  private isValidEmail(email: string): boolean {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
