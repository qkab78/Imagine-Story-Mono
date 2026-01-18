import type { StoryDetailDTO, StoryListItemDTO, StoryCreatedResponse, ApiErrorResponse } from './storyTypes'
import type { ThemeDTO, LanguageDTO, ToneDTO } from './storyTypes'
import type { CreateStoryPayload } from './storyTypes'
import type { StoryQuotaDTO, QuotaApiResponse } from './quotaTypes'
import { STORY_ENDPOINTS } from './storyEndpoints'

/**
 * Story API Client
 *
 * Provides functions for interacting with the story API.
 */

/**
 * Get latest public stories
 */
export const getLatestStories = async (token: string): Promise<StoryListItemDTO[]> => {
  if (!token) {
    throw new Error('No token provided')
  }

  const response = await fetch(STORY_ENDPOINTS.STORIES_LATEST, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}))
    throw new Error(error.message || `Failed to fetch latest stories: ${response.statusText}`)
  }

  // Backend returns { stories: Story[] } from clean architecture use case
  const data = await response.json()
  return data.stories || data
}

/**
 * Get stories by authenticated user ID
 */
export const getStoriesByAuthenticatedUserId = async (token: string): Promise<StoryListItemDTO[]> => {
  if (!token) {
    throw new Error('No token provided')
  }

  const response = await fetch(STORY_ENDPOINTS.STORIES_USER, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}))
    throw new Error(error.message || `Failed to fetch user stories: ${response.statusText}`)
  }

  // Backend returns { stories: Story[], total, page, limit, totalPages } from clean architecture use case
  const data = await response.json()
  return data.stories || data
}

/**
 * Get all public stories
 */
export const getStories = async (token: string): Promise<StoryListItemDTO[]> => {
  const response = await fetch(STORY_ENDPOINTS.STORIES, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}))
    throw new Error(error.message || `Failed to fetch stories: ${response.statusText}`)
  }

  // Backend returns { stories: Story[], total, page, limit, totalPages } from clean architecture use case
  const data = await response.json()
  return data.stories || data
}

/**
 * Get suggested stories based on search query
 */
export const getSuggestedStories = async (token: string, query: string): Promise<Pick<StoryListItemDTO, 'id' | 'slug' | 'title' | 'coverImageUrl'>[]> => {
  const response = await fetch(STORY_ENDPOINTS.STORIES_SEARCH(query), {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}))
    throw new Error(error.message || `Failed to fetch suggested stories: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Create a new story
 */
export const createStory = async (payload: CreateStoryPayload, token: string): Promise<StoryCreatedResponse> => {
  const response = await fetch(STORY_ENDPOINTS.STORIES, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}))
    throw new Error(error.message || error.errors?.join(', ') || `Failed to create story: ${response.statusText}`)
  }

  const data = await response.json()
  return data as StoryCreatedResponse
}

/**
 * Get story by slug
 */
export const getStoryBySlug = async (slug: string): Promise<StoryDetailDTO> => {
  const response = await fetch(STORY_ENDPOINTS.STORY_BY_SLUG(slug))

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}))
    throw new Error(error.message || `Failed to fetch story: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get story by ID
 */
export const getStoryById = async (id: string): Promise<StoryDetailDTO> => {
  const response = await fetch(STORY_ENDPOINTS.STORY_BY_ID(id))

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}))
    throw new Error(error.message || `Failed to fetch story: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Generation Status Response
 */
export interface GenerationStatusResponse {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  jobId?: string
  startedAt?: string
  completedAt?: string
  error?: string
  isCompleted: boolean
  isFailed: boolean
  isPending: boolean
  isProcessing: boolean
}

/**
 * Get story generation status
 */
export const getStoryGenerationStatus = async (storyId: string, token: string): Promise<GenerationStatusResponse> => {
  if (!token) {
    throw new Error('No token provided')
  }

  const response = await fetch(STORY_ENDPOINTS.STORY_GENERATION_STATUS(storyId), {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}))
    throw new Error(error.message || `Failed to fetch generation status: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data
}

/**
 * Get all available themes
 */
export const getThemes = async (): Promise<ThemeDTO[]> => {
  const response = await fetch(STORY_ENDPOINTS.THEMES)

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}))
    throw new Error(error.message || `Failed to fetch themes: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get all available tones
 */
export const getTones = async (): Promise<ToneDTO[]> => {
  const response = await fetch(STORY_ENDPOINTS.TONES)

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}))
    throw new Error(error.message || `Failed to fetch tones: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get all available languages
 */
export const getLanguages = async (): Promise<LanguageDTO[]> => {
  const response = await fetch(STORY_ENDPOINTS.LANGUAGES)

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}))
    throw new Error(error.message || `Failed to fetch languages: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get user's story creation quota
 */
export const getStoryQuota = async (token: string): Promise<StoryQuotaDTO> => {
  if (!token) {
    throw new Error('No token provided')
  }

  const response = await fetch(STORY_ENDPOINTS.STORIES_QUOTA, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}))
    throw new Error(error.message || `Failed to fetch quota: ${response.statusText}`)
  }

  const data: QuotaApiResponse = await response.json()
  return data.data
}
