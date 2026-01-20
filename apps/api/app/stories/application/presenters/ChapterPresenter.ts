import type { Chapter } from '#stories/domain/entities/chapter.entity'
import type { ChapterDTO } from '#stories/application/dtos/StoryDTO'
import type { IStorageService } from '#stories/domain/services/IStorageService'

/**
 * Chapter Presenter
 *
 * Transforms Chapter entity to ChapterDTO
 */
export class ChapterPresenter {
  /**
   * Transform a chapter to DTO
   */
  public static async toDTO(
    chapter: Chapter,
    storageService: IStorageService
  ): Promise<ChapterDTO> {
    let image: { url: string } | null = null

    if (chapter.image) {
      const imageUrl = await this.resolveImageUrl(chapter.image.imageUrl.getValue(), storageService)
      image = { url: imageUrl }
    }

    return {
      id: chapter.id.getValue(),
      position: chapter.getPosition(),
      title: chapter.title,
      content: chapter.content,
      image,
    }
  }

  /**
   * Transform multiple chapters to DTOs
   */
  public static async toDTOs(
    chapters: Chapter[],
    storageService: IStorageService
  ): Promise<ChapterDTO[]> {
    return Promise.all(chapters.map((chapter) => this.toDTO(chapter, storageService)))
  }

  /**
   * Resolve image URL from path
   */
  private static async resolveImageUrl(
    pathOrUrl: string,
    storageService: IStorageService
  ): Promise<string> {
    // If already a full URL, return as-is
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl
    }

    // If it's an absolute filesystem path (legacy format), extract the relative path
    if (pathOrUrl.includes('/uploads/stories/')) {
      const match = pathOrUrl.match(/\/uploads\/stories\/(.+)$/)
      if (match) {
        const relativePath = match[1]
        return storageService.getUrl(relativePath)
      }
    }

    // If it's a local path like /images/chapters/file.webp, return as-is
    if (pathOrUrl.startsWith('/images/')) {
      return pathOrUrl
    }

    // Otherwise, it's a storage path - generate URL
    return storageService.getUrl(pathOrUrl)
  }
}
