import { test } from '@japa/runner'
import { UnpublishStoryUseCase } from './UnpublishStoryUseCase.js'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import { Story } from '#stories/domain/entities/story.entity'
import type { IDomainEventPublisher } from '#stories/domain/events/IDomainEventPublisher'
import type { DomainEvent } from '#stories/domain/events/DomainEvent'
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

test.group('UnpublishStoryUseCase', () => {
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

  test('should unpublish a public story', async ({ assert }) => {
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
        'An adventure theme'
      ),
      language: Language.create(
        '123e4567-e89b-12d3-a456-426614174000',
        'English',
        'en',
        true
      ),
      tone: Tone.create('123e4567-e89b-12d3-a456-426614174000', 'Happy', 'A happy tone'),
      isPublic: true, // Public story
      chapters: [chapter],
    })

    await storyRepository.create(publicStory)

    // Execute use case
    const useCase = new UnpublishStoryUseCase(storyRepository, eventPublisher)
    await useCase.execute(publicStory.id.getValue())

    // Assertions
    const updatedStory = await storyRepository.findById(publicStory.id)
    assert.isTrue(updatedStory?.isPrivate())
    assert.equal(eventPublisher.events.length, 1)
    assert.equal(eventPublisher.events[0].eventName, 'story.unpublished')
  })

  test('should do nothing if story is already private', async ({ assert }) => {
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
        'An adventure theme'
      ),
      language: Language.create(
        '123e4567-e89b-12d3-a456-426614174000',
        'English',
        'en',
        true
      ),
      tone: Tone.create('123e4567-e89b-12d3-a456-426614174000', 'Happy', 'A happy tone'),
      isPublic: false, // Already private
      chapters: [chapter],
    })

    await storyRepository.create(privateStory)

    // Execute use case
    const useCase = new UnpublishStoryUseCase(storyRepository, eventPublisher)
    await useCase.execute(privateStory.id.getValue())

    // Assertions - no event should be published
    assert.equal(eventPublisher.events.length, 0)
  })

  test('should throw error if story not found', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const eventPublisher = new TestEventPublisher()

    const useCase = new UnpublishStoryUseCase(storyRepository, eventPublisher)

    await assert.rejects(
      async () => await useCase.execute('non-existent-id')
    )
  })
})
