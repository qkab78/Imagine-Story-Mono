import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { Slug } from '#stories/domain/value-objects/metadata/slug.vo'
import type { Story } from '#stories/domain/entities/story.entity'

/**
 * Get Story By Slug Use Case
 *
 * Retrieves a story by its slug (URL-friendly identifier).
 * Used for SEO-friendly public URLs.
 */
@inject()
export class GetStoryBySlugUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(slug: string): Promise<Story | null> {
    // 1. Create Slug value object with validation
    const storySlug = Slug.create(slug)

    // 2. Find story by slug
    const story = await this.storyRepository.findBySlug(storySlug)

    if (!story) {
      return null
    }

    // 3. Return story entity (presenter will transform to DTO at controller level)
    return story
  }
}
