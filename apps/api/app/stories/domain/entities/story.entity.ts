import type { Chapter } from './chapter.entity.js'
import type { Theme } from '../value-objects/settings/theme.vo.js'
import type { Language } from '../value-objects/settings/language.vo.js'
import type { Tone } from '../value-objects/settings/tone.vo.js'
import type { StoryId } from '../value-objects/ids/story_id.vo.js'
import type { OwnerId } from '../value-objects/ids/owner_id.vo.js'
import type { Slug } from '../value-objects/metadata/slug.vo.js'
import type { ChildAge } from '../value-objects/metadata/child_age.vo.js'
import type { ImageUrl } from '../value-objects/media/image_url.vo.js'
import type { PublicationDate } from '../value-objects/metadata/publication_date.vo.js'
import { PublicationStatus } from '../value-objects/metadata/publication_status.vo.js'
import { GenerationStatus } from '../value-objects/metadata/generation_status.vo.js'
import { DomainException } from '../exceptions/domain_exception.js'
import { InvariantViolationException } from '../exceptions/invariant_violation_exception.js'

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
  // private static readonly MIN_SYNOPSIS_LENGTH = 1
  // private static readonly MAX_SYNOPSIS_LENGTH = 500
  private static readonly MIN_PROTAGONIST_LENGTH = 1
  private static readonly MAX_PROTAGONIST_LENGTH = 50
  private static readonly MIN_SPECIES_LENGTH = 1
  private static readonly MAX_SPECIES_LENGTH = 50
  // private static readonly MIN_CONCLUSION_LENGTH = 1
  // private static readonly MAX_CONCLUSION_LENGTH = 1000
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
    private _generationStatus: GenerationStatus,
    private _jobId: string | null = null,
    private _generationStartedAt: Date | null = null,
    private _generationCompletedAt: Date | null = null,
    private _generationError: string | null = null,
    private _isGenerated: boolean = false
  ) {
    if (this._isGenerated) {
      this.validate()
    }
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
    generationStatus: GenerationStatus = GenerationStatus.completed(),
    jobId: string | null = null,
    generationStartedAt: Date | null = null,
    generationCompletedAt: Date | null = null,
    generationError: string | null = null,
    isGenerated: boolean = false
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
      generationStatus,
      jobId,
      generationStartedAt,
      generationCompletedAt,
      generationError,
      isGenerated
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
    // if (
    //   this.synopsis.length < Story.MIN_SYNOPSIS_LENGTH ||
    //   this.synopsis.length > Story.MAX_SYNOPSIS_LENGTH
    // ) {
    //   throw new DomainException(
    //     `Synopsis must be between ${Story.MIN_SYNOPSIS_LENGTH} and ${Story.MAX_SYNOPSIS_LENGTH} characters`
    //   )
    // }

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
    // if (
    //   this.conclusion.length < Story.MIN_CONCLUSION_LENGTH ||
    //   this.conclusion.length > Story.MAX_CONCLUSION_LENGTH
    // ) {
    //   throw new DomainException(
    //     `Conclusion must be between ${Story.MIN_CONCLUSION_LENGTH} and ${Story.MAX_CONCLUSION_LENGTH} characters`
    //   )
    // }

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
   * Get job ID
   */
  public get jobId(): string | null {
    return this._jobId
  }

  /**
   * Get generation started at
   */
  public get generationStartedAt(): Date | null {
    return this._generationStartedAt
  }

  /**
   * Get generation completed at
   */
  public get generationCompletedAt(): Date | null {
    return this._generationCompletedAt
  }

  /**
   * Get generation error
   */
  public get generationError(): string | null {
    return this._generationError
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
      this._chapters,
      this._generationStatus,
      this._jobId,
      this._generationStartedAt,
      this._generationCompletedAt,
      this._generationError,
      this._isGenerated
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
      this._chapters,
      this._generationStatus,
      this._jobId,
      this._generationStartedAt,
      this._generationCompletedAt,
      this._generationError,
      this._isGenerated
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
      [...this._chapters, chapter],
      this._generationStatus,
      this._jobId,
      this._generationStartedAt,
      this._generationCompletedAt,
      this._generationError,
      this._isGenerated
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

  /**
   * Start generation process
   * @throws InvariantViolationException if status is not pending
   */
  public startGeneration(jobId: string): void {
    if (!this._generationStatus.isPending()) {
      throw new InvariantViolationException('Can only start generation when status is pending')
    }
    this._generationStatus = GenerationStatus.processing()
    this._jobId = jobId
    this._generationStartedAt = new Date()
    this._generationError = null
  }

  /**
   * Complete generation process
   * @throws InvariantViolationException if status is not processing
   */
  public completeGeneration(
    chapters: Chapter[],
    coverImageUrl: ImageUrl,
    conclusion: string,
    title: string,
    slug: Slug
  ): Story {
    if (!this._generationStatus.isProcessing()) {
      throw new InvariantViolationException(
        'Can only complete generation when status is processing'
      )
    }

    return new Story(
      this.id,
      slug,
      this.childAge,
      coverImageUrl,
      this.ownerId,
      this.publicationDate,
      this._publicationStatus,
      title,
      this.synopsis,
      this.protagonist,
      this.species,
      conclusion,
      this.theme,
      this.language,
      this.tone,
      chapters,
      GenerationStatus.completed(),
      this._jobId,
      this._generationStartedAt,
      new Date(),
      null,
      true
    )
  }

  /**
   * Fail generation process
   * @throws InvariantViolationException if status is not processing
   */
  public failGeneration(error: string): void {
    if (!this._generationStatus.isProcessing()) {
      throw new InvariantViolationException('Can only fail generation when status is processing')
    }
    this._generationStatus = GenerationStatus.failed()
    this._generationCompletedAt = new Date()
    this._generationError = error
  }

  /**
   * Check if generation can be retried
   */
  public canRetryGeneration(): boolean {
    return this._generationStatus.isFailed()
  }

  /**
   * Update generated text content without marking as completed.
   * Used for incremental generation to save text before image generation.
   */
  public updateGeneratedText(
    chapters: Chapter[],
    conclusion: string,
    title: string,
    slug: Slug
  ): Story {
    return new Story(
      this.id,
      slug,
      this.childAge,
      this.coverImageUrl, // Keeps null
      this.ownerId,
      this.publicationDate,
      this._publicationStatus,
      title,
      this.synopsis,
      this.protagonist,
      this.species,
      conclusion,
      this.theme,
      this.language,
      this.tone,
      chapters,
      this._generationStatus, // Stays "processing"
      this._jobId,
      this._generationStartedAt,
      this._generationCompletedAt,
      this._generationError,
      false
    )
  }

  /**
   * Check if story has generated text content.
   * The initial title is a placeholder (e.g., "Story Wed Feb 05 2026...")
   * The generated title from OpenAI is different.
   */
  public hasGeneratedText(): boolean {
    const hasGeneratedTitle = !this.title.startsWith('Story ')
    return hasGeneratedTitle && this._chapters.length > 0 && this.conclusion !== ''
  }

  /**
   * Retry generation
   * @throws InvariantViolationException if status is not failed
   */
  public retryGeneration(): void {
    if (!this.canRetryGeneration()) {
      throw new InvariantViolationException('Can only retry generation when status is failed')
    }
    this._generationStatus = GenerationStatus.pending()
    this._generationStartedAt = null
    this._generationCompletedAt = null
    this._generationError = null
    this._jobId = null
  }
}
