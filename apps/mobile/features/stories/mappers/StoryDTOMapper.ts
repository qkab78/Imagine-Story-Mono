import { Story } from '@/domain/stories/entities/Story'
import { Chapter } from '@/domain/stories/entities/Chapter'
import { StoryId } from '@/domain/stories/value-objects/ids/StoryId'
import { ChapterId } from '@/domain/stories/value-objects/ids/ChapterId'
import { OwnerId } from '@/domain/stories/value-objects/ids/OwnerId'
import { Slug } from '@/domain/stories/value-objects/metadata/Slug'
import { ChildAge } from '@/domain/stories/value-objects/metadata/ChildAge'
import { ImageUrl } from '@/domain/stories/value-objects/media/ImageUrl'
import { PublicationDate } from '@/domain/stories/value-objects/metadata/PublicationDate'
import { PublicationStatus } from '@/domain/stories/value-objects/metadata/PublicationStatus'
import { GenerationStatus } from '@/domain/stories/value-objects/metadata/GenerationStatus'
import { Theme } from '@/domain/stories/value-objects/settings/Theme'
import { Language } from '@/domain/stories/value-objects/settings/Language'
import { Tone } from '@/domain/stories/value-objects/settings/Tone'
import { ChapterImage } from '@/domain/stories/entities/Chapter'

/**
 * Backend DTO interfaces (matching backend structure)
 */
export interface StoryDetailDTO {
  id: string
  slug: string
  title: string
  synopsis: string
  protagonist: string
  species: string
  conclusion: string
  childAge: number
  coverImageUrl: string | null
  isPublic: boolean
  publicationDate: Date
  theme: {
    id: string
    name: string
    description: string
  }
  language: {
    id: string
    name: string
    code: string
    isFree: boolean
  }
  tone: {
    id: string
    name: string
    description: string
  }
  ownerId: string
  chapters: ChapterDTO[]
}

export interface ChapterDTO {
  id: number
  position: number
  title: string
  content: string
  image: {
    url: string
  } | null
}

export interface StoryListItemDTO {
  id: string
  slug: string
  title: string
  synopsis: string
  protagonist: string
  species: string
  childAge: number
  coverImageUrl: string | null
  isPublic: boolean
  publicationDate: Date
  theme: {
    id: string
    name: string
    description: string
  }
  language: {
    id: string
    name: string
    code: string
    isFree: boolean
  }
  tone: {
    id: string
    name: string
    description: string
  }
  ownerId: string
  numberOfChapters: number
}

/**
 * Story DTO Mapper
 *
 * Maps backend DTOs to frontend domain entities.
 */
export class StoryDTOMapper {
  /**
   * Map backend StoryDetailDTO to frontend Story entity
   * @param dto Backend StoryDetailDTO
   * @returns Frontend Story entity
   */
  public static toDomain(dto: StoryDetailDTO): Story {
    const chapters = dto.chapters.map((chapterDto) =>
      this.chapterDTOToDomain(chapterDto)
    )

    // Handle publicationDate - it might be a string or Date object from the API
    const publicationDateString = typeof dto.publicationDate === 'string'
      ? dto.publicationDate
      : dto.publicationDate?.toISOString()

    return Story.create(
      StoryId.create(dto.id),
      Slug.create(dto.slug),
      ChildAge.create(dto.childAge),
      dto.coverImageUrl ? ImageUrl.create(dto.coverImageUrl) : null,
      OwnerId.create(dto.ownerId),
      PublicationDate.fromString(publicationDateString),
      PublicationStatus.fromBoolean(dto.isPublic),
      dto.title,
      dto.synopsis,
      dto.protagonist,
      dto.species,
      dto.conclusion,
      Theme.create(dto.theme.id, dto.theme.name, dto.theme.description),
      Language.create(
        dto.language.id,
        dto.language.name,
        dto.language.code,
        dto.language.isFree
      ),
      Tone.create(dto.tone.id, dto.tone.name, dto.tone.description),
      chapters,
      GenerationStatus.completed() // Default to completed for fetched stories
    )
  }

  /**
   * Map backend ChapterDTO to frontend Chapter entity
   * @param dto Backend ChapterDTO
   * @returns Frontend Chapter entity
   */
  private static chapterDTOToDomain(dto: ChapterDTO): Chapter {
    const chapterId = ChapterId.create(dto.position)
    const image = dto.image
      ? ChapterImage.create(chapterId, ImageUrl.create(dto.image.url))
      : null

    return Chapter.create(chapterId, dto.title, dto.content, image)
  }

  /**
   * Map backend StoryListItemDTO to frontend Story entity (without chapters)
   * Note: This creates a Story with empty chapters array since list items don't include chapters
   * @param dto Backend StoryListItemDTO
   * @returns Frontend Story entity
   */
  public static listItemToDomain(dto: StoryListItemDTO): Story {
    // List items don't have chapters, so we create an empty array
    // The actual chapters will be loaded when viewing the story detail

    // Handle publicationDate - it might be a string or Date object from the API
    const publicationDateString = typeof dto.publicationDate === 'string'
      ? dto.publicationDate
      : dto.publicationDate.toISOString()

    return Story.create(
      StoryId.create(dto.id),
      Slug.create(dto.slug),
      ChildAge.create(dto.childAge),
      dto.coverImageUrl ? ImageUrl.create(dto.coverImageUrl) : null,
      OwnerId.create(dto.ownerId),
      PublicationDate.fromString(publicationDateString),
      PublicationStatus.fromBoolean(dto.isPublic),
      dto.title,
      dto.synopsis,
      dto.protagonist,
      dto.species,
      '', // Conclusion not available in list items
      Theme.create(dto.theme.id, dto.theme.name, dto.theme.description),
      Language.create(
        dto.language.id,
        dto.language.name,
        dto.language.code,
        dto.language.isFree
      ),
      Tone.create(dto.tone.id, dto.tone.name, dto.tone.description),
      [], // Empty chapters array for list items
      GenerationStatus.completed()
    )
  }
}
