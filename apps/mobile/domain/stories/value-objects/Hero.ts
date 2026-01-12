import { ValueObject } from './base/ValueObject'
import { InvalidValueObjectException } from '../exceptions/InvalidValueObjectException'

/**
 * Hero value object
 *
 * Frontend-specific value object representing a hero character selection.
 * Contains emoji and name for UI display purposes.
 */
export class Hero extends ValueObject<string> {
  protected readonly value: string

  public readonly emoji: string
  public readonly name: string

  private constructor(id: string, emoji: string, name: string) {
    super()
    this.validate(id, emoji, name)
    this.value = id
    this.emoji = emoji
    this.name = name
  }

  /**
   * Create a Hero from id, emoji, and name
   * @param id Hero identifier
   * @param emoji Hero emoji representation
   * @param name Hero name
   * @returns Hero instance
   */
  public static create(id: string, emoji: string, name: string): Hero {
    return new Hero(id, emoji, name)
  }

  private validate(id: string, emoji: string, name: string): void {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new InvalidValueObjectException('Hero ID must be a non-empty string')
    }

    if (!emoji || typeof emoji !== 'string' || emoji.trim().length === 0) {
      throw new InvalidValueObjectException('Hero emoji must be a non-empty string')
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new InvalidValueObjectException('Hero name must be a non-empty string')
    }
  }
}
