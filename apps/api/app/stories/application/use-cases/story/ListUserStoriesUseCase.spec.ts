import { test } from '@japa/runner'
import { ListUserStoriesUseCase } from './ListUserStoriesUseCase.js'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import { Story } from '#stories/domain/entities/story.entity'
import { StoryId } from '#stories/domain/value-objects/ids/StoryId.vo'
import { Slug } from '#stories/domain/value-objects/metadata/Slug.vo'
import { OwnerId } from '#stories/domain/value-objects/ids/OwnerId.vo'
import { StoryFactory } from '#stories/domain/factories/StoryFactory'
import { ChapterFactory } from '#stories/domain/factories/ChapterFactory'
import { Theme } from '#stories/domain/value-objects/settings/Theme.vo'
import { Language } from '#stories/domain/value-objects/settings/Language.vo'
import { Tone } from '#stories/domain/value-objects/settings/Tone.vo'
import { IDateService } from '#stories/domain/services/IDateService'
import { IRandomService } from '#stories/domain/services/IRandomService'
import type { StoryFilters, PaginationParams, PaginatedResult } from './ListPublicStoriesUseCase.js'

test.group(ListUserStoriesUseCase.name, () => {
  class TestDateService implements IDateService {
    now(): string {
      return '2025-01-01T00:00:00.000Z'
    }
  }

  class TestRandomService implements IRandomService {
    private counter = 0

    generateRandomUuid(): string {
      this.counter++
      return `1720955b-4474-4a1d-bf99-3907a000ba${this.counter.toString().padStart(2, '0')}`
    }
  }

  class TestStoryRepository implements IStoryRepository {
    public readonly stories: Map<string, Story> = new Map()

    findById(id: StoryId | string): Promise<Story | null> {
      const idValue = typeof id === 'string' ? id : id.getValue()
      return Promise.resolve(this.stories.get(idValue) || null)
    }

    findBySlug(_slug: Slug): Promise<Story | null> {
      throw new Error('Method not implemented.')
    }

    findByOwnerId(
      ownerId: OwnerId,
      pagination: PaginationParams
    ): Promise<PaginatedResult<Story>> {
      const ownerStories = Array.from(this.stories.values()).filter(
        (s) => s.ownerId.getValue() === ownerId.getValue()
      )

      const start = (pagination.page - 1) * pagination.limit
      const end = start + pagination.limit
      const paginatedStories = ownerStories.slice(start, end)

      return Promise.resolve({
        data: paginatedStories,
        total: ownerStories.length,
        page: pagination.page,
        limit: pagination.limit,
      })
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

    create(story: Story): Promise<Story> {
      this.stories.set(story.id.getValue(), story)
      return Promise.resolve(story)
    }

    save(story: Story): Promise<void> {
      this.stories.set(story.id.getValue(), story)
      return Promise.resolve()
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

    countByOwnerIdAndDateRange(_ownerId: OwnerId, _startDate: Date, _endDate: Date): Promise<number> {
      throw new Error('Method not implemented.')
    }

    searchByTitle(_query: string, _limit?: number): Promise<Story[]> {
      throw new Error('Method not implemented.')
    }
  }

  test('should list all stories for a user', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()
    const ownerId = '223e4567-e89b-12d3-a456-426614174000'

    // Create 3 stories for the same owner
    for (let i = 1; i <= 3; i++) {
      const chapter = ChapterFactory.create({
        position: 1,
        title: `Chapter ${i}`,
        content: `Content ${i}`,
      })

      const story = StoryFactory.create(dateService, randomService, {
        title: `Story ${i}`,
        synopsis: `Synopsis ${i}`,
        protagonist: 'Hero',
        childAge: 8,
        species: 'Human',
        conclusion: 'The end',
        coverImageUrl: 'https://example.com/cover.jpg',
        ownerId,
        theme: Theme.create(
          '123e4567-e89b-12d3-a456-426614174000',
          'Adventure',
          'An adventure theme'
        ),
        language: Language.create(
          '123e4567-e89b-12d3-a456-426614174000',
          'English',
          'en',
          true
        ),
        tone: Tone.create('123e4567-e89b-12d3-a456-426614174000', 'Happy', 'A happy tone'),
        isPublic: i % 2 === 0, // Mix of public and private
        chapters: [chapter],
      })

      await storyRepository.create(story)
    }

    // Execute use case
    const useCase = new ListUserStoriesUseCase(storyRepository)
    const result = await useCase.execute({ ownerId })

    // Assertions
    assert.equal(result.stories.length, 3)
    assert.equal(result.total, 3)
    assert.equal(result.page, 1)
    assert.equal(result.limit, 10)
    assert.equal(result.totalPages, 1)
  })

  test('should paginate user stories correctly', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()
    const ownerId = '223e4567-e89b-12d3-a456-426614174000'

    // Create 15 stories for the same owner
    for (let i = 1; i <= 15; i++) {
      const chapter = ChapterFactory.create({
        position: 1,
        title: `Chapter ${i}`,
        content: `Content ${i}`,
      })

      const story = StoryFactory.create(dateService, randomService, {
        title: `Story ${i}`,
        synopsis: `Synopsis ${i}`,
        protagonist: 'Hero',
        childAge: 8,
        species: 'Human',
        conclusion: 'The end',
        coverImageUrl: 'https://example.com/cover.jpg',
        ownerId,
        theme: Theme.create(
          '123e4567-e89b-12d3-a456-426614174000',
          'Adventure',
          'An adventure theme'
        ),
        language: Language.create(
          '123e4567-e89b-12d3-a456-426614174000',
          'English',
          'en',
          true
        ),
        tone: Tone.create('123e4567-e89b-12d3-a456-426614174000', 'Happy', 'A happy tone'),
        isPublic: true,
        chapters: [chapter],
      })

      await storyRepository.create(story)
    }

    // Execute use case - Page 1
    const useCase = new ListUserStoriesUseCase(storyRepository)
    const result1 = await useCase.execute({ ownerId, page: 1, limit: 5 })

    assert.equal(result1.stories.length, 5)
    assert.equal(result1.total, 15)
    assert.equal(result1.page, 1)
    assert.equal(result1.limit, 5)
    assert.equal(result1.totalPages, 3)

    // Execute use case - Page 2
    const result2 = await useCase.execute({ ownerId, page: 2, limit: 5 })

    assert.equal(result2.stories.length, 5)
    assert.equal(result2.total, 15)
    assert.equal(result2.page, 2)
    assert.equal(result2.limit, 5)
    assert.equal(result2.totalPages, 3)

    // Execute use case - Page 3
    const result3 = await useCase.execute({ ownerId, page: 3, limit: 5 })

    assert.equal(result3.stories.length, 5)
    assert.equal(result3.total, 15)
    assert.equal(result3.page, 3)
  })

  test('should return empty list for user with no stories', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()

    const useCase = new ListUserStoriesUseCase(storyRepository)
    const result = await useCase.execute({ ownerId: '223e4567-e89b-12d3-a456-426614174000' })

    assert.equal(result.stories.length, 0)
    assert.equal(result.total, 0)
    assert.equal(result.totalPages, 0)
  })

  test('should only return stories for the specified owner', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()
    const owner1Id = '223e4567-e89b-12d3-a456-426614174001'
    const owner2Id = '223e4567-e89b-12d3-a456-426614174002'

    // Create 2 stories for owner1
    for (let i = 1; i <= 2; i++) {
      const chapter = ChapterFactory.create({
        position: 1,
        title: `Chapter ${i}`,
        content: `Content ${i}`,
      })

      const story = StoryFactory.create(dateService, randomService, {
        title: `Owner1 Story ${i}`,
        synopsis: `Synopsis ${i}`,
        protagonist: 'Hero',
        childAge: 8,
        species: 'Human',
        conclusion: 'The end',
        coverImageUrl: 'https://example.com/cover.jpg',
        ownerId: owner1Id,
        theme: Theme.create(
          '123e4567-e89b-12d3-a456-426614174000',
          'Adventure',
          'An adventure theme'
        ),
        language: Language.create(
          '123e4567-e89b-12d3-a456-426614174000',
          'English',
          'en',
          true
        ),
        tone: Tone.create('123e4567-e89b-12d3-a456-426614174000', 'Happy', 'A happy tone'),
        isPublic: true,
        chapters: [chapter],
      })

      await storyRepository.create(story)
    }

    // Create 3 stories for owner2
    for (let i = 1; i <= 3; i++) {
      const chapter = ChapterFactory.create({
        position: 1,
        title: `Chapter ${i}`,
        content: `Content ${i}`,
      })

      const story = StoryFactory.create(dateService, randomService, {
        title: `Owner2 Story ${i}`,
        synopsis: `Synopsis ${i}`,
        protagonist: 'Hero',
        childAge: 8,
        species: 'Human',
        conclusion: 'The end',
        coverImageUrl: 'https://example.com/cover.jpg',
        ownerId: owner2Id,
        theme: Theme.create(
          '123e4567-e89b-12d3-a456-426614174000',
          'Adventure',
          'An adventure theme'
        ),
        language: Language.create(
          '123e4567-e89b-12d3-a456-426614174000',
          'English',
          'en',
          true
        ),
        tone: Tone.create('123e4567-e89b-12d3-a456-426614174000', 'Happy', 'A happy tone'),
        isPublic: true,
        chapters: [chapter],
      })

      await storyRepository.create(story)
    }

    // Execute use case for owner1
    const useCase = new ListUserStoriesUseCase(storyRepository)
    const result = await useCase.execute({ ownerId: owner1Id })

    assert.equal(result.stories.length, 2)
    assert.equal(result.total, 2)
    result.stories.forEach((story) => {
      assert.equal(story.ownerId.getValue(), owner1Id)
    })
  })
})
