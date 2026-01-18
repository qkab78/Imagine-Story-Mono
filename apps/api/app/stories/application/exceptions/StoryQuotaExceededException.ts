import { ApplicationException } from './ApplicationException.js'

/**
 * Story Quota Exceeded Exception
 *
 * Thrown when a free user attempts to create more stories than their monthly limit.
 */
export class StoryQuotaExceededException extends ApplicationException {
  public readonly currentCount: number
  public readonly limit: number
  public readonly resetDate: Date

  constructor(userId: string, currentCount: number, limit: number, resetDate: Date) {
    super(
      `User "${userId}" has reached their monthly story limit (${currentCount}/${limit}). Quota resets on ${resetDate.toISOString()}`,
      'STORY_QUOTA_EXCEEDED',
      403
    )
    this.name = 'StoryQuotaExceededException'
    this.currentCount = currentCount
    this.limit = limit
    this.resetDate = resetDate
  }
}
