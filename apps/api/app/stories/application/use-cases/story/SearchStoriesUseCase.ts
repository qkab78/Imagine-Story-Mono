import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import type { Story } from '#stories/domain/entities/story.entity'

export interface SearchStoriesPayload {
  query: string
  limit?: number
}

/**
 * Search Stories Use Case
 *
 * Searches for stories by title using a partial match query.
 */
@inject()
export class SearchStoriesUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(payload: SearchStoriesPayload): Promise<Story[]> {
    return this.storyRepository.searchByTitle(payload.query, payload.limit ?? 50)
  }
}
