import { getStoryBySlug } from '@/api/stories/storyApi'
import { StoryDTOMapper } from '../mappers/StoryDTOMapper'
import { Story } from '@/domain/stories/entities/Story'

/**
 * Get Story By Slug Use Case
 *
 * Fetches a story by slug from the API and transforms it to a domain entity.
 */
export class GetStoryBySlugUseCase {
  /**
   * Get story by slug
   * @param slug Story slug
   * @returns Story entity
   */
  public static async execute(slug: string): Promise<Story> {
    const dto = await getStoryBySlug(slug)
    return StoryDTOMapper.toDomain(dto)
  }
}
