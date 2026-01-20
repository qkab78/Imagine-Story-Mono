import { test } from '@japa/runner'
import { GetStoryQuotaUseCase } from './GetStoryQuotaUseCase.js'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import { Story } from '#stories/domain/entities/story.entity'
import { StoryId } from '#stories/domain/value-objects/ids/StoryId.vo'
import { Slug } from '#stories/domain/value-objects/metadata/Slug.vo'
import { OwnerId } from '#stories/domain/value-objects/ids/OwnerId.vo'
import type {
  StoryFilters,
  PaginationParams,
  PaginatedResult,
} from './story/ListPublicStoriesUseCase.js'
import { Role } from '#users/models/role'

test.group(GetStoryQuotaUseCase.name, () => {
  class TestStoryRepository implements IStoryRepository {
    private storiesCount: number = 0

    constructor(storiesCount: number = 0) {
      this.storiesCount = storiesCount
    }

    findById(_id: StoryId | string): Promise<Story | null> {
      throw new Error('Method not implemented.')
    }

    findBySlug(_slug: Slug): Promise<Story | null> {
      throw new Error('Method not implemented.')
    }

    findByOwnerId(
      _ownerId: OwnerId,
      _pagination: PaginationParams
    ): Promise<PaginatedResult<Story>> {
      throw new Error('Method not implemented.')
    }

    findPublicStories(
      _filters: StoryFilters,
      _pagination: PaginationParams
    ): Promise<PaginatedResult<Story>> {
      throw new Error('Method not implemented.')
    }

    existsBySlug(_slug: Slug, _excludeId?: StoryId): Promise<boolean> {
      throw new Error('Method not implemented.')
    }

    create(_story: Story): Promise<Story> {
      throw new Error('Method not implemented.')
    }

    save(_story: Story): Promise<void> {
      throw new Error('Method not implemented.')
    }

    delete(_id: StoryId): Promise<void> {
      throw new Error('Method not implemented.')
    }

    findAll(_limit?: number, _offset?: number): Promise<{ stories: Story[]; total: number }> {
      throw new Error('Method not implemented.')
    }

    findByJobId(_jobId: string): Promise<Story | null> {
      throw new Error('Method not implemented.')
    }

    findPendingStories(): Promise<Story[]> {
      throw new Error('Method not implemented.')
    }

    findByGenerationStatus(_status: any): Promise<Story[]> {
      throw new Error('Method not implemented.')
    }

    countByOwnerIdAndDateRange(
      _ownerId: OwnerId,
      _startDate: Date,
      _endDate: Date
    ): Promise<number> {
      return Promise.resolve(this.storiesCount)
    }

    searchByTitle(_query: string, _limit?: number): Promise<Story[]> {
      throw new Error('Method not implemented.')
    }
  }

  test('should return unlimited quota for premium users', async ({ assert }) => {
    const storyRepository = new TestStoryRepository(5)
    const useCase = new GetStoryQuotaUseCase(storyRepository)

    const result = await useCase.execute({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      userRole: Role.PREMIUM,
    })

    assert.equal(result.storiesCreatedThisMonth, 5)
    assert.isNull(result.limit)
    assert.isNull(result.remaining)
    assert.isNull(result.resetDate)
    assert.isTrue(result.isUnlimited)
    assert.isTrue(result.canCreate)
  })

  test('should return unlimited quota for admin users', async ({ assert }) => {
    const storyRepository = new TestStoryRepository(10)
    const useCase = new GetStoryQuotaUseCase(storyRepository)

    const result = await useCase.execute({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      userRole: Role.ADMIN,
    })

    assert.isTrue(result.isUnlimited)
    assert.isTrue(result.canCreate)
    assert.isNull(result.limit)
  })

  test('should return limited quota for free users (CUSTOMER role)', async ({ assert }) => {
    const storyRepository = new TestStoryRepository(1)
    const useCase = new GetStoryQuotaUseCase(storyRepository)

    const result = await useCase.execute({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      userRole: Role.CUSTOMER,
    })

    assert.equal(result.storiesCreatedThisMonth, 1)
    assert.isNotNull(result.limit)
    assert.isFalse(result.isUnlimited)
    assert.isTrue(result.canCreate)
    assert.isNotNull(result.resetDate)
  })

  test('should indicate user cannot create when quota is reached', async ({ assert }) => {
    const storyRepository = new TestStoryRepository(10)
    const useCase = new GetStoryQuotaUseCase(storyRepository)

    const result = await useCase.execute({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      userRole: Role.CUSTOMER,
    })

    assert.isFalse(result.canCreate)
    assert.equal(result.remaining, 0)
  })

  test('should calculate remaining stories correctly', async ({ assert }) => {
    const storyRepository = new TestStoryRepository(1)
    const useCase = new GetStoryQuotaUseCase(storyRepository)

    const result = await useCase.execute({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      userRole: Role.CUSTOMER,
    })

    assert.equal(result.storiesCreatedThisMonth, 1)
    assert.isTrue((result.remaining as number) >= 0)
  })

  test('should set resetDate to first day of next month for free users', async ({ assert }) => {
    const storyRepository = new TestStoryRepository(0)
    const useCase = new GetStoryQuotaUseCase(storyRepository)

    const result = await useCase.execute({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      userRole: Role.CUSTOMER,
    })

    assert.isNotNull(result.resetDate)
    const resetDate = result.resetDate as Date
    assert.equal(resetDate.getUTCDate(), 1) // First day of month
  })
})
