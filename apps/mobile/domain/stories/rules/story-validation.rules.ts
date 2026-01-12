import { Story } from '../entities/Story'
import { DomainException } from '../exceptions/DomainException'

/**
 * Story Validation Rules
 *
 * Contains business rules for story validation.
 */
export class StoryValidationRules {
  /**
   * Validate that a story can be published
   * @param story Story entity
   * @throws DomainException if story cannot be published
   */
  public static validateCanPublish(story: Story): void {
    if (story.getAllChapters().length === 0) {
      throw new DomainException('Cannot publish story without chapters')
    }
  }

  /**
   * Validate that a story has required fields
   * @param story Story entity
   * @throws DomainException if story is invalid
   */
  public static validateStory(story: Story): void {
    if (!story.title || story.title.trim().length === 0) {
      throw new DomainException('Story title is required')
    }

    if (!story.protagonist || story.protagonist.trim().length === 0) {
      throw new DomainException('Story protagonist is required')
    }

    if (story.getAllChapters().length === 0) {
      throw new DomainException('Story must have at least one chapter')
    }
  }
}
