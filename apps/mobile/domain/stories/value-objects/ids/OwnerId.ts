import { ValueObject } from '../base/ValueObject'
import { InvalidValueObjectException } from '../../exceptions/InvalidValueObjectException'

/**
 * Owner (User) identifier value object
 */
export class OwnerId extends ValueObject<string> {
  protected readonly value: string

  private constructor(id: string) {
    super()
    if (!this.isValidUUID(id)) {
      throw new InvalidValueObjectException(`Invalid Owner ID format: ${id}. Must be a valid UUID.`)
    }
    this.value = id
  }

  public static create(id: string): OwnerId {
    return new OwnerId(id)
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }
}
