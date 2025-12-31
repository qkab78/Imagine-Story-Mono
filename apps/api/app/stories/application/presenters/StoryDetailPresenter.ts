import type { Story } from '#stories/domain/entities/story.entity'
import type { StoryDetailDTO } from '#stories/application/dtos/StoryDTO'
import type { IStorageService } from '#stories/domain/services/IStorageService'
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
  public static async toDTO(
    story: Story,
    storageService: IStorageService
  ): Promise<StoryDetailDTO> {
    const coverImageUrl = await this.resolveImageUrl(
      story.coverImageUrl.getValue(),
      storageService
    )
    const chapters = await ChapterPresenter.toDTOs(story.getAllChapters(), storageService)

    return {
      id: story.id.getValue(),
      slug: story.slug.getValue(),
      title: story.title,
      synopsis: story.synopsis,
      protagonist: story.protagonist,
      species: story.species,
      conclusion: story.conclusion,
      childAge: story.childAge.getValue(),
      coverImageUrl,
      isPublic: story.isPublic(),
      publicationDate: story.publicationDate.getValue(),
      theme: ThemePresenter.toDTO(story.theme),
      language: LanguagePresenter.toDTO(story.language),
      tone: TonePresenter.toDTO(story.tone),
      ownerId: story.ownerId.getValue(),
      chapters,
    }
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
    // Example: /Volumes/.../uploads/stories/covers/file.webp -> covers/file.webp
    if (pathOrUrl.includes('/uploads/stories/')) {
      const match = pathOrUrl.match(/\/uploads\/stories\/(.+)$/)
      if (match) {
        const relativePath = match[1] // e.g., "covers/file.webp"
        return storageService.getUrl(relativePath)
      }
    }

    // If it's a local path like /images/covers/file.webp, return as-is for local storage
    if (pathOrUrl.startsWith('/images/')) {
      return pathOrUrl
    }

    // Otherwise, it's a storage path (e.g., covers/file.webp) - generate URL
    return storageService.getUrl(pathOrUrl)
  }
}
