import { ValueObject } from '../base/value_object.js'

/**
 * Publication status value object
 *
 * Represents whether a story is public (visible to all) or private (visible only to owner).
 * Provides semantic methods instead of raw boolean.
 */
export class PublicationStatus extends ValueObject<boolean> {
  protected readonly value: boolean

  private constructor(isPublic: boolean) {
    super()
    this.value = isPublic
  }

  /**
   * Create a public publication status
   */
  public static public(): PublicationStatus {
    return new PublicationStatus(true)
  }

  /**
   * Create a private publication status
   */
  public static private(): PublicationStatus {
    return new PublicationStatus(false)
  }

  /**
   * Create from boolean value
   * @param isPublic true for public, false for private
   */
  public static fromBoolean(isPublic: boolean): PublicationStatus {
    return new PublicationStatus(isPublic)
  }

  /**
   * Check if the story is public
   */
  public isPublic(): boolean {
    return this.value === true
  }

  /**
   * Check if the story is private
   */
  public isPrivate(): boolean {
    return this.value === false
  }

  /**
   * Convert to the opposite status
   */
  public toggle(): PublicationStatus {
    return new PublicationStatus(!this.value)
  }
}
