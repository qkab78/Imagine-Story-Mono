import type { Chapter } from './Chapter'
import type { Theme } from '../value-objects/settings/Theme'
import type { Language } from '../value-objects/settings/Language'
import type { Tone } from '../value-objects/settings/Tone'
import type { StoryId } from '../value-objects/ids/StoryId'
import type { OwnerId } from '../value-objects/ids/OwnerId'
import type { Slug } from '../value-objects/metadata/Slug'
import type { ChildAge } from '../value-objects/metadata/ChildAge'
import type { ImageUrl } from '../value-objects/media/ImageUrl'
import type { PublicationDate } from '../value-objects/metadata/PublicationDate'
import { PublicationStatus } from '../value-objects/metadata/PublicationStatus'
import { GenerationStatus } from '../value-objects/metadata/GenerationStatus'
import { DomainException } from '../exceptions/DomainException'
import { StoryTitle } from '../value-objects/metadata/StoryTitle'
import { ProtagonistName } from '../value-objects/metadata/ProtagonistName'

/**
 * Story Entity - Aggregate Root
 *
 * Controls:
 * - Its identity (StoryId)
 * - Its content properties (title, synopsis, conclusion)
 * - Its metadata (slug, publication status, visibility)
 * - Its child entities and value objects
 * - The management of its chapter collection
 * - The application of business rules
 *
 * Invariants:
 * - Must have at least 1 chapter
 * - Cannot exceed 20 chapters
 * - Child age must be between 3 and 10 years (enforced by ChildAge VO)
 * - Title must be between 1 and 100 characters
 * - Protagonist must be between 1 and 50 characters
 */
export class Story {
  private static readonly MIN_CHAPTERS = 1
  private static readonly MAX_CHAPTERS = 20

  private constructor(
    public readonly id: StoryId,
    public readonly slug: Slug,
    public readonly childAge: ChildAge,
    public readonly coverImageUrl: ImageUrl | null = null,
    public readonly ownerId: OwnerId,
    public readonly publicationDate: PublicationDate,
    private readonly _publicationStatus: PublicationStatus,
    public readonly title: string,
    public readonly synopsis: string,
    public readonly protagonist: string,
    public readonly species: string,
    public readonly conclusion: string,
    public readonly theme: Theme,
    public readonly language: Language,
    public readonly tone: Tone,
    private readonly _chapters: readonly Chapter[],
    private _generationStatus: GenerationStatus
  ) {
    this.validate()
  }

  /**
   * Create a new Story
   */
  public static create(
    id: StoryId,
    slug: Slug,
    childAge: ChildAge,
    coverImageUrl: ImageUrl | null = null,
    ownerId: OwnerId,
    publicationDate: PublicationDate,
    publicationStatus: PublicationStatus,
    title: string,
    synopsis: string,
    protagonist: string,
    species: string,
    conclusion: string,
    theme: Theme,
    language: Language,
    tone: Tone,
    chapters: Chapter[],
    generationStatus: GenerationStatus = GenerationStatus.completed()
  ): Story {
    return new Story(
      id,
      slug,
      childAge,
      coverImageUrl,
      ownerId,
      publicationDate,
      publicationStatus,
      title,
      synopsis,
      protagonist,
      species,
      conclusion,
      theme,
      language,
      tone,
      chapters,
      generationStatus
    )
  }

  /**
   * Validate all story invariants
   */
  private validate(): void {
    // Validate title using value object
    try {
      StoryTitle.create(this.title)
    } catch (error) {
      throw new DomainException(
        error instanceof Error ? error.message : 'Invalid story title'
      )
    }

    // Validate protagonist using value object
    try {
      ProtagonistName.create(this.protagonist)
    } catch (error) {
      throw new DomainException(
        error instanceof Error ? error.message : 'Invalid protagonist name'
      )
    }

    // Validate chapters count
    if (this._chapters.length < Story.MIN_CHAPTERS) {
      throw new DomainException(`Story must have at least ${Story.MIN_CHAPTERS} chapter`)
    }

    if (this._chapters.length > Story.MAX_CHAPTERS) {
      throw new DomainException(`Story cannot exceed ${Story.MAX_CHAPTERS} chapters`)
    }
  }

  /**
   * Get publication status
   */
  public get publicationStatus(): PublicationStatus {
    return this._publicationStatus
  }

  /**
   * Get generation status
   */
  public get generationStatus(): GenerationStatus {
    return this._generationStatus
  }

  /**
   * Get all chapters
   */
  public getAllChapters(): readonly Chapter[] {
    return this._chapters
  }

  /**
   * Get number of chapters
   */
  public get numberOfChapters(): number {
    return this._chapters.length
  }

  /**
   * Check if story is public
   */
  public isPublic(): boolean {
    return this._publicationStatus.isPublic()
  }

  /**
   * Check if story is private
   */
  public isPrivate(): boolean {
    return this._publicationStatus.isPrivate()
  }
}
