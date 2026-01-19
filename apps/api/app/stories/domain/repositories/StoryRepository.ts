import { Story } from '#stories/domain/entities/story.entity'
import { StoryId } from '#stories/domain/value-objects/ids/StoryId.vo'
import { Slug } from '#stories/domain/value-objects/metadata/Slug.vo'
import { OwnerId } from '#stories/domain/value-objects/ids/OwnerId.vo'
import { GenerationStatus } from '#stories/domain/value-objects/metadata/GenerationStatus.vo'
import type { StoryFilters, PaginationParams, PaginatedResult } from '#stories/application/use-cases/story/ListPublicStoriesUseCase'

/**
 * Story Repository Interface
 *
 * Defines all operations for persisting and retrieving Story aggregates.
 */
export abstract class IStoryRepository {
  // Queries
  abstract findById(id: StoryId | string): Promise<Story | null>
  abstract findBySlug(slug: Slug): Promise<Story | null>
  abstract findByOwnerId(
    ownerId: OwnerId,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Story>>
  abstract findPublicStories(
    filters: StoryFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Story>>
  abstract existsBySlug(slug: Slug, excludeId?: StoryId): Promise<boolean>

  // Queue-related queries
  abstract findByJobId(jobId: string): Promise<Story | null>
  abstract findPendingStories(): Promise<Story[]>
  abstract findByGenerationStatus(status: GenerationStatus): Promise<Story[]>

  // Quota-related queries
  abstract countByOwnerIdAndDateRange(
    ownerId: OwnerId,
    startDate: Date,
    endDate: Date
  ): Promise<number>

  // Search queries
  abstract searchByTitle(query: string, limit?: number): Promise<Story[]>

  // Commands
  abstract create(story: Story): Promise<Story>
  abstract save(story: Story): Promise<void>
  abstract delete(id: StoryId): Promise<void>

  // Legacy (deprecated - kept for backward compatibility)
  abstract findAll(limit?: number, offset?: number): Promise<{ stories: Story[]; total: number }>
}