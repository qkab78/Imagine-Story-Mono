import { ValueObject } from '../base/value_object.js'
import { InvalidValueObjectException } from '#stories/domain/exceptions/invalid_value_object_exception'

/**
 * Language identifier value object
 */
export class LanguageId extends ValueObject<string> {
  protected readonly value: string

  private constructor(id: string) {
    super()
    if (!this.isValidUUID(id)) {
      throw new InvalidValueObjectException(
        `Invalid Language ID format: ${id}. Must be a valid UUID.`
      )
    }
    this.value = id
  }

  public static create(id: string): LanguageId {
    return new LanguageId(id)
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }
}
