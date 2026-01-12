import { ValueObject } from '../base/ValueObject'
import { InvalidValueObjectException } from '../../exceptions/InvalidValueObjectException'

/**
 * Slug value object for URL-friendly identifiers
 *
 * A slug is a URL-friendly string used for SEO and readable URLs.
 * Format: lowercase alphanumeric with hyphens, no spaces or special characters
 * Length: 3-100 characters
 */
export class Slug extends ValueObject<string> {
  protected readonly value: string

  private static readonly MIN_LENGTH = 3
  private static readonly MAX_LENGTH = 100
  private static readonly SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

  private constructor(slug: string) {
    super()
    this.validate(slug)
    this.value = slug
  }

  /**
   * Create a Slug from a string
   * @param slug URL-friendly string
   * @returns Slug instance
   */
  public static create(slug: string): Slug {
    return new Slug(slug)
  }

  /**
   * Generate a slug from a title
   * @param title Original title
   * @returns Slug instance
   */
  public static fromTitle(title: string): Slug {
    const slug = title
      .toLowerCase()
      .normalize('NFD') // Normalize accents
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

    return new Slug(slug)
  }

  private validate(slug: string): void {
    if (!slug || slug.trim().length === 0) {
      throw new InvalidValueObjectException('Slug cannot be empty')
    }

    if (slug.length < Slug.MIN_LENGTH) {
      throw new InvalidValueObjectException(
        `Slug must be at least ${Slug.MIN_LENGTH} characters long`
      )
    }

    if (slug.length > Slug.MAX_LENGTH) {
      throw new InvalidValueObjectException(
        `Slug cannot exceed ${Slug.MAX_LENGTH} characters`
      )
    }

    if (!Slug.SLUG_REGEX.test(slug)) {
      throw new InvalidValueObjectException(
        'Slug must contain only lowercase letters, numbers, and hyphens'
      )
    }
  }
}
