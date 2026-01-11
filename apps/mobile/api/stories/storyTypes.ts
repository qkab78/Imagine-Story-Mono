/**
 * Story API Types
 *
 * Type definitions matching backend DTOs
 */

import type { StoryDetailDTO, StoryListItemDTO, ChapterDTO } from '@/features/stories/mappers/StoryDTOMapper'
import type { ThemeDTO, LanguageDTO, ToneDTO } from '@/features/stories/mappers/ThemeLanguageToneMapper'
import type { CreateStoryPayload } from '@/features/stories/mappers/StoryFormMapper'

export type { StoryDetailDTO, StoryListItemDTO, ChapterDTO, CreateStoryPayload }
export type { ThemeDTO, LanguageDTO, ToneDTO }

/**
 * Story Created Response (from backend)
 */
export interface StoryCreatedResponse {
  id: string
  slug: string
  title: string
  createdAt: Date
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  errors?: string[]
  message?: string
  code?: string
}
