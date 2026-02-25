import { getStoryOfTheDay } from '@/api/stories/widgetApi'
import { StoryDTOMapper } from '../mappers/StoryDTOMapper'
import { StoryListItem } from '@/domain/stories/value-objects/StoryListItem'

/**
 * Get Story of the Day Use Case
 *
 * Fetches the story of the day from the widget API and transforms it to a StoryListItem.
 */
export class GetStoryOfTheDayUseCase {
  public static async execute(): Promise<StoryListItem | null> {
    try {
      const dto = await getStoryOfTheDay()
      if (!dto) {
        return null
      }
      return StoryDTOMapper.listItemToDomain(dto)
    } catch (error) {
      console.error('[GetStoryOfTheDayUseCase] Error fetching story of the day:', error)
      throw error
    }
  }
}
