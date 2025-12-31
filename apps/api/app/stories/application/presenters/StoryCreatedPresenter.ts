import type { Story } from '#stories/domain/entities/story.entity'
import type { StoryCreatedDTO } from '#stories/application/dtos/StoryDTO'

/**
 * Story Created Presenter
 *
 * Transforms Story entity to minimal StoryCreatedDTO after creation
 */
export class StoryCreatedPresenter {
  /**
   * Transform a story to creation response DTO
   */
  public static toDTO(story: Story): StoryCreatedDTO {
    return {
      id: story.id.getValue(),
      slug: story.slug.getValue(),
      title: story.title,
      createdAt: story.publicationDate.getValue(),
    }
  }
}
