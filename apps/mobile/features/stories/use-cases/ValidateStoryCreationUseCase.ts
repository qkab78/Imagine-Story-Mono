import { StoryCreationRules } from '@/domain/stories/rules/story-creation.rules'
import type { StoryCreationFormData } from '@/types/creation'
import { InvalidValueObjectException } from '@/domain/stories/exceptions/InvalidValueObjectException'

/**
 * Type guard to check if StoryCreationFormData is complete
 */
export interface CompleteStoryCreationFormData {
  hero: NonNullable<StoryCreationFormData['hero']>
  heroName: string
  language: NonNullable<StoryCreationFormData['language']>
  age: number
  numberOfChapters: number
  theme: NonNullable<StoryCreationFormData['theme']>
  tone: NonNullable<StoryCreationFormData['tone']>
  illustrationStyle?: StoryCreationFormData['illustrationStyle']
}

/**
 * Validate Story Creation Use Case
 *
 * Validates story creation form data using domain rules.
 * Ensures all required fields are present and valid.
 */
export class ValidateStoryCreationUseCase {
  /**
   * Type guard to check if form data is complete
   * @param formData Story creation form data to check
   * @returns True if all required fields are present
   */
  public static isComplete(formData: StoryCreationFormData): formData is CompleteStoryCreationFormData {
    return (
      formData.hero !== undefined &&
      formData.hero !== null &&
      formData.heroName !== undefined &&
      formData.heroName !== null &&
      formData.language !== undefined &&
      formData.language !== null &&
      formData.age !== undefined &&
      formData.age !== null &&
      formData.numberOfChapters !== undefined &&
      formData.numberOfChapters !== null &&
      formData.theme !== undefined &&
      formData.theme !== null &&
      formData.tone !== undefined &&
      formData.tone !== null
    )
  }

  /**
   * Validate story creation form data
   * @param formData Story creation form data
   * @throws InvalidValueObjectException if validation fails
   * @returns Validated complete form data
   */
  public static execute(formData: StoryCreationFormData): CompleteStoryCreationFormData {
    // First check if all required fields are present
    if (!this.isComplete(formData)) {
      // Check each field to provide specific error messages
      if (!formData.hero) {
        throw new InvalidValueObjectException('Hero is required')
      }
      if (!formData.heroName) {
        throw new InvalidValueObjectException('Hero name is required')
      }
      if (!formData.language) {
        throw new InvalidValueObjectException('Language is required')
      }
      if (formData.age === undefined || formData.age === null) {
        throw new InvalidValueObjectException('Age is required')
      }
      if (formData.numberOfChapters === undefined || formData.numberOfChapters === null) {
        throw new InvalidValueObjectException('Number of chapters is required')
      }
      if (!formData.theme) {
        throw new InvalidValueObjectException('Theme is required')
      }
      if (!formData.tone) {
        throw new InvalidValueObjectException('Tone is required')
      }
      // This should never be reached if checks above are exhaustive
      throw new InvalidValueObjectException('Missing required fields')
    }

    // Now we have a complete form data, validate the values
    const completeData = formData as CompleteStoryCreationFormData

    // Validate hero
    if (!completeData.hero.id) {
      throw new InvalidValueObjectException('Hero must have an ID')
    }
    if (!completeData.hero.species) {
      throw new InvalidValueObjectException('Hero must have a species')
    }

    // Validate hero name
    StoryCreationRules.validateHeroName(completeData.heroName)

    // Validate child age
    StoryCreationRules.validateChildAge(completeData.age)

    // Validate chapter count
    StoryCreationRules.validateChapterCount(completeData.numberOfChapters)

    // Validate protagonist name (using hero name as protagonist)
    StoryCreationRules.validateProtagonistName(completeData.heroName)

    // Validate theme
    if (!completeData.theme.id) {
      throw new InvalidValueObjectException('Theme must have an ID')
    }
    if (!completeData.theme.name) {
      throw new InvalidValueObjectException('Theme must have a name')
    }

    // Validate language
    if (!completeData.language.id) {
      throw new InvalidValueObjectException('Language must have an ID')
    }
    if (!completeData.language.code) {
      throw new InvalidValueObjectException('Language must have a code')
    }

    // Validate tone
    if (!completeData.tone.id) {
      throw new InvalidValueObjectException('Tone must have an ID')
    }
    if (!completeData.tone.title) {
      throw new InvalidValueObjectException('Tone must have a title')
    }

    // Validate illustration style if provided
    const validStyles = ['japanese-soft', 'disney-pixar', 'watercolor', 'classic-book']
    if (completeData.illustrationStyle && !validStyles.includes(completeData.illustrationStyle)) {
      throw new InvalidValueObjectException('Invalid illustration style')
    }

    // All validations passed, return the validated complete data
    return completeData
  }
}