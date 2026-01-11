import { ValueObject } from '../base/ValueObject'
import { InvalidValueObjectException } from '../../exceptions/InvalidValueObjectException'

/**
 * Protagonist name value object
 *
 * Represents the name of the story's main character.
 * Valid length: 1-50 characters
 */
export class ProtagonistName extends ValueObject<string> {
  protected readonly value: string

  private static readonly MIN_LENGTH = 1
  private static readonly MAX_LENGTH = 50

  private constructor(name: string) {
    super()
    this.validate(name)
    this.value = name.trim()
  }

  /**
   * Create a ProtagonistName from a string
   * @param name Protagonist name (1-50 characters)
   * @returns ProtagonistName instance
   */
  public static create(name: string): ProtagonistName {
    return new ProtagonistName(name)
  }

  private validate(name: string): void {
    if (!name || typeof name !== 'string') {
      throw new InvalidValueObjectException('Protagonist name must be a non-empty string')
    }

    const trimmed = name.trim()

    if (trimmed.length < ProtagonistName.MIN_LENGTH) {
      throw new InvalidValueObjectException(
        `Protagonist name must be at least ${ProtagonistName.MIN_LENGTH} character long`
      )
    }

    if (trimmed.length > ProtagonistName.MAX_LENGTH) {
      throw new InvalidValueObjectException(
        `Protagonist name cannot exceed ${ProtagonistName.MAX_LENGTH} characters`
      )
    }
  }
}
