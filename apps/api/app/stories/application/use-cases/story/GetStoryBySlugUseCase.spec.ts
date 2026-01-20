import { test } from '@japa/runner'
import { GetStoryBySlugUseCase } from './GetStoryBySlugUseCase.js'
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

test.group(GetStoryBySlugUseCase.name, () => {
  class TestDateService implements IDateService {
    now(): string {
      return '2025-01-01T00:00:00.000Z'
    }
  }

  class TestRandomService implements IRandomService {
    generateRandomUuid(): string {
      return '1720955b-4474-4a1d-bf99-3907a000ba65'
    }
  }

  class TestStoryRepository implements IStoryRepository {
    public readonly stories: Map<string, Story> = new Map()

    findById(id: StoryId | string): Promise<Story | null> {
      const idValue = typeof id === 'string' ? id : id.getValue()
      return Promise.resolve(this.stories.get(idValue) || null)
    }

    findBySlug(slug: Slug): Promise<Story | null> {
      const story = Array.from(this.stories.values()).find(
        (s) => s.slug.getValue() === slug.getValue()
      )
      return Promise.resolve(story || null)
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

    searchByTitle(_query: string, _limit?: number): Promise<Story[]> {
      throw new Error('Method not implemented.')
    }
  }

  test('should get a story by slug', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()

    // Create a story
    const chapter = ChapterFactory.create({
      position: 1,
      title: 'Chapter 1',
      content: 'Content of chapter 1',
    })

    const story = StoryFactory.create(dateService, randomService, {
      title: 'My Amazing Story',
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

    await storyRepository.create(story)

    // Execute use case
    const useCase = new GetStoryBySlugUseCase(storyRepository)
    const result = await useCase.execute('my-amazing-story')

    // Assertions
    assert.isDefined(result)
    assert.equal(result?.title, 'My Amazing Story')
    assert.equal(result?.slug.getValue(), 'my-amazing-story')
  })

  test('should return null if story not found by slug', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()

    const useCase = new GetStoryBySlugUseCase(storyRepository)
    const result = await useCase.execute('non-existent-slug')

    assert.isNull(result)
  })

  test('should validate slug format', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()

    const useCase = new GetStoryBySlugUseCase(storyRepository)

    // Invalid slug format should throw error during Slug.create()
    await assert.rejects(async () => await useCase.execute('Invalid Slug With Spaces!'))
  })
})
