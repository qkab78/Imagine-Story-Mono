import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import type { Story } from '#stories/domain/entities/story.entity'
import { ThemeId } from '#stories/domain/value-objects/ids/theme_id.vo'
import { LanguageId } from '#stories/domain/value-objects/ids/language_id.vo'
import { ToneId } from '#stories/domain/value-objects/ids/tone_id.vo'
import { ChildAge } from '#stories/domain/value-objects/metadata/child_age.vo'

/**
 * Story Filters
 */
export interface StoryFilters {
  themeId?: ThemeId
  languageId?: LanguageId
  toneId?: ToneId
  childAge?: ChildAge
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
  page: number
  limit: number
}

/**
 * Paginated Result
 */
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

/**
 * List Public Stories Use Case
 *
 * Retrieves all public stories with optional filtering and pagination.
 * Used for public story browsing, discovery, and search.
 *
 * Supports filtering by:
 * - Theme (e.g., "Adventure", "Fantasy")
 * - Language (e.g., "en", "fr")
 * - Tone (e.g., "Happy", "Educational")
 * - Child Age (e.g., 3-10 years old)
 */
@inject()
export class ListPublicStoriesUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(params: {
    themeId?: string
    languageId?: string
    toneId?: string
    childAge?: number
    page?: number
    limit?: number
  }): Promise<{
    stories: Story[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    // 1. Build filters from parameters
    const filters: StoryFilters = {}

    if (params.themeId) {
      filters.themeId = ThemeId.create(params.themeId)
    }

    if (params.languageId) {
      filters.languageId = LanguageId.create(params.languageId)
    }

    if (params.toneId) {
      filters.toneId = ToneId.create(params.toneId)
    }

    if (params.childAge) {
      filters.childAge = ChildAge.create(params.childAge)
    }

    // 2. Setup pagination
    const pagination: PaginationParams = {
      page: params.page || 1,
      limit: params.limit || 10,
    }

    // 3. Fetch public stories with filters and pagination
    const result = await this.storyRepository.findPublicStories(filters, pagination)

    // 4. Return paginated result
    return {
      stories: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    }
  }
}
