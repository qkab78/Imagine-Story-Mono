import { ApplicationException } from './ApplicationException.js'

/**
 * Unauthorized Story Access Exception
 *
 * Thrown when a user attempts to access or modify a story they don't own.
 */
export class UnauthorizedStoryAccessException extends ApplicationException {
  constructor(storyId: string, userId: string, action: string = 'access') {
    super(
      `User "${userId}" is not authorized to ${action} story "${storyId}"`,
      'UNAUTHORIZED_STORY_ACCESS',
      403 // Forbidden
    )
    this.name = 'UnauthorizedStoryAccessException'
  }
}
