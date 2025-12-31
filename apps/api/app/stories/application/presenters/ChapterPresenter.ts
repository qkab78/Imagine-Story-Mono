import type { Chapter } from '#stories/domain/entities/chapter.entity'
import type { ChapterDTO } from '#stories/application/dtos/StoryDTO'

/**
 * Chapter Presenter
 *
 * Transforms Chapter entity to ChapterDTO
 */
export class ChapterPresenter {
  /**
   * Transform a single chapter to DTO
   */
  public static toDTO(chapter: Chapter): ChapterDTO {
    return {
      id: chapter.id.getValue(),
      position: chapter.getPosition(),
      title: chapter.title,
      content: chapter.content,
      image: chapter.image
        ? {
            url: chapter.image.imageUrl.getValue(),
          }
        : null,
    }
  }

  /**
   * Transform multiple chapters to DTOs
   */
  public static toDTOs(chapters: Chapter[]): ChapterDTO[] {
    return chapters.map((chapter) => this.toDTO(chapter))
  }
}
