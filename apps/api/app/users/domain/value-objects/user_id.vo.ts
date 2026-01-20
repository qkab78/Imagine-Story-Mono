import { ValueObject } from '#stories/domain/value-objects/base/value_object'
import { InvalidValueObjectException } from '#stories/domain/exceptions/invalid_value_object_exception'

/**
 * User identifier value object
 *
 * Encapsulates user ID validation and ensures type safety
 */
export class UserId extends ValueObject<string> {
  protected readonly value: string

  private constructor(id: string) {
    super()
    if (!this.isValidUUID(id)) {
      throw new InvalidValueObjectException(`Invalid User ID format: ${id}. Must be a valid UUID.`)
    }
    this.value = id
  }

  public static create(id: string): UserId {
    return new UserId(id)
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }
}
