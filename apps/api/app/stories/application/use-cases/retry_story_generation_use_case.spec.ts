import { test } from '@japa/runner'
import { RetryStoryGenerationUseCase } from './retry_story_generation_use_case.js'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { Story } from '#stories/domain/entities/story.entity'
import { StoryFactory } from '#stories/domain/factories/story_factory'
import { IThemeRepository } from '#stories/domain/repositories/theme_repository'
import { ILanguageRepository } from '#stories/domain/repositories/language_repository'
import { IToneRepository } from '#stories/domain/repositories/tone_repository'
import { IJobDispatcher, DispatchedJob } from '#stories/domain/services/i_job_dispatcher'
import { IDomainEventPublisher } from '#stories/domain/events/i_domain_event_publisher'
import type { DomainEvent } from '#stories/domain/events/domain_event'
import { IDateService } from '#stories/domain/services/i_date_service'
import { IRandomService } from '#stories/domain/services/i_random_service'
import { Theme } from '#stories/domain/value-objects/settings/theme.vo'
import { Language } from '#stories/domain/value-objects/settings/language.vo'
import { Tone } from '#stories/domain/value-objects/settings/tone.vo'
import { ThemeId } from '#stories/domain/value-objects/ids/theme_id.vo'
import { LanguageId } from '#stories/domain/value-objects/ids/language_id.vo'
import { ToneId } from '#stories/domain/value-objects/ids/tone_id.vo'
import { StoryId } from '#stories/domain/value-objects/ids/story_id.vo'
import { Slug } from '#stories/domain/value-objects/metadata/slug.vo'
import { OwnerId } from '#stories/domain/value-objects/ids/owner_id.vo'
import type {
  StoryFilters,
  PaginationParams,
  PaginatedResult,
} from '#stories/application/use-cases/story/list_public_stories_use_case'

test.group(RetryStoryGenerationUseCase.name, () => {
  const OWNER_ID = '223e4567-e89b-12d3-a456-426614174000'
  const OTHER_USER_ID = '999e4567-e89b-12d3-a456-426614174000'
  const THEME_ID = '123e4567-e89b-12d3-a456-426614174000'
  const LANGUAGE_ID = '123e4567-e89b-12d3-a456-426614174001'
  const TONE_ID = '123e4567-e89b-12d3-a456-426614174002'

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

    save(story: Story): Promise<void> {
      this.stories.set(story.id.getValue(), story)
      return Promise.resolve()
    }

    create(story: Story): Promise<Story> {
      this.stories.set(story.id.getValue(), story)
      return Promise.resolve(story)
    }

    findBySlug(_slug: Slug): Promise<Story | null> {
      throw new Error('Method not implemented.')
    }
    findByOwnerId(_ownerId: OwnerId, _pagination: PaginationParams): Promise<PaginatedResult<Story>> {
      throw new Error('Method not implemented.')
    }
    findPublicStories(_filters: StoryFilters, _pagination: PaginationParams): Promise<PaginatedResult<Story>> {
      throw new Error('Method not implemented.')
    }
    existsBySlug(_slug: Slug, _excludeId?: StoryId): Promise<boolean> {
      throw new Error('Method not implemented.')
    }
    findActiveByOwnerId(_ownerId: OwnerId): Promise<Story | null> {
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
    delete(_id: StoryId): Promise<void> {
      throw new Error('Method not implemented.')
    }
    findAll(_limit?: number, _offset?: number): Promise<{ stories: Story[]; total: number }> {
      throw new Error('Method not implemented.')
    }
  }

  class TestThemeRepository implements IThemeRepository {
    findById(id: ThemeId): Promise<Theme | null> {
      return Promise.resolve(Theme.create(id.getValue(), 'Adventure', 'An adventure theme'))
    }
    findAll(): Promise<Theme[]> {
      return Promise.resolve([])
    }
  }

  class TestLanguageRepository implements ILanguageRepository {
    findById(id: LanguageId): Promise<Language | null> {
      return Promise.resolve(Language.create(id.getValue(), 'French', 'FR', true))
    }
    findAll(): Promise<Language[]> {
      return Promise.resolve([])
    }
  }

  class TestToneRepository implements IToneRepository {
    findById(id: ToneId): Promise<Tone | null> {
      return Promise.resolve(Tone.create(id.getValue(), 'Happy', 'A happy tone'))
    }
    findAll(): Promise<Tone[]> {
      return Promise.resolve([])
    }
  }

  class TestJobDispatcher implements IJobDispatcher {
    public readonly dispatched: { jobClass: any; payload: any }[] = []

    async dispatch<T>(jobClass: any, payload: T): Promise<DispatchedJob> {
      this.dispatched.push({ jobClass, payload })
      return { id: 'test-job-id-123' }
    }
  }

  class TestEventPublisher implements IDomainEventPublisher {
    public readonly events: DomainEvent[] = []

    async publish(event: DomainEvent): Promise<void> {
      this.events.push(event)
    }

    async publishMany(events: DomainEvent[]): Promise<void> {
      this.events.push(...events)
    }
  }

  function createFailedStory(
    dateService: IDateService,
    randomService: IRandomService
  ): Story {
    // Create a pending story (not completed), so we can transition it
    const story = StoryFactory.createPending(dateService, randomService, {
      title: 'My Story',
      synopsis: 'A synopsis',
      protagonist: 'Hero',
      childAge: 8,
      species: 'Human',
      ownerId: OWNER_ID,
      theme: Theme.create(THEME_ID, 'Adventure', 'An adventure theme'),
      language: Language.create(LANGUAGE_ID, 'French', 'FR', true),
      tone: Tone.create(TONE_ID, 'Happy', 'A happy tone'),
      isPublic: false,
      isGenerated: false,
    })

    // Transition: pending -> processing -> failed
    story.startGeneration('old-job-id')
    story.failGeneration('Some error')

    return story
  }

  test('should retry a failed story generation and publish event', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const themeRepository = new TestThemeRepository()
    const languageRepository = new TestLanguageRepository()
    const toneRepository = new TestToneRepository()
    const jobDispatcher = new TestJobDispatcher()
    const eventPublisher = new TestEventPublisher()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()

    const failedStory = createFailedStory(dateService, randomService)
    await storyRepository.create(failedStory)

    const useCase = new RetryStoryGenerationUseCase(
      storyRepository,
      themeRepository,
      languageRepository,
      toneRepository,
      jobDispatcher,
      eventPublisher
    )

    const result = await useCase.execute(failedStory.id.getValue(), OWNER_ID)

    // Assertions
    assert.equal(result.id, failedStory.id.getValue())
    assert.equal(result.jobId, 'test-job-id-123')
    assert.equal(result.status, 'processing')

    // Verify the job was dispatched
    assert.equal(jobDispatcher.dispatched.length, 1)
    assert.equal(jobDispatcher.dispatched[0].payload.storyId, failedStory.id.getValue())

    // Verify the story was saved with processing status
    const savedStory = await storyRepository.findById(failedStory.id.getValue())
    assert.isTrue(savedStory?.generationStatus.isProcessing())

    // Verify the domain event was published
    assert.equal(eventPublisher.events.length, 1)
    assert.equal(eventPublisher.events[0].eventName, 'story.generation.retried')
    assert.equal(eventPublisher.events[0].aggregateId, failedStory.id.getValue())
  })

  test('should throw error if story not found', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const jobDispatcher = new TestJobDispatcher()
    const eventPublisher = new TestEventPublisher()

    const useCase = new RetryStoryGenerationUseCase(
      storyRepository,
      new TestThemeRepository(),
      new TestLanguageRepository(),
      new TestToneRepository(),
      jobDispatcher,
      eventPublisher
    )

    await assert.rejects(
      async () => await useCase.execute('non-existent-id', OWNER_ID),
      'Story not found'
    )
    assert.equal(jobDispatcher.dispatched.length, 0)
    assert.equal(eventPublisher.events.length, 0)
  })

  test('should throw error if user is not the owner', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const jobDispatcher = new TestJobDispatcher()
    const eventPublisher = new TestEventPublisher()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()

    const failedStory = createFailedStory(dateService, randomService)
    await storyRepository.create(failedStory)

    const useCase = new RetryStoryGenerationUseCase(
      storyRepository,
      new TestThemeRepository(),
      new TestLanguageRepository(),
      new TestToneRepository(),
      jobDispatcher,
      eventPublisher
    )

    await assert.rejects(
      async () => await useCase.execute(failedStory.id.getValue(), OTHER_USER_ID),
      'Unauthorized: you are not the owner of this story'
    )
    assert.equal(jobDispatcher.dispatched.length, 0)
    assert.equal(eventPublisher.events.length, 0)
  })

  test('should throw error if story status is not failed', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const jobDispatcher = new TestJobDispatcher()
    const eventPublisher = new TestEventPublisher()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()

    // Create a story in pending status (not failed)
    const pendingStory = StoryFactory.createPending(dateService, randomService, {
      title: 'Pending Story',
      synopsis: 'A synopsis',
      protagonist: 'Hero',
      childAge: 8,
      species: 'Human',
      ownerId: OWNER_ID,
      theme: Theme.create(THEME_ID, 'Adventure', 'An adventure theme'),
      language: Language.create(LANGUAGE_ID, 'French', 'FR', true),
      tone: Tone.create(TONE_ID, 'Happy', 'A happy tone'),
      isPublic: false,
      isGenerated: false,
    })

    await storyRepository.create(pendingStory)

    const useCase = new RetryStoryGenerationUseCase(
      storyRepository,
      new TestThemeRepository(),
      new TestLanguageRepository(),
      new TestToneRepository(),
      jobDispatcher,
      eventPublisher
    )

    await assert.rejects(
      async () => await useCase.execute(pendingStory.id.getValue(), OWNER_ID),
      /Cannot retry/
    )
    assert.equal(jobDispatcher.dispatched.length, 0)
    assert.equal(eventPublisher.events.length, 0)
  })
})
