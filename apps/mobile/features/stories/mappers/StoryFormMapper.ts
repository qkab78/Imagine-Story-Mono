import type { CompleteStoryCreationFormData } from '../use-cases/ValidateStoryCreationUseCase'

/**
 * Backend CreateStoryPayload interface
 * Matches the backend CreateStoryPayload structure
 */
export interface CreateStoryPayload {
  title?: string
  synopsis: string
  theme: string
  protagonist: string
  childAge: number
  numberOfChapters: number
  language: string
  tone: string
  species?: string
  conclusion?: string
  coverImageUrl?: string
  ownerId?: string
  isPublic?: boolean
  appearancePreset?: string
  illustrationStyle?: string
}

/**
 * Story Form Mapper
 *
 * Maps frontend form data to backend CreateStoryPayload.
 */
export class StoryFormMapper {
  /**
   * Map frontend StoryCreationFormData to backend CreateStoryPayload
   * This method expects validated and complete form data
   * @param formData Frontend form data (must be complete and validated)
   * @param ownerId Story owner ID
   * @returns Backend CreateStoryPayload
   */
  public static toBackendPayload(
    formData: CompleteStoryCreationFormData,
    ownerId?: string
  ): CreateStoryPayload {
    return {
      synopsis: formData.theme.description || '',
      theme: formData.theme.id, // UUID from backend
      protagonist: formData.heroName,
      childAge: formData.age,
      numberOfChapters: formData.numberOfChapters,
      language: formData.language.id, // UUID from backend
      tone: formData.tone.id, // UUID from backend
      species: formData.hero.species || formData.hero.id, // Map hero species (girl, boy, robot, etc.) with fallback to id
      appearancePreset: formData.hero.skinTone, // Map skin tone to appearance preset
      illustrationStyle: formData.illustrationStyle || 'japanese-soft', // Map illustration style with default
      // Optional fields
      ownerId,
      title: undefined,
      conclusion: undefined,
      coverImageUrl: undefined,
      isPublic: false,
    }
  }
}
