/**
 * Story API Endpoints
 *
 * Centralized endpoint constants
 */

const apiUrl = process.env.EXPO_PUBLIC_API_URL

export const STORY_ENDPOINTS = {
  // Stories
  STORIES: `${apiUrl}/stories`,
  STORIES_LATEST: `${apiUrl}/stories/all/latest`,
  STORIES_USER: `${apiUrl}/stories/user/me`,
  STORY_BY_SLUG: (slug: string) => `${apiUrl}/stories/slug/${slug}`,
  STORY_BY_ID: (id: string) => `${apiUrl}/stories/${id}`,
  STORIES_SEARCH: (query: string) => `${apiUrl}/stories/search/suggestions?query=${encodeURIComponent(query)}`,
  
  // Settings
  THEMES: `${apiUrl}/stories/all/themes`,
  TONES: `${apiUrl}/stories/all/tones`,
  LANGUAGES: `${apiUrl}/stories/all/languages`,
} as const
