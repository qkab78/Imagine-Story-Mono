import { ValueObject } from '../base/ValueObject.js'
import { InvalidValueObjectException } from '#stories/domain/exceptions/InvalidValueObjectException'

/**
 * Chapter identifier value object
 *
 * Represents a chapter's position in the story sequence (1-based).
 * Must be a positive integer.
 */
export class ChapterId extends ValueObject<number> {
  protected readonly value: number

  private constructor(id: number) {
    super()
    if (!Number.isInteger(id) || id < 1) {
      throw new InvalidValueObjectException(`Invalid Chapter ID: ${id}. Must be a positive integer (>= 1).`)
    }
    this.value = id
  }

  /**
   * Create a ChapterId from a number
   * @param id Positive integer (>= 1)
   * @returns ChapterId instance
   */
  public static create(id: number): ChapterId {
    return new ChapterId(id)
  }
}
