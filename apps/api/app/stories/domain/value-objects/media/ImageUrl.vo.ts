import { ValueObject } from '../base/ValueObject.js'
import { InvalidValueObjectException } from '#stories/domain/exceptions/InvalidValueObjectException'

/**
 * Image URL value object
 *
 * Represents a URL to an image (cover image or chapter image).
 * Validates URL format and optionally checks allowed protocols.
 */
export class ImageUrl extends ValueObject<string> {
  protected readonly value: string

  private static readonly ALLOWED_PROTOCOLS = ['http:', 'https:', 'data:']
  private static readonly MAX_LENGTH = 2048

  private constructor(url: string) {
    super()
    this.validate(url)
    this.value = url
  }

  /**
   * Create an ImageUrl from a string
   * @param url Image URL string
   * @returns ImageUrl instance
   */
  public static create(url: string): ImageUrl {
    return new ImageUrl(url)
  }

  /**
   * Get the file extension from the URL
   */
  public getExtension(): string | null {
    try {
      const pathname = new URL(this.value).pathname
      const match = pathname.match(/\.([a-z0-9]+)$/i)
      return match ? match[1].toLowerCase() : null
    } catch {
      return null
    }
  }

  /**
   * Check if the image is a data URL (base64)
   */
  public isDataUrl(): boolean {
    return this.value.startsWith('data:')
  }

  /**
   * Check if the image is an external URL
   */
  public isExternalUrl(): boolean {
    return this.value.startsWith('http://') || this.value.startsWith('https://')
  }

  private validate(url: string): void {
    if (!url || url.trim().length === 0) {
      throw new InvalidValueObjectException('Image URL cannot be empty')
    }

    if (url.length > ImageUrl.MAX_LENGTH) {
      throw new InvalidValueObjectException(
        `Image URL cannot exceed ${ImageUrl.MAX_LENGTH} characters`
      )
    }

    // For data URLs, basic validation
    if (url.startsWith('data:')) {
      if (!url.includes('base64,')) {
        throw new InvalidValueObjectException('Invalid data URL format')
      }
      return
    }

    // For local paths (absolute or relative), accept them
    // Examples: /images/covers/file.webp, chapters/file.png
    if (url.startsWith('/') || !url.includes('://')) {
      // Basic validation: ensure it looks like a file path
      if (url.includes('..') || url.includes('\\')) {
        throw new InvalidValueObjectException('Invalid path: directory traversal not allowed')
      }
      return
    }

    // For regular URLs (http://, https://), validate format
    try {
      const parsedUrl = new URL(url)

      if (!ImageUrl.ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
        throw new InvalidValueObjectException(
          `Invalid protocol. Allowed: ${ImageUrl.ALLOWED_PROTOCOLS.join(', ')}`
        )
      }
    } catch (error) {
      throw new InvalidValueObjectException(`Invalid URL format: ${url}`)
    }
  }
}
