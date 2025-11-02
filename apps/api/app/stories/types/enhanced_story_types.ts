/**
 * Types pour les fonctionnalités étendues de génération d'histoires
 */

import { Timestamp, Json } from '../../../types/db.js'

export interface Character {
  id?: string
  story_id?: string
  name: string
  role: 'protagonist' | 'antagonist' | 'supporting' | 'secondary'
  description: string
  personality_traits: string[]
  physical_appearance: {
    age?: string
    height?: string
    build?: string
    hair?: string
    eyes?: string
    clothing?: string
    distinctive_features?: string[]
  }
  background_story: string
  character_image?: string
  created_at?: Timestamp
  updated_at?: Timestamp
}

export interface ChapterImage {
  chapterIndex: number
  chapterTitle: string
  imagePath: string
  imageUrl: string
  prompt: string
  generatedAt: string
}

export interface GeneratedCharacter {
  name: string
  role: string
  description: string
  personalityTraits: string[]
  physicalAppearance: {
    age?: string
    height?: string
    build?: string
    hair?: string
    eyes?: string
    clothing?: string
    distinctiveFeatures?: string[]
  }
  backgroundStory: string
}

export interface StoryGenerationContext {
  title: string
  synopsis: string
  theme: string
  protagonist: string
  childAge: number
  numberOfChapters: number
  language: string
  tone: string
  species: string
}

export interface ExtendedStoryData {
  id: string
  title: string
  content: string
  synopsis: string
  cover_image: string
  slug: string
  chapters: number
  story_chapters: Json
  chapter_images: ChapterImage[]
  conclusion: string
  protagonist: string
  theme: string
  child_age: number
  language: string
  tone: string
  species: string
  public: boolean
  user_id: string
  created_at: Timestamp
  updated_at: Timestamp
  characters?: Character[]
}

export interface CharacterGenerationResponse {
  characters: GeneratedCharacter[]
  metadata: {
    generatedAt: string
    model: string
    prompt: string
  }
}

export interface ChapterImageGenerationResponse {
  images: ChapterImage[]
  metadata: {
    generatedAt: string
    model: string
    totalImages: number
    successfulGeneration: number
    errors?: string[]
  }
}

export interface StoryGenerationPayload {
  title?: string
  synopsis?: string
  theme?: string
  protagonist?: string
  childAge?: number
  numberOfChapters?: number
  language?: string
  tone?: string
  species?: string
  isPrivate?: boolean
  generateCharacters?: boolean
  generateChapterImages?: boolean
}

export interface DatabaseCharacter {
  id: string
  story_id: string
  name: string
  role: string
  description: string | null
  personality_traits: Json | null
  physical_appearance: Json | null
  background_story: string | null
  character_image: string | null
  created_at: Timestamp
  updated_at: Timestamp
}

// Type guards
export function isGeneratedCharacter(obj: any): obj is GeneratedCharacter {
  return (
    obj &&
    typeof obj.name === 'string' &&
    typeof obj.role === 'string' &&
    typeof obj.description === 'string' &&
    Array.isArray(obj.personalityTraits) &&
    typeof obj.physicalAppearance === 'object' &&
    typeof obj.backgroundStory === 'string'
  )
}

export function isChapterImage(obj: any): obj is ChapterImage {
  return (
    obj &&
    typeof obj.chapterIndex === 'number' &&
    typeof obj.chapterTitle === 'string' &&
    typeof obj.imagePath === 'string' &&
    typeof obj.imageUrl === 'string'
  )
}
