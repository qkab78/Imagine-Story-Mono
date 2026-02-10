/**
 * Story Formatter Service
 *
 * Provides formatting utilities for story display.
 */
export class StoryFormatterService {
  /**
   * Format a date as "time ago" string
   * @param date Date string or Date object
   * @returns Formatted time ago string
   */
  public static formatTimeAgo(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return 'Hier'
    } else if (diffInHours < 48) {
      return '2j'
    } else if (diffInHours < 168) {
      return '1sem'
    } else {
      return 'Plus ancien'
    }
  }

}
