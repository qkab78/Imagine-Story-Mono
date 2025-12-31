import { Story } from '../entities/story.entity.js'
import { StoryId } from '../value-objects/ids/StoryId.vo.js'
import { OwnerId } from '../value-objects/ids/OwnerId.vo.js'
import { Slug } from '../value-objects/metadata/Slug.vo.js'
import { ChildAge } from '../value-objects/metadata/ChildAge.vo.js'
import { ImageUrl } from '../value-objects/media/ImageUrl.vo.js'
import { PublicationDate } from '../value-objects/metadata/PublicationDate.vo.js'
import { PublicationStatus } from '../value-objects/metadata/PublicationStatus.vo.js'
import type { Theme } from '../value-objects/settings/Theme.vo.js'
import type { Language } from '../value-objects/settings/Language.vo.js'
import type { Tone } from '../value-objects/settings/Tone.vo.js'
import type { Chapter } from '../entities/chapter.entity.js'
import { IDateService } from '../services/IDateService.js'
import { IRandomService } from '../services/IRandomService.js'

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
  public static create(dateService: IDateService, randomService: IRandomService, params: {
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
  }): Story {
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
      params.chapters
    )
  }
}
