import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { IDateService } from '#stories/domain/services/i_date_service'
import type { Story } from '#stories/domain/entities/story.entity'

/**
 * Get Story of the Day Use Case
 *
 * Retrieves a single completed public story deterministically selected for the current day.
 * The selection is consistent throughout the day (same story returned for the same date).
 * Used by the widget to display the "story of the day".
 */
@inject()
export class GetStoryOfTheDayUseCase {
  constructor(
    private readonly storyRepository: IStoryRepository,
    private readonly dateService: IDateService
  ) {}

  async execute(): Promise<Story | null> {
    const today = new Date(this.dateService.now())
    return this.storyRepository.findStoryOfTheDay(today)
  }
}
