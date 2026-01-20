import { Story } from '../entities/story.entity.js'
import { StoryId } from '../value-objects/ids/story_id.vo.js'
import { OwnerId } from '../value-objects/ids/owner_id.vo.js'
import { Slug } from '../value-objects/metadata/slug.vo.js'
import { ChildAge } from '../value-objects/metadata/child_age.vo.js'
import { ImageUrl } from '../value-objects/media/image_url.vo.js'
import { PublicationDate } from '../value-objects/metadata/publication_date.vo.js'
import { PublicationStatus } from '../value-objects/metadata/publication_status.vo.js'
import { GenerationStatus } from '../value-objects/metadata/generation_status.vo.js'
import type { Theme } from '../value-objects/settings/theme.vo.js'
import type { Language } from '../value-objects/settings/language.vo.js'
import type { Tone } from '../value-objects/settings/tone.vo.js'
import type { Chapter } from '../entities/chapter.entity.js'
import { IDateService } from '../services/i_date_service.js'
import { IRandomService } from '../services/i_random_service.js'

/**
 * Story Factory
 *
 * Responsible for complex Story entity creation.
 * Handles value object construction and provides convenient factory methods.
 */
export class StoryFactory {
  /**
   * Create a new Story with generated ID and current date
   */
  public static create(
    dateService: IDateService,
    randomService: IRandomService,
    params: {
      title: string
      synopsis: string
      protagonist: string
      childAge: number
      species: string
      conclusion: string
      coverImageUrl: string
      ownerId: string
      isPublic: boolean
      theme: Theme
      language: Language
      tone: Tone
      chapters: Chapter[]
    }
  ): Story {
    return Story.create(
      StoryId.generate(randomService),
      Slug.fromTitle(params.title),
      ChildAge.create(params.childAge),
      ImageUrl.create(params.coverImageUrl),
      OwnerId.create(params.ownerId),
      PublicationDate.now(dateService),
      params.isPublic ? PublicationStatus.public() : PublicationStatus.private(),
      params.title,
      params.synopsis,
      params.protagonist,
      params.species,
      params.conclusion,
      params.theme,
      params.language,
      params.tone,
      params.chapters
    )
  }

  /**
   * Create a new Story in pending state (waiting for generation)
   */
  public static createPending(
    dateService: IDateService,
    randomService: IRandomService,
    params: {
      title: string
      synopsis: string
      protagonist: string
      childAge: number
      species: string
      ownerId: string
      isPublic: boolean
      theme: Theme
      language: Language
      tone: Tone
      isGenerated: boolean
    }
  ): Story {
    return Story.create(
      StoryId.generate(randomService),
      Slug.fromTitle(params.title),
      ChildAge.create(params.childAge),
      null, // Vide tant que pas généré
      OwnerId.create(params.ownerId),
      PublicationDate.now(dateService),
      params.isPublic ? PublicationStatus.public() : PublicationStatus.private(),
      params.title,
      params.synopsis,
      params.protagonist,
      params.species,
      '', // conclusion vide
      params.theme,
      params.language,
      params.tone,
      [], // chapters vide
      GenerationStatus.pending(), // Status pending
      null, // jobId
      null, // generationStartedAt
      null, // generationCompletedAt
      null, // generationError
      params.isGenerated
    )
  }

  /**
   * Reconstruct a Story from database data
   */
  public static reconstitute(params: {
    id: string
    slug: string
    title: string
    synopsis: string
    protagonist: string
    childAge: number
    species: string
    conclusion: string
    coverImageUrl: string
    ownerId: string
    isPublic: boolean
    publicationDate: Date
    theme: Theme
    language: Language
    tone: Tone
    chapters: Chapter[]
    generationStatus?: string
    jobId?: string | null
    generationStartedAt?: Date | null
    generationCompletedAt?: Date | null
    generationError?: string | null
  }): Story {
    return Story.create(
      StoryId.create(params.id),
      Slug.create(params.slug),
      ChildAge.create(params.childAge),
      ImageUrl.create(params.coverImageUrl),
      OwnerId.create(params.ownerId),
      PublicationDate.create(params.publicationDate),
      params.isPublic ? PublicationStatus.public() : PublicationStatus.private(),
      params.title,
      params.synopsis,
      params.protagonist,
      params.species,
      params.conclusion,
      params.theme,
      params.language,
      params.tone,
      params.chapters,
      params.generationStatus
        ? GenerationStatus.create(params.generationStatus as any)
        : GenerationStatus.completed(),
      params.jobId ?? null,
      params.generationStartedAt ?? null,
      params.generationCompletedAt ?? null,
      params.generationError ?? null
    )
  }
}
