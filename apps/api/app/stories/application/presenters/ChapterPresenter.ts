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
   * Transform a single chapter to DTO
   */
  public static async toDTO(
    chapter: Chapter,
    storageService: IStorageService
  ): Promise<ChapterDTO> {
    let imageUrl: string | null = null

    if (chapter.image) {
      imageUrl = await this.resolveImageUrl(
        chapter.image.imageUrl.getValue(),
        storageService
      )
    }

    return {
      id: chapter.id.getValue(),
      position: chapter.getPosition(),
      title: chapter.title,
      content: chapter.content,
      image: imageUrl
        ? {
            url: imageUrl,
          }
        : null,
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
   * If path is already a full URL (http/https), return as-is
   * Otherwise, generate URL using storage service
   */
  private static async resolveImageUrl(
    pathOrUrl: string,
    storageService: IStorageService
  ): Promise<string> {
    // If already a full URL, return as-is (backward compatibility)
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl
    }

    // If it's an absolute filesystem path (legacy format), extract the relative path
    // Example: /Volumes/.../uploads/stories/chapters/file.png -> chapters/file.png
    if (pathOrUrl.includes('/uploads/stories/')) {
      const match = pathOrUrl.match(/\/uploads\/stories\/(.+)$/)
      if (match) {
        const relativePath = match[1] // e.g., "chapters/file.png"
        return storageService.getUrl(relativePath)
      }
    }

    // If it's a local path like /images/chapters/file.png, return as-is for local storage
    if (pathOrUrl.startsWith('/images/')) {
      return pathOrUrl
    }

    // Otherwise, it's a storage path (e.g., chapters/file.png) - generate URL
    return storageService.getUrl(pathOrUrl)
  }
}
