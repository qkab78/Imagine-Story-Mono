import type { ChapterId } from '../value-objects/ids/ChapterId.vo.js'
import type { ImageUrl } from '../value-objects/media/ImageUrl.vo.js'
import { DomainException } from '../exceptions/DomainException.js'

/**
 * Chapter Entity
 *
 * Represents a chapter within a story.
 * Has an identity based on its position in the sequence.
 * Chapter 1 ≠ Chapter 2 even with the same content.
 *
 * Invariants:
 * - Title must be between 1 and 100 characters
 * - Content must be between 1 and 5000 characters
 */
export class Chapter {
  private static readonly MIN_TITLE_LENGTH = 1
  private static readonly MAX_TITLE_LENGTH = 100
  private static readonly MIN_CONTENT_LENGTH = 1
  private static readonly MAX_CONTENT_LENGTH = 5000

  private constructor(
    public readonly id: ChapterId,
    public readonly title: string,
    public readonly content: string,
    public readonly image: ChapterImage | null
  ) {
    this.validate()
  }

  /**
   * Create a new Chapter
   */
  public static create(
    id: ChapterId,
    title: string,
    content: string,
    image: ChapterImage | null = null
  ): Chapter {
    return new Chapter(id, title, content, image)
  }

  /**
   * Validate chapter invariants
   */
  private validate(): void {
    // Validate title length
    if (
      this.title.length < Chapter.MIN_TITLE_LENGTH ||
      this.title.length > Chapter.MAX_TITLE_LENGTH
    ) {
      throw new DomainException(
        `Chapter title must be between ${Chapter.MIN_TITLE_LENGTH} and ${Chapter.MAX_TITLE_LENGTH} characters`
      )
    }

    // Validate content length
    if (
      this.content.length < Chapter.MIN_CONTENT_LENGTH ||
      this.content.length > Chapter.MAX_CONTENT_LENGTH
    ) {
      throw new DomainException(
        `Chapter content must be between ${Chapter.MIN_CONTENT_LENGTH} and ${Chapter.MAX_CONTENT_LENGTH} characters`
      )
    }
  }

  /**
   * Check if chapter has an image
   */
  public hasImage(): boolean {
    return this.image !== null
  }

  /**
   * Get chapter position (1-indexed)
   */
  public getPosition(): number {
    return this.id.getValue()
  }
}

/**
 * Chapter Image value object
 *
 * Represents the image associated with a chapter.
 */
export class ChapterImage {
  private constructor(
    public readonly chapterId: ChapterId,
    public readonly imageUrl: ImageUrl
  ) {}

  /**
   * Create a new ChapterImage
   */
  public static create(chapterId: ChapterId, imageUrl: ImageUrl): ChapterImage {
    return new ChapterImage(chapterId, imageUrl)
  }
}