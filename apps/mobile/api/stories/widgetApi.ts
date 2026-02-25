import type { StoryListItemDTO, ApiErrorResponse } from './storyTypes'
import { STORY_ENDPOINTS } from './storyEndpoints'

/**
 * Widget API Client
 *
 * Provides functions for widget-specific API calls.
 */

/**
 * Get the story of the day
 */
export const getStoryOfTheDay = async (): Promise<StoryListItemDTO | null> => {
  const response = await fetch(STORY_ENDPOINTS.WIDGET_STORY_OF_THE_DAY)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}))
    throw new Error(error.message || `Failed to fetch story of the day: ${response.statusText}`)
  }

  const data = await response.json()
  return data.story
}
