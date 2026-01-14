import { getStoryById } from '@/api/stories/storyApi'
import { StoryDTOMapper } from '../mappers/StoryDTOMapper'
import { Story } from '@/domain/stories/entities/Story'

/**
 * Get Story By ID Use Case
 *
 * Retrieves a story by its ID and maps it to a domain entity.
 */
export class GetStoryByIdUseCase {
  /**
   * Execute the use case
   * @param id Story ID
   * @returns Story domain entity
   */
  public static async execute(id: string): Promise<Story> {
    try {
      const dto = await getStoryById(id)
      const story = StoryDTOMapper.toDomain(dto)
      return story
    } catch (error) {
      console.error('[GetStoryByIdUseCase] Error:', error)
      throw error
    }
  }
}
