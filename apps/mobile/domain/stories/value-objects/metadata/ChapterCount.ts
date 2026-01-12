import { ValueObject } from '../base/ValueObject'
import { InvalidValueObjectException } from '../../exceptions/InvalidValueObjectException'

/**
 * Chapter count value object
 *
 * Represents the number of chapters in a story.
 * Valid range: 1-20 chapters
 */
export class ChapterCount extends ValueObject<number> {
  protected readonly value: number

  private static readonly MIN_CHAPTERS = 1
  private static readonly MAX_CHAPTERS = 20

  private constructor(count: number) {
    super()
    this.validate(count)
    this.value = count
  }

  /**
   * Create a ChapterCount from a number
   * @param count Number of chapters (1-20)
   * @returns ChapterCount instance
   */
  public static create(count: number): ChapterCount {
    return new ChapterCount(count)
  }

  private validate(count: number): void {
    if (!Number.isInteger(count)) {
      throw new InvalidValueObjectException('Chapter count must be an integer')
    }

    if (count < ChapterCount.MIN_CHAPTERS) {
      throw new InvalidValueObjectException(
        `Story must have at least ${ChapterCount.MIN_CHAPTERS} chapter`
      )
    }

    if (count > ChapterCount.MAX_CHAPTERS) {
      throw new InvalidValueObjectException(
        `Story cannot exceed ${ChapterCount.MAX_CHAPTERS} chapters`
      )
    }
  }
}
