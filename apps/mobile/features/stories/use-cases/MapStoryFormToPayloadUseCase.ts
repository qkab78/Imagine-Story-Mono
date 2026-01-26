import { StoryFormMapper } from '../mappers/StoryFormMapper'
import type { CompleteStoryCreationFormData } from './ValidateStoryCreationUseCase'
import type { CreateStoryPayload } from '../mappers/StoryFormMapper'

/**
 * Map Story Form To Payload Use Case
 *
 * Transforms frontend form data to backend API payload.
 */
export class MapStoryFormToPayloadUseCase {
  /**
   * Map validated frontend form data to backend payload
   * @param formData Validated and complete frontend form data
   * @param ownerId Story owner ID (optional)
   * @returns Backend CreateStoryPayload
   */
  public static execute(
    formData: CompleteStoryCreationFormData,
    ownerId?: string
  ): CreateStoryPayload {
    return StoryFormMapper.toBackendPayload(formData, ownerId)
  }
}
