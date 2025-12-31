import { ApplicationException } from './ApplicationException.js'

/**
 * Duplicate Slug Exception
 *
 * Thrown when attempting to create a story with a slug that already exists.
 */
export class DuplicateSlugException extends ApplicationException {
  constructor(slug: string) {
    super(
      `A story with slug "${slug}" already exists`,
      'DUPLICATE_SLUG',
      409 // Conflict
    )
    this.name = 'DuplicateSlugException'
  }
}
