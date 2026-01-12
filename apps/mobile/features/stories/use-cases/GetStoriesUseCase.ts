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
      console.log('[GetStoriesUseCase] Fetching all stories with token:', token ? 'present' : 'missing')
      const dtos = await getStories(token)
      console.log('[GetStoriesUseCase] Received DTOs count:', dtos.length)
      const stories = dtos.map((dto) => StoryDTOMapper.listItemToDomain(dto))
      console.log('[GetStoriesUseCase] Mapped to domain entities count:', stories.length)
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
      console.log('[GetStoriesUseCase.getLatest] Fetching latest stories with token:', token ? 'present' : 'missing')
      const dtos = await getLatestStories(token)
      console.log('[GetStoriesUseCase.getLatest] Received DTOs count:', dtos.length)
      const stories = dtos.map((dto) => StoryDTOMapper.listItemToDomain(dto))
      console.log('[GetStoriesUseCase.getLatest] Mapped to domain entities count:', stories.length)
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
      console.log('[GetStoriesUseCase.getByUserId] Fetching user stories with token:', token ? 'present' : 'missing')
      const dtos = await getStoriesByAuthenticatedUserId(token)
      console.log('[GetStoriesUseCase.getByUserId] Received DTOs count:', dtos.length)
      const stories = dtos.map((dto) => StoryDTOMapper.listItemToDomain(dto))
      console.log('[GetStoriesUseCase.getByUserId] Mapped to domain entities count:', stories.length)
      return stories
    } catch (error) {
      console.error('[GetStoriesUseCase.getByUserId] Error fetching user stories:', error)
      throw error
    }
  }
}
