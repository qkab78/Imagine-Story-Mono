import { StoryCreationRules } from '@/domain/stories/rules/story-creation.rules'
import type { StoryCreationFormData } from '@/types/creation'
import { InvalidValueObjectException } from '@/domain/stories/exceptions/InvalidValueObjectException'

/**
 * Validate Story Creation Use Case
 *
 * Validates story creation form data using domain rules.
 */
export class ValidateStoryCreationUseCase {
  /**
   * Validate story creation form data
   * @param formData Story creation form data
   * @throws InvalidValueObjectException if validation fails
   */
  public static execute(formData: StoryCreationFormData): void {
    // Validate hero name
    StoryCreationRules.validateHeroName(formData.heroName)

    // Validate child age
    StoryCreationRules.validateChildAge(formData.age)

    // Validate chapter count
    StoryCreationRules.validateChapterCount(formData.numberOfChapters)

    // Validate protagonist name (using hero name as protagonist)
    StoryCreationRules.validateProtagonistName(formData.heroName)

    // Validate theme ID (should be UUID from backend)
    // Note: Currently frontend uses hardcoded themes with string IDs
    // This will need to be updated when fetching from backend
    if (!formData.theme?.id) {
      throw new InvalidValueObjectException('Theme is required')
    }

    // Validate language (should be UUID from backend)
    if (!formData.language) {
      throw new InvalidValueObjectException('Language is required')
    }

    // Validate tone ID (should be UUID from backend)
    if (!formData.tone?.id) {
      throw new InvalidValueObjectException('Tone is required')
    }
  }
}
