import type { StoryCreationFormData } from '@/types/creation'

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
}

/**
 * Story Form Mapper
 *
 * Maps frontend form data to backend CreateStoryPayload.
 */
export class StoryFormMapper {
  /**
   * Map frontend StoryCreationFormData to backend CreateStoryPayload
   * @param formData Frontend form data
   * @param token Authentication token
   * @param ownerId Story owner ID
   * @returns Backend CreateStoryPayload
   */
  public static toBackendPayload(
    formData: StoryCreationFormData,
    token: string,
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
      species: formData.hero.species, // Map hero species (girl, boy, robot, etc.)
      // Optional fields
      title: undefined,
      conclusion: undefined,
      coverImageUrl: undefined,
      ownerId: ownerId,
      isPublic: false,
    }
  }
}
