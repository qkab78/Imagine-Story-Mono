import { test } from '@japa/runner'
import { PublishStoryUseCase } from './publish_story_use_case.js'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { Story } from '#stories/domain/entities/story.entity'
import type { IDomainEventPublisher } from '#stories/domain/events/i_domain_event_publisher'
import type { DomainEvent } from '#stories/domain/events/domain_event'
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
import type {
  StoryFilters,
  PaginationParams,
  PaginatedResult,
} from './list_public_stories_use_case.js'

test.group(PublishStoryUseCase.name, () => {
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

    findActiveByOwnerId(ownerId: OwnerId): Promise<Story | null> {
      throw new Error('Method not implemented.')
    }

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

    searchByTitle(_query: string, _limit?: number): Promise<Story[]> {
      throw new Error('Method not implemented.')
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

  test('should publish a private story', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const eventPublisher = new TestEventPublisher()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()

    // Create a private story
    const chapter = ChapterFactory.create({
      position: 1,
      title: 'Chapter 1',
      content: 'Content of chapter 1',
    })

    const privateStory = StoryFactory.create(dateService, randomService, {
      title: 'My Private Story',
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
      isPublic: false, // Private story
      chapters: [chapter],
    })

    await storyRepository.create(privateStory)

    // Execute use case
    const useCase = new PublishStoryUseCase(storyRepository, eventPublisher)
    await useCase.execute(privateStory.id.getValue())

    // Assertions
    const updatedStory = await storyRepository.findById(privateStory.id)
    assert.isTrue(updatedStory?.isPublic())
    assert.equal(eventPublisher.events.length, 1)
    assert.equal(eventPublisher.events[0].eventName, 'story.published')
  })

  test('should do nothing if story is already public', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const eventPublisher = new TestEventPublisher()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()

    // Create a public story
    const chapter = ChapterFactory.create({
      position: 1,
      title: 'Chapter 1',
      content: 'Content of chapter 1',
    })

    const publicStory = StoryFactory.create(dateService, randomService, {
      title: 'My Public Story',
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
      isPublic: true, // Already public
      chapters: [chapter],
    })

    await storyRepository.create(publicStory)

    // Execute use case
    const useCase = new PublishStoryUseCase(storyRepository, eventPublisher)
    await useCase.execute(publicStory.id.getValue())

    // Assertions - no event should be published
    assert.equal(eventPublisher.events.length, 0)
  })

  test('should throw error if story not found', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const eventPublisher = new TestEventPublisher()

    const useCase = new PublishStoryUseCase(storyRepository, eventPublisher)

    await assert.rejects(async () => await useCase.execute('non-existent-id'))
  })
})
