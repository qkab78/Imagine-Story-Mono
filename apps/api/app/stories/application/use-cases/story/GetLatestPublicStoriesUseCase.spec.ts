import { test } from '@japa/runner'
import { GetLatestPublicStoriesUseCase } from './GetLatestPublicStoriesUseCase.js'
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

test.group(GetLatestPublicStoriesUseCase.name, () => {
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
      _ownerId: OwnerId,
      _pagination: PaginationParams
    ): Promise<PaginatedResult<Story>> {
      throw new Error('Method not implemented.')
    }

    findPublicStories(
      _filters: StoryFilters,
      pagination: PaginationParams
    ): Promise<PaginatedResult<Story>> {
      const publicStories = Array.from(this.stories.values()).filter((s) => s.isPublic())
      const start = (pagination.page - 1) * pagination.limit
      const end = start + pagination.limit
      const paginatedStories = publicStories.slice(start, end)

      return Promise.resolve({
        data: paginatedStories,
        total: publicStories.length,
        page: pagination.page,
        limit: pagination.limit,
      })
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

    countByOwnerIdAndDateRange(
      _ownerId: OwnerId,
      _startDate: Date,
      _endDate: Date
    ): Promise<number> {
      throw new Error('Method not implemented.')
    }

    searchByTitle(_query: string, _limit?: number): Promise<Story[]> {
      throw new Error('Method not implemented.')
    }
  }

  const createTestStory = (
    dateService: IDateService,
    randomService: IRandomService,
    title: string,
    isPublic: boolean = true
  ) => {
    const chapter = ChapterFactory.create({
      position: 1,
      title: 'Chapter 1',
      content: 'Content of chapter 1',
    })

    return StoryFactory.create(dateService, randomService, {
      title,
      synopsis: 'A synopsis',
      protagonist: 'Hero',
      childAge: 8,
      species: 'Human',
      conclusion: 'The end',
      coverImageUrl: 'https://example.com/cover.jpg',
      ownerId: '223e4567-e89b-12d3-a456-426614174000',
      theme: Theme.create(
        '123e4567-e89b-12d3-a456-426614174000',
        'Adventure',
        'An adventure theme'
      ),
      language: Language.create('123e4567-e89b-12d3-a456-426614174000', 'English', 'en', true),
      tone: Tone.create('123e4567-e89b-12d3-a456-426614174000', 'Happy', 'A happy tone'),
      isPublic,
      chapters: [chapter],
    })
  }

  test('should return latest public stories with default limit of 5', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()
    const numberOfStoriesCreated = 7

    // Create 7 public stories
    for (let i = 1; i <= numberOfStoriesCreated; i++) {
      await storyRepository.create(createTestStory(dateService, randomService, `Story ${i}`))
    }

    const useCase = new GetLatestPublicStoriesUseCase(storyRepository)
    const result = await useCase.execute({})

    assert.lengthOf(result.stories, 5)
  })

  test('should respect custom limit parameter', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()
    const numberOfStoriesCreated = 10
    // Create 10 public stories
    for (let i = 1; i <= numberOfStoriesCreated; i++) {
      await storyRepository.create(createTestStory(dateService, randomService, `Story ${i}`))
    }

    const useCase = new GetLatestPublicStoriesUseCase(storyRepository)
    const result = await useCase.execute({ limit: 3 })

    assert.lengthOf(result.stories, 3)
  })

  test('should only return public stories', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()

    // Create mix of public and private stories
    await storyRepository.create(
      createTestStory(dateService, randomService, 'Public Story 1', true)
    )
    await storyRepository.create(
      createTestStory(dateService, randomService, 'Private Story 1', false)
    )
    await storyRepository.create(
      createTestStory(dateService, randomService, 'Public Story 2', true)
    )
    await storyRepository.create(
      createTestStory(dateService, randomService, 'Private Story 2', false)
    )

    const useCase = new GetLatestPublicStoriesUseCase(storyRepository)
    const result = await useCase.execute({ limit: 10 })

    assert.lengthOf(result.stories, 2)
    result.stories.forEach((story) => {
      assert.isTrue(story.isPublic())
    })
  })

  test('should return empty array when no public stories exist', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()

    // Create only private stories
    await storyRepository.create(
      createTestStory(dateService, randomService, 'Private Story', false)
    )

    const useCase = new GetLatestPublicStoriesUseCase(storyRepository)
    const result = await useCase.execute({})

    assert.lengthOf(result.stories, 0)
  })
})
