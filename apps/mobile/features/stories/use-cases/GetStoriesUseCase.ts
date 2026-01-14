import { getStories, getLatestStories, getStoriesByAuthenticatedUserId } from '@/api/stories/storyApi'
import { StoryDTOMapper } from '../mappers/StoryDTOMapper'
import { StoryListItem } from '@/domain/stories/value-objects/StoryListItem'

/**
 * Get Stories Use Case
 *
 * Fetches stories from the API and transforms them to StoryListItem (for list views).
 */
export class GetStoriesUseCase {
  /**
   * Get all public stories
   * @param token Authentication token
   * @returns Array of StoryListItem
   */
  public static async execute(token: string): Promise<StoryListItem[]> {
    try {
      const dtos = await getStories(token)
      const stories = dtos.map((dto) => StoryDTOMapper.listItemToDomain(dto))
      return stories
    } catch (error) {
      console.error('[GetStoriesUseCase] Error fetching all stories:', error)
      throw error
    }
  }

  /**
   * Get latest public stories
   * @param token Authentication token
   * @returns Array of StoryListItem
   */
  public static async getLatest(token: string): Promise<StoryListItem[]> {
    try {
      const dtos = await getLatestStories(token)
      const stories = dtos.map((dto) => StoryDTOMapper.listItemToDomain(dto))
      return stories
    } catch (error) {
      console.error('[GetStoriesUseCase.getLatest] Error fetching latest stories:', error)
      throw error
    }
  }

  /**
   * Get stories by authenticated user ID
   * @param token Authentication token
   * @returns Array of StoryListItem
   */
  public static async getByUserId(token: string): Promise<StoryListItem[]> {
    try {
      const dtos = await getStoriesByAuthenticatedUserId(token)
      const stories = dtos.map((dto) => StoryDTOMapper.listItemToDomain(dto))
      return stories
    } catch (error) {
      console.error('[GetStoriesUseCase.getByUserId] Error fetching user stories:', error)
      throw error
    }
  }
}
