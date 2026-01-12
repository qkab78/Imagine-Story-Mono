import { ValueObject } from '../base/ValueObject'
import { InvalidValueObjectException } from '../../exceptions/InvalidValueObjectException'

/**
 * Story title value object
 *
 * Represents the title of a story.
 * Valid length: 1-100 characters
 */
export class StoryTitle extends ValueObject<string> {
  protected readonly value: string

  private static readonly MIN_LENGTH = 1
  private static readonly MAX_LENGTH = 100

  private constructor(title: string) {
    super()
    this.validate(title)
    this.value = title.trim()
  }

  /**
   * Create a StoryTitle from a string
   * @param title Story title (1-100 characters)
   * @returns StoryTitle instance
   */
  public static create(title: string): StoryTitle {
    return new StoryTitle(title)
  }

  private validate(title: string): void {
    if (!title || typeof title !== 'string') {
      throw new InvalidValueObjectException('Story title must be a non-empty string')
    }

    const trimmed = title.trim()

    if (trimmed.length < StoryTitle.MIN_LENGTH) {
      throw new InvalidValueObjectException(
        `Story title must be at least ${StoryTitle.MIN_LENGTH} character long`
      )
    }

    if (trimmed.length > StoryTitle.MAX_LENGTH) {
      throw new InvalidValueObjectException(
        `Story title cannot exceed ${StoryTitle.MAX_LENGTH} characters`
      )
    }
  }
}
