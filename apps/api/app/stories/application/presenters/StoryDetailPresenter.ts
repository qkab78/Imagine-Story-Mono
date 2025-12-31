import type { Story } from '#stories/domain/entities/story.entity'
import type { StoryDetailDTO } from '#stories/application/dtos/StoryDTO'
import { ChapterPresenter } from './ChapterPresenter.js'
import { ThemePresenter } from './ThemePresenter.js'
import { LanguagePresenter } from './LanguagePresenter.js'
import { TonePresenter } from './TonePresenter.js'

/**
 * Story Detail Presenter
 *
 * Transforms Story entity to complete StoryDetailDTO (with chapters)
 * Used for single story views
 */
export class StoryDetailPresenter {
  /**
   * Transform a story to detailed DTO
   */
  public static toDTO(story: Story): StoryDetailDTO {
    return {
      id: story.id.getValue(),
      slug: story.slug.getValue(),
      title: story.title,
      synopsis: story.synopsis,
      protagonist: story.protagonist,
      species: story.species,
      conclusion: story.conclusion,
      childAge: story.childAge.getValue(),
      coverImageUrl: story.coverImageUrl.getValue(),
      isPublic: story.isPublic(),
      publicationDate: story.publicationDate.getValue(),
      theme: ThemePresenter.toDTO(story.theme),
      language: LanguagePresenter.toDTO(story.language),
      tone: TonePresenter.toDTO(story.tone),
      ownerId: story.ownerId.getValue(),
      chapters: ChapterPresenter.toDTOs(story.getAllChapters()),
    }
  }
}
