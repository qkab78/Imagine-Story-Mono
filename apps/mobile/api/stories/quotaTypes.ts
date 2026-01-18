/**
 * Story Quota Types
 *
 * Types for story creation quota management
 */

export interface StoryQuotaDTO {
  storiesCreatedThisMonth: number
  limit: number | null // null = unlimited
  remaining: number | null // null = unlimited
  resetDate: string | null // ISO date string, null = no reset (unlimited)
  isUnlimited: boolean
  canCreate: boolean
}

export interface QuotaApiResponse {
  data: StoryQuotaDTO
}

export interface QuotaExceededError {
  error: {
    code: 'STORY_QUOTA_EXCEEDED'
    message: string
  }
}
