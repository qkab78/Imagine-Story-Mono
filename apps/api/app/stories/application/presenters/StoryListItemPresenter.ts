import type { Story } from '#stories/domain/entities/story.entity'
import type { StoryListItemDTO } from '#stories/application/dtos/StoryDTO'
import { ThemePresenter } from './ThemePresenter.js'
import { LanguagePresenter } from './LanguagePresenter.js'
import { TonePresenter } from './TonePresenter.js'

/**
 * Story List Item Presenter
 *
 * Transforms Story entity to StoryListItemDTO (without chapters)
 * Used for list views and search results
 */
export class StoryListItemPresenter {
  /**
   * Transform a story to list item DTO
   */
  public static toDTO(story: Story): StoryListItemDTO {
    return {
      id: story.id.getValue(),
      slug: story.slug.getValue(),
      title: story.title,
      synopsis: story.synopsis,
      protagonist: story.protagonist,
      species: story.species,
      childAge: story.childAge.getValue(),
      coverImageUrl: story.coverImageUrl.getValue(),
      isPublic: story.isPublic(),
      publicationDate: story.publicationDate.getValue(),
      theme: ThemePresenter.toDTO(story.theme),
      language: LanguagePresenter.toDTO(story.language),
      tone: TonePresenter.toDTO(story.tone),
      ownerId: story.ownerId.getValue(),
      numberOfChapters: story.chapters.length,
    }
  }

  /**
   * Transform multiple stories to list item DTOs
   */
  public static toDTOs(stories: Story[]): StoryListItemDTO[] {
    return stories.map((story) => this.toDTO(story))
  }
}
