import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import { db } from '#services/db'
import { Story } from '#stories/domain/entities/story.entity'
import { StoryMapper } from '#stories/infrastructure/mappers/StoryMapper'
import { StoryId } from '#stories/domain/value-objects/ids/StoryId.vo'
import { Slug } from '#stories/domain/value-objects/metadata/Slug.vo'
import { OwnerId } from '#stories/domain/value-objects/ids/OwnerId.vo'
import { GenerationStatus } from '#stories/domain/value-objects/metadata/GenerationStatus.vo'
import type {
  StoryFilters,
  PaginationParams,
  PaginatedResult,
} from '#stories/application/use-cases/story/ListPublicStoriesUseCase'

/**
 * Kysely Story Repository
 *
 * PostgreSQL implementation using Kysely query builder
 */
export class KyselyStoryRepository implements IStoryRepository {
  /**
   * Find story by ID
   */
  async findById(id: StoryId | string): Promise<Story | null> {
    const idValue = typeof id === 'string' ? id : id.getValue()

    const storyRow = await db
      .selectFrom('stories')
      .where('id', '=', idValue)
      .selectAll()
      .executeTakeFirst()

    if (!storyRow) {
      return null
    }

    return this.mapRowToStory(storyRow)
  }

  /**
   * Find story by slug
   */
  async findBySlug(slug: Slug): Promise<Story | null> {
    const storyRow = await db
      .selectFrom('stories')
      .where('slug', '=', slug.getValue())
      .selectAll()
      .executeTakeFirst()

    if (!storyRow) {
      return null
    }

    return this.mapRowToStory(storyRow)
  }

  /**
   * Find stories by owner ID with pagination
   */
  async findByOwnerId(
    ownerId: OwnerId,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Story>> {
    const offset = (pagination.page - 1) * pagination.limit

    // Get total count
    const countResult = await db
      .selectFrom('stories')
      .where('user_id', '=', ownerId.getValue())
      .select(db.fn.count<number>('id').as('count'))
      .executeTakeFirst()

    const total = Number(countResult?.count || 0)

    // Get paginated stories
    const storyRows = await db
      .selectFrom('stories')
      .where('user_id', '=', ownerId.getValue())
      .selectAll()
      .orderBy('created_at', 'desc')
      .limit(pagination.limit)
      .offset(offset)
      .execute()

    const stories = await Promise.all(storyRows.map((row) => this.mapRowToStory(row)))

    return {
      data: stories,
      total,
      page: pagination.page,
      limit: pagination.limit,
    }
  }

  /**
   * Find public stories with filters and pagination
   */
  async findPublicStories(
    filters: StoryFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Story>> {
    const offset = (pagination.page - 1) * pagination.limit

    // Build query with filters
    let query = db.selectFrom('stories').where('public', '=', true)

    if (filters.themeId) {
      query = query.where('theme_id', '=', filters.themeId.getValue())
    }

    if (filters.languageId) {
      query = query.where('language_id', '=', filters.languageId.getValue())
    }

    if (filters.toneId) {
      query = query.where('tone_id', '=', filters.toneId.getValue())
    }

    if (filters.childAge) {
      query = query.where('child_age', '=', filters.childAge.getValue())
    }

    // Get total count
    const countResult = await query.select(db.fn.count<number>('id').as('count')).executeTakeFirst()

    const total = Number(countResult?.count || 0)

    // Get paginated stories
    const storyRows = await query
      .selectAll()
      .orderBy('created_at', 'desc')
      .limit(pagination.limit)
      .offset(offset)
      .execute()

    const stories = await Promise.all(storyRows.map((row) => this.mapRowToStory(row)))

    return {
      data: stories,
      total,
      page: pagination.page,
      limit: pagination.limit,
    }
  }

  /**
   * Check if slug exists (optionally excluding a specific story ID)
   */
  async existsBySlug(slug: Slug, excludeId?: StoryId): Promise<boolean> {
    let query = db.selectFrom('stories').where('slug', '=', slug.getValue())

    if (excludeId) {
      query = query.where('id', '!=', excludeId.getValue())
    }

    const result = await query.select('id').executeTakeFirst()

    return !!result
  }

  /**
   * Create a new story
   */
  async create(story: Story): Promise<Story> {
    const persistenceData = StoryMapper.toPersistence(story)

    await db.insertInto('stories').values(persistenceData).execute()

    return story
  }

  /**
   * Save (update) an existing story
   */
  async save(story: Story): Promise<void> {
    const persistenceData = StoryMapper.toPersistence(story)

    await db
      .updateTable('stories')
      .set(persistenceData)
      .where('id', '=', story.id.getValue())
      .execute()
  }

  /**
   * Delete a story by ID
   */
  async delete(id: StoryId): Promise<void> {
    await db.deleteFrom('stories').where('id', '=', id.getValue()).execute()
  }

  /**
   * Legacy method - find all with simple pagination
   * @deprecated Use findPublicStories or findByOwnerId instead
   */
  async findAll(limit?: number, offset?: number): Promise<{ stories: Story[]; total: number }> {
    // Get total count
    const countResult = await db
      .selectFrom('stories')
      .select(db.fn.count<number>('id').as('count'))
      .executeTakeFirst()

    const total = Number(countResult?.count || 0)

    // Get stories
    let query = db.selectFrom('stories').selectAll().orderBy('created_at', 'desc')

    if (limit !== undefined) {
      query = query.limit(limit)
    }

    if (offset !== undefined) {
      query = query.offset(offset)
    }

    const storyRows = await query.execute()
    const stories = await Promise.all(storyRows.map((row) => this.mapRowToStory(row)))

    return { stories, total }
  }

  /**
   * Find story by job ID
   */
  async findByJobId(jobId: string): Promise<Story | null> {
    const storyRow = await db
      .selectFrom('stories')
      .where('job_id', '=', jobId)
      .selectAll()
      .executeTakeFirst()

    if (!storyRow) {
      return null
    }

    return this.mapRowToStory(storyRow)
  }

  /**
   * Find all pending stories
   */
  async findPendingStories(): Promise<Story[]> {
    const storyRows = await db
      .selectFrom('stories')
      .where('generation_status', '=', 'pending')
      .selectAll()
      .execute()

    return Promise.all(storyRows.map((row) => this.mapRowToStory(row)))
  }

  /**
   * Find stories by generation status
   */
  async findByGenerationStatus(status: GenerationStatus): Promise<Story[]> {
    const storyRows = await db
      .selectFrom('stories')
      .where('generation_status', '=', status.getValue())
      .selectAll()
      .execute()

    return Promise.all(storyRows.map((row) => this.mapRowToStory(row)))
  }

  /**
   * Count stories created by a user within a date range
   * Used for quota tracking
   */
  async countByOwnerIdAndDateRange(
    ownerId: OwnerId,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const result = await db
      .selectFrom('stories')
      .where('user_id', '=', ownerId.getValue())
      .where('created_at', '>=', startDate)
      .where('created_at', '<', endDate)
      .select(db.fn.count<number>('id').as('count'))
      .executeTakeFirst()

    return Number(result?.count || 0)
  }

  /**
   * Search stories by title using partial match
   */
  async searchByTitle(query: string, limit: number = 50): Promise<Story[]> {
    const storyRows = await db
      .selectFrom('stories')
      .where('title', 'ilike', `%${query}%`)
      .selectAll()
      .orderBy('created_at', 'desc')
      .limit(limit)
      .execute()

    return Promise.all(storyRows.map((row) => this.mapRowToStory(row)))
  }

  /**
   * Helper: Map database row to Story entity
   */
  private async mapRowToStory(storyRow: any): Promise<Story> {
    // Fetch related entities
    const [themeRow, languageRow, toneRow] = await Promise.all([
      db
        .selectFrom('themes')
        .where('id', '=', storyRow.theme_id as string)
        .selectAll()
        .executeTakeFirst(),
      db
        .selectFrom('languages')
        .where('id', '=', storyRow.language_id as string)
        .selectAll()
        .executeTakeFirst(),
      db
        .selectFrom('tones')
        .where('id', '=', storyRow.tone_id as string)
        .selectAll()
        .executeTakeFirst(),
    ])

    if (!themeRow || !languageRow || !toneRow) {
      throw new Error('Related entities (theme, language, tone) not found for story')
    }

    return StoryMapper.toDomain(storyRow, themeRow, languageRow, toneRow)
  }
}
