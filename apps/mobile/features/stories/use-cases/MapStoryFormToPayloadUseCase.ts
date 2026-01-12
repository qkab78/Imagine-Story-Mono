import { StoryFormMapper } from '../mappers/StoryFormMapper'
import type { StoryCreationFormData } from '@/types/creation'
import type { CreateStoryPayload } from '../mappers/StoryFormMapper'

/**
 * Map Story Form To Payload Use Case
 *
 * Transforms frontend form data to backend API payload.
 */
export class MapStoryFormToPayloadUseCase {
  /**
   * Map frontend form data to backend payload
   * @param formData Frontend form data
   * @param token Authentication token
   * @param ownerId Story owner ID (optional)
   * @returns Backend CreateStoryPayload
   */
  public static execute(
    formData: StoryCreationFormData,
    token: string,
    ownerId?: string
  ): CreateStoryPayload {
    return StoryFormMapper.toBackendPayload(formData, token, ownerId)
  }
}
