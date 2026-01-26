import { createStory } from '@/api/stories/storyApi'
import { ValidateStoryCreationUseCase } from './ValidateStoryCreationUseCase'
import { MapStoryFormToPayloadUseCase } from './MapStoryFormToPayloadUseCase'
import type { StoryCreationFormData } from '@/types/creation'
import type { StoryCreatedResponse } from '@/api/stories/storyTypes'

/**
 * Create Story Use Case
 *
 * Orchestrates the creation of a new story:
 * 1. Validates form data
 * 2. Maps form data to backend payload
 * 3. Calls API to create story
 * 4. Returns created story response
 */
export class CreateStoryUseCase {
  /**
   * Create a new story
   * @param formData Story creation form data
   * @param token Authentication token
   * @param ownerId Story owner ID (optional)
   * @returns Created story response
   */
  public static async execute(
    formData: StoryCreationFormData,
    token: string,
    ownerId?: string
  ): Promise<StoryCreatedResponse> {
    // 1. Validate form data and get complete data
    const validatedData = ValidateStoryCreationUseCase.execute(formData)

    // 2. Map validated form data to backend payload
    const payload = MapStoryFormToPayloadUseCase.execute(validatedData, ownerId)

    // 3. Call API to create story
    const createdStory = await createStory(payload, token)

    // 4. Return created story response
    return createdStory
  }
}
