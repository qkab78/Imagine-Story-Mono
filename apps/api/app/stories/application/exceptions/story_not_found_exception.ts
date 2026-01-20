import { ApplicationException } from './application_exception.js'

/**
 * Story Not Found Exception
 *
 * Thrown when a story cannot be found by its identifier.
 */
export class StoryNotFoundException extends ApplicationException {
  constructor(identifier: string, identifierType: 'id' | 'slug' = 'id') {
    const message =
      identifierType === 'id'
        ? `Story with ID "${identifier}" not found`
        : `Story with slug "${identifier}" not found`

    super(message, 'STORY_NOT_FOUND', 404)
    this.name = 'StoryNotFoundException'
  }

  /**
   * Create exception for story not found by ID
   */
  public static byId(id: string): StoryNotFoundException {
    return new StoryNotFoundException(id, 'id')
  }

  /**
   * Create exception for story not found by slug
   */
  public static bySlug(slug: string): StoryNotFoundException {
    return new StoryNotFoundException(slug, 'slug')
  }
}
