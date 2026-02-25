import { test } from '@japa/runner'
import { GetStoryOfTheDayUseCase } from './get_story_of_the_day_use_case.js'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { Story } from '#stories/domain/entities/story.entity'
import { StoryId } from '#stories/domain/value-objects/ids/story_id.vo'
import { Slug } from '#stories/domain/value-objects/metadata/slug.vo'
import { OwnerId } from '#stories/domain/value-objects/ids/owner_id.vo'
import { StoryFactory } from '#stories/domain/factories/story_factory'
import { ChapterFactory } from '#stories/domain/factories/chapter_factory'
import { Theme } from '#stories/domain/value-objects/settings/theme.vo'
import { Language } from '#stories/domain/value-objects/settings/language.vo'
import { Tone } from '#stories/domain/value-objects/settings/tone.vo'
import { IDateService } from '#stories/domain/services/i_date_service'
import { IRandomService } from '#stories/domain/services/i_random_service'
import { GenerationStatus } from '#stories/domain/value-objects/metadata/generation_status.vo'
import type {
  StoryFilters,
  PaginationParams,
  PaginatedResult,
} from '../story/list_public_stories_use_case.js'

test.group(GetStoryOfTheDayUseCase.name, () => {
  class TestDateService implements IDateService {
    constructor(private readonly fixedDate: string = '2025-06-15T12:00:00.000Z') {}

    now(): string {
      return this.fixedDate
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
    public storyOfTheDay: Story | null = null

    findStoryOfTheDay(_date: Date): Promise<Story | null> {
      return Promise.resolve(this.storyOfTheDay)
    }

    findActiveByOwnerId(_ownerId: OwnerId): Promise<Story | null> {
      throw new Error('Method not implemented.')
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
      throw new Error('Method not implemented.')
    }

    searchByTitle(_query: string, _limit?: number): Promise<Story[]> {
      throw new Error('Method not implemented.')
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
        'An adventure theme',
        'adventure'
      ),
      language: Language.create('123e4567-e89b-12d3-a456-426614174000', 'English', 'en', true),
      tone: Tone.create('123e4567-e89b-12d3-a456-426614174000', 'Happy', 'A happy tone'),
      isPublic: true,
      chapters: [chapter],
    })
  }

  test('should return a story of the day when one exists', async ({ assert }) => {
    const dateService = new TestDateService()
    const randomService = new TestRandomService()
    const storyRepository = new TestStoryRepository()

    const story = createTestStory(dateService, randomService, 'Story of the Day')
    storyRepository.storyOfTheDay = story

    const useCase = new GetStoryOfTheDayUseCase(storyRepository, dateService)
    const result = await useCase.execute()

    assert.isNotNull(result)
    assert.equal(result!.title, 'Story of the Day')
  })

  test('should return null when no completed public stories exist', async ({ assert }) => {
    const dateService = new TestDateService()
    const storyRepository = new TestStoryRepository()
    storyRepository.storyOfTheDay = null

    const useCase = new GetStoryOfTheDayUseCase(storyRepository, dateService)
    const result = await useCase.execute()

    assert.isNull(result)
  })

  test('should use the current date from the date service', async ({ assert }) => {
    const dateService = new TestDateService('2025-12-25T00:00:00.000Z')
    const randomService = new TestRandomService()
    const storyRepository = new TestStoryRepository()

    const story = createTestStory(dateService, randomService, 'Christmas Story')
    storyRepository.storyOfTheDay = story

    const useCase = new GetStoryOfTheDayUseCase(storyRepository, dateService)
    const result = await useCase.execute()

    assert.isNotNull(result)
    assert.equal(result!.title, 'Christmas Story')
  })
})
