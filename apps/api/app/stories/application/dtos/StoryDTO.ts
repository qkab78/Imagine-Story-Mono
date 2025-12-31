/**
 * Story DTOs
 *
 * Data Transfer Objects for Story responses
 */

/**
 * Story Created DTO
 *
 * Minimal response after creating a story
 */
export interface StoryCreatedDTO {
  id: string
  slug: string
  title: string
  createdAt: Date
}

/**
 * Story List Item DTO
 *
 * Summary for list views (without chapters)
 */
export interface StoryListItemDTO {
  id: string
  slug: string
  title: string
  synopsis: string
  protagonist: string
  species: string
  childAge: number
  coverImageUrl: string
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
 * Story Detail DTO
 *
 * Complete story with chapters
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
  coverImageUrl: string
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

/**
 * Chapter DTO
 */
export interface ChapterDTO {
  id: number
  position: number
  title: string
  content: string
  image: {
    url: string
  } | null
}

/**
 * Theme DTO
 */
export interface ThemeDTO {
  id: string
  name: string
  description: string
}

/**
 * Language DTO
 */
export interface LanguageDTO {
  id: string
  name: string
  code: string
  isFree: boolean
}

/**
 * Tone DTO
 */
export interface ToneDTO {
  id: string
  name: string
  description: string
}
