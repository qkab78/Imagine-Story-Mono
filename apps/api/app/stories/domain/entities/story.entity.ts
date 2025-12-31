import type { Chapter } from './chapter.entity.js'
import type { Theme } from '../value-objects/settings/Theme.vo.js'
import type { Language } from '../value-objects/settings/Language.vo.js'
import type { Tone } from '../value-objects/settings/Tone.vo.js'
import type { StoryId } from '../value-objects/ids/StoryId.vo.js'
import type { OwnerId } from '../value-objects/ids/OwnerId.vo.js'
import type { Slug } from '../value-objects/metadata/Slug.vo.js'
import type { ChildAge } from '../value-objects/metadata/ChildAge.vo.js'
import type { ImageUrl } from '../value-objects/media/ImageUrl.vo.js'
import type { PublicationDate } from '../value-objects/metadata/PublicationDate.vo.js'
import { PublicationStatus } from '../value-objects/metadata/PublicationStatus.vo.js'
import { DomainException } from '../exceptions/DomainException.js'

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
 * - Synopsis must be between 1 and 500 characters
 * - Cannot be published without chapters
 * - Slug must be unique (verified at repository level)
 */
export class Story {
  private static readonly MIN_TITLE_LENGTH = 1
  private static readonly MAX_TITLE_LENGTH = 100
  private static readonly MIN_SYNOPSIS_LENGTH = 1
  private static readonly MAX_SYNOPSIS_LENGTH = 500
  private static readonly MIN_PROTAGONIST_LENGTH = 1
  private static readonly MAX_PROTAGONIST_LENGTH = 50
  private static readonly MIN_SPECIES_LENGTH = 1
  private static readonly MAX_SPECIES_LENGTH = 50
  private static readonly MIN_CONCLUSION_LENGTH = 1
  private static readonly MAX_CONCLUSION_LENGTH = 1000
  private static readonly MIN_CHAPTERS = 1
  private static readonly MAX_CHAPTERS = 20

  private constructor(
    public readonly id: StoryId,
    public readonly slug: Slug,
    public readonly childAge: ChildAge,
    public readonly coverImageUrl: ImageUrl,
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
    private readonly _chapters: readonly Chapter[]
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
    coverImageUrl: ImageUrl,
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
    chapters: Chapter[]
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
      chapters
    )
  }

  /**
   * Validate all story invariants
   */
  private validate(): void {
    // Validate title length
    if (this.title.length < Story.MIN_TITLE_LENGTH || this.title.length > Story.MAX_TITLE_LENGTH) {
      throw new DomainException(
        `Title must be between ${Story.MIN_TITLE_LENGTH} and ${Story.MAX_TITLE_LENGTH} characters`
      )
    }

    // Validate synopsis length
    if (
      this.synopsis.length < Story.MIN_SYNOPSIS_LENGTH ||
      this.synopsis.length > Story.MAX_SYNOPSIS_LENGTH
    ) {
      throw new DomainException(
        `Synopsis must be between ${Story.MIN_SYNOPSIS_LENGTH} and ${Story.MAX_SYNOPSIS_LENGTH} characters`
      )
    }

    // Validate protagonist length
    if (
      this.protagonist.length < Story.MIN_PROTAGONIST_LENGTH ||
      this.protagonist.length > Story.MAX_PROTAGONIST_LENGTH
    ) {
      throw new DomainException(
        `Protagonist must be between ${Story.MIN_PROTAGONIST_LENGTH} and ${Story.MAX_PROTAGONIST_LENGTH} characters`
      )
    }

    // Validate species length
    if (
      this.species.length < Story.MIN_SPECIES_LENGTH ||
      this.species.length > Story.MAX_SPECIES_LENGTH
    ) {
      throw new DomainException(
        `Species must be between ${Story.MIN_SPECIES_LENGTH} and ${Story.MAX_SPECIES_LENGTH} characters`
      )
    }

    // Validate conclusion length
    if (
      this.conclusion.length < Story.MIN_CONCLUSION_LENGTH ||
      this.conclusion.length > Story.MAX_CONCLUSION_LENGTH
    ) {
      throw new DomainException(
        `Conclusion must be between ${Story.MIN_CONCLUSION_LENGTH} and ${Story.MAX_CONCLUSION_LENGTH} characters`
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
   * Get all chapters
   */
  public get chapters(): Chapter[] {
    return [...this._chapters]
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

  /**
   * Publish the story (make it public)
   * @throws DomainException if story has no chapters
   */
  public publish(): Story {
    if (this._chapters.length === 0) {
      throw new DomainException('Cannot publish story without chapters')
    }

    return new Story(
      this.id,
      this.slug,
      this.childAge,
      this.coverImageUrl,
      this.ownerId,
      this.publicationDate,
      PublicationStatus.public(),
      this.title,
      this.synopsis,
      this.protagonist,
      this.species,
      this.conclusion,
      this.theme,
      this.language,
      this.tone,
      this._chapters
    )
  }

  /**
   * Unpublish the story (make it private)
   */
  public unpublish(): Story {
    return new Story(
      this.id,
      this.slug,
      this.childAge,
      this.coverImageUrl,
      this.ownerId,
      this.publicationDate,
      PublicationStatus.private(),
      this.title,
      this.synopsis,
      this.protagonist,
      this.species,
      this.conclusion,
      this.theme,
      this.language,
      this.tone,
      this._chapters
    )
  }

  /**
   * Add a chapter to the story
   * @throws DomainException if adding would exceed max chapters
   */
  public addChapter(chapter: Chapter): Story {
    if (this._chapters.length >= Story.MAX_CHAPTERS) {
      throw new DomainException(
        `Cannot add chapter: Story already has maximum of ${Story.MAX_CHAPTERS} chapters`
      )
    }

    return new Story(
      this.id,
      this.slug,
      this.childAge,
      this.coverImageUrl,
      this.ownerId,
      this.publicationDate,
      this._publicationStatus,
      this.title,
      this.synopsis,
      this.protagonist,
      this.species,
      this.conclusion,
      this.theme,
      this.language,
      this.tone,
      [...this._chapters, chapter]
    )
  }

  /**
   * Get a specific chapter by ID
   */
  public getChapter(chapterId: number): Chapter | undefined {
    return this._chapters.find((chapter) => chapter.id.getValue() === chapterId)
  }

  /**
   * Get all chapters
   */
  public getAllChapters(): Chapter[] {
    return [...this._chapters]
  }
}