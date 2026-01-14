import type { Story } from '#stories/domain/entities/story.entity'
import type { StoryListItemDTO } from '#stories/application/dtos/StoryDTO'
import type { IStorageService } from '#stories/domain/services/IStorageService'
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
  public static async toDTO(
    story: Story,
    storageService: IStorageService
  ): Promise<StoryListItemDTO> {
    let coverImageUrl = null
    if (story.coverImageUrl) {
      coverImageUrl = await this.resolveImageUrl(
        story.coverImageUrl.getValue(),
        storageService
      )
    }
    return {
      id: story.id.getValue(),
      slug: story.slug.getValue(),
      title: story.title,
      synopsis: story.synopsis,
      protagonist: story.protagonist,
      species: story.species,
      childAge: story.childAge.getValue(),
      coverImageUrl,
      isPublic: story.isPublic(),
      publicationDate: story.publicationDate.getValue(),
      theme: ThemePresenter.toDTO(story.theme),
      language: LanguagePresenter.toDTO(story.language),
      tone: TonePresenter.toDTO(story.tone),
      ownerId: story.ownerId.getValue(),
      numberOfChapters: story.chapters.length,
      generationStatus: story.generationStatus.getValue() as 'pending' | 'processing' | 'completed' | 'failed',
    }
  }

  /**
   * Transform multiple stories to list item DTOs
   */
  public static async toDTOs(
    stories: Story[],
    storageService: IStorageService
  ): Promise<StoryListItemDTO[]> {
    return Promise.all(stories.map((story) => this.toDTO(story, storageService)))
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
