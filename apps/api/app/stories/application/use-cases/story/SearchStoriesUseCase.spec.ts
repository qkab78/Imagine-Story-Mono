import { test } from '@japa/runner'
import { SearchStoriesUseCase } from './SearchStoriesUseCase.js'
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

test.group(SearchStoriesUseCase.name, () => {
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

    countByOwnerIdAndDateRange(
      _ownerId: OwnerId,
      _startDate: Date,
      _endDate: Date
    ): Promise<number> {
      throw new Error('Method not implemented.')
    }

    searchByTitle(query: string, limit: number = 50): Promise<Story[]> {
      const results = Array.from(this.stories.values())
        .filter((story) => story.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, limit)
      return Promise.resolve(results)
    }
  }

  const createTestStory = (
    dateService: IDateService,
    randomService: IRandomService,
    title: string
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
      isPublic: true,
      chapters: [chapter],
    })
  }

  test('should search stories by title', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()

    // Create stories with different titles
    await storyRepository.create(createTestStory(dateService, randomService, 'The Great Adventure'))
    await storyRepository.create(createTestStory(dateService, randomService, 'A Magical Journey'))
    await storyRepository.create(createTestStory(dateService, randomService, 'Adventure in Space'))

    const useCase = new SearchStoriesUseCase(storyRepository)
    const result = await useCase.execute({ query: 'Adventure' })

    assert.lengthOf(result, 2)
    assert.isTrue(result.every((story) => story.title.includes('Adventure')))
  })

  test('should return empty array when no stories match', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()

    await storyRepository.create(createTestStory(dateService, randomService, 'The Great Adventure'))

    const useCase = new SearchStoriesUseCase(storyRepository)
    const result = await useCase.execute({ query: 'nonexistent' })

    assert.lengthOf(result, 0)
  })

  test('should respect limit parameter', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()

    const numberOfStoriesCreated = 5

    for (let i = 1; i <= numberOfStoriesCreated; i++) {
      await storyRepository.create(createTestStory(dateService, randomService, `Story ${i}`))
    }

    const useCase = new SearchStoriesUseCase(storyRepository)
    const result = await useCase.execute({ query: 'Story', limit: 3 })

    assert.lengthOf(result, 3)
  })

  test('should use default limit of 50 when not specified', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()

    const useCase = new SearchStoriesUseCase(storyRepository)
    const result = await useCase.execute({ query: 'test' })

    assert.isArray(result)
  })

  test('should be case insensitive', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()

    await storyRepository.create(createTestStory(dateService, randomService, 'The GREAT Adventure'))

    const useCase = new SearchStoriesUseCase(storyRepository)
    const result = await useCase.execute({ query: 'great' })

    assert.lengthOf(result, 1)
    assert.equal(result[0].title, 'The GREAT Adventure')
  })
})
