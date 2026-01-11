import { getStories, getLatestStories, getStoriesByAuthenticatedUserId } from '@/api/stories/storyApi'
import { StoryDTOMapper } from '../mappers/StoryDTOMapper'
import { Story } from '@/domain/stories/entities/Story'

/**
 * Get Stories Use Case
 *
 * Fetches stories from the API and transforms them to domain entities.
 */
export class GetStoriesUseCase {
  /**
   * Get all public stories
   * @param token Authentication token
   * @returns Array of Story entities
   */
  public static async execute(token: string): Promise<Story[]> {
    const dtos = await getStories(token)
    return dtos.map((dto) => StoryDTOMapper.listItemToDomain(dto))
  }

  /**
   * Get latest public stories
   * @param token Authentication token
   * @returns Array of Story entities
   */
  public static async getLatest(token: string): Promise<Story[]> {
    const dtos = await getLatestStories(token)
    return dtos.map((dto) => StoryDTOMapper.listItemToDomain(dto))
  }

  /**
   * Get stories by authenticated user ID
   * @param token Authentication token
   * @returns Array of Story entities
   */
  public static async getByUserId(token: string): Promise<Story[]> {
    const dtos = await getStoriesByAuthenticatedUserId(token)
    return dtos.map((dto) => StoryDTOMapper.listItemToDomain(dto))
  }
}
