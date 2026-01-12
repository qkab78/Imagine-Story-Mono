import { StoryId } from './ids/StoryId'
import { Slug } from './metadata/Slug'
import { ChildAge } from './metadata/ChildAge'
import { ImageUrl } from './media/ImageUrl'
import { OwnerId } from './ids/OwnerId'
import { PublicationDate } from './metadata/PublicationDate'
import { PublicationStatus } from './metadata/PublicationStatus'
import { Theme } from './settings/Theme'
import { Language } from './settings/Language'
import { Tone } from './settings/Tone'

/**
 * Story List Item
 *
 * Lightweight representation of a story for list/grid views.
 * Does not include chapters or full validation - use Story entity for detail views.
 */
export class StoryListItem {
  private constructor(
    public readonly id: StoryId,
    public readonly slug: Slug,
    public readonly title: string,
    public readonly synopsis: string,
    public readonly protagonist: string,
    public readonly species: string,
    public readonly childAge: ChildAge,
    public readonly coverImageUrl: ImageUrl | null,
    public readonly ownerId: OwnerId,
    public readonly publicationDate: PublicationDate,
    public readonly publicationStatus: PublicationStatus,
    public readonly theme: Theme,
    public readonly language: Language,
    public readonly tone: Tone,
    public readonly numberOfChapters: number
  ) {}

  public static create(
    id: StoryId,
    slug: Slug,
    title: string,
    synopsis: string,
    protagonist: string,
    species: string,
    childAge: ChildAge,
    coverImageUrl: ImageUrl | null,
    ownerId: OwnerId,
    publicationDate: PublicationDate,
    publicationStatus: PublicationStatus,
    theme: Theme,
    language: Language,
    tone: Tone,
    numberOfChapters: number
  ): StoryListItem {
    return new StoryListItem(
      id,
      slug,
      title,
      synopsis,
      protagonist,
      species,
      childAge,
      coverImageUrl,
      ownerId,
      publicationDate,
      publicationStatus,
      theme,
      language,
      tone,
      numberOfChapters
    )
  }

  /**
   * Check if story is published
   */
  public isPublic(): boolean {
    return this.publicationStatus.isPublic()
  }
}
