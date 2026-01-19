import { test } from '@japa/runner'
import { ListPublicStoriesUseCase } from './ListPublicStoriesUseCase.js'
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

test.group(ListPublicStoriesUseCase.name, () => {
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
      filters: StoryFilters,
      pagination: PaginationParams
    ): Promise<PaginatedResult<Story>> {
      let filteredStories = Array.from(this.stories.values()).filter((s) => s.isPublic())

      // Apply filters
      if (filters.themeId) {
        filteredStories = filteredStories.filter(
          (s) => s.theme.id.getValue() === filters.themeId!.getValue()
        )
      }

      if (filters.languageId) {
        filteredStories = filteredStories.filter(
          (s) => s.language.id.getValue() === filters.languageId!.getValue()
        )
      }

      if (filters.toneId) {
        filteredStories = filteredStories.filter(
          (s) => s.tone.id.getValue() === filters.toneId!.getValue()
        )
      }

      if (filters.childAge) {
        filteredStories = filteredStories.filter(
          (s) => s.childAge.getValue() === filters.childAge!.getValue()
        )
      }

      // Apply pagination
      const start = (pagination.page - 1) * pagination.limit
      const end = start + pagination.limit
      const paginatedStories = filteredStories.slice(start, end)

      return Promise.resolve({
        data: paginatedStories,
        total: filteredStories.length,
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

    countByOwnerIdAndDateRange(_ownerId: OwnerId, _startDate: Date, _endDate: Date): Promise<number> {
      throw new Error('Method not implemented.')
    }

    searchByTitle(_query: string, _limit?: number): Promise<Story[]> {
      throw new Error('Method not implemented.')
    }
  }

  test('should list all public stories without filters', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()

    const numberOfStoriesCreated = 7
    for (let i = 1; i <= numberOfStoriesCreated; i++) {
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
        isPublic: i <= 5, // First 5 are public, last 2 are private
        chapters: [chapter],
      })

      await storyRepository.create(story)
    }

    // Execute use case
    const useCase = new ListPublicStoriesUseCase(storyRepository)
    const result = await useCase.execute({})

    // Assertions - should only return 5 public stories
    assert.equal(result.stories.length, 5)
    assert.equal(result.total, 5)
    assert.equal(result.page, 1)
    assert.equal(result.limit, 10)
    result.stories.forEach((story) => {
      assert.isTrue(story.isPublic())
    })
  })

  test('should filter by theme', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()
    const adventureThemeId = '123e4567-e89b-12d3-a456-426614174001'
    const fantasyThemeId = '123e4567-e89b-12d3-a456-426614174002'

    const numberOfStoriesCreated = 3
    for (let i = 1; i <= numberOfStoriesCreated; i++) {
      const chapter = ChapterFactory.create({
        position: 1,
        title: `Chapter ${i}`,
        content: `Content ${i}`,
      })

      const story = StoryFactory.create(dateService, randomService, {
        title: `Adventure Story ${i}`,
        synopsis: `Synopsis ${i}`,
        protagonist: 'Hero',
        childAge: 8,
        species: 'Human',
        conclusion: 'The end',
        coverImageUrl: 'https://example.com/cover.jpg',
        ownerId: '223e4567-e89b-12d3-a456-426614174000',
        theme: Theme.create(adventureThemeId, 'Adventure', 'An adventure theme'),
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

    const numberOfFantasyStoriesCreated = 2
    for (let i = 1; i <= numberOfFantasyStoriesCreated; i++) {
      const chapter = ChapterFactory.create({
        position: 1,
        title: `Chapter ${i}`,
        content: `Content ${i}`,
      })

      const story = StoryFactory.create(dateService, randomService, {
        title: `Fantasy Story ${i}`,
        synopsis: `Synopsis ${i}`,
        protagonist: 'Hero',
        childAge: 8,
        species: 'Human',
        conclusion: 'The end',
        coverImageUrl: 'https://example.com/cover.jpg',
        ownerId: '223e4567-e89b-12d3-a456-426614174000',
        theme: Theme.create(fantasyThemeId, 'Fantasy', 'A fantasy theme'),
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

    // Execute use case with adventure theme filter
    const useCase = new ListPublicStoriesUseCase(storyRepository)
    const result = await useCase.execute({ themeId: adventureThemeId })

    // Assertions - should only return 3 adventure stories
    assert.equal(result.stories.length, 3)
    assert.equal(result.total, 3)
    result.stories.forEach((story) => {
      assert.equal(story.theme.id.getValue(), adventureThemeId)
    })
  })

  test('should filter by multiple criteria', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()
    const adventureThemeId = '123e4567-e89b-12d3-a456-426614174001'
    const englishLanguageId = '123e4567-e89b-12d3-a456-426614174001'
    const happyToneId = '123e4567-e89b-12d3-a456-426614174001'

    // Create stories with various attributes
    const chapter = ChapterFactory.create({
      position: 1,
      title: 'Chapter 1',
      content: 'Content',
    })

    // Story matching all filters
    const matchingStory = StoryFactory.create(dateService, randomService, {
      title: 'Matching Story',
      synopsis: 'Synopsis',
      protagonist: 'Hero',
      childAge: 8,
      species: 'Human',
      conclusion: 'The end',
      coverImageUrl: 'https://example.com/cover.jpg',
      ownerId: '223e4567-e89b-12d3-a456-426614174000',
      theme: Theme.create(adventureThemeId, 'Adventure', 'An adventure theme'),
      language: Language.create(englishLanguageId, 'English', 'en', true),
      tone: Tone.create(happyToneId, 'Happy', 'A happy tone'),
      isPublic: true,
      chapters: [chapter],
    })

    await storyRepository.create(matchingStory)

    // Story with different theme
    const differentThemeStory = StoryFactory.create(dateService, randomService, {
      title: 'Different Theme Story',
      synopsis: 'Synopsis',
      protagonist: 'Hero',
      childAge: 8,
      species: 'Human',
      conclusion: 'The end',
      coverImageUrl: 'https://example.com/cover.jpg',
      ownerId: '223e4567-e89b-12d3-a456-426614174000',
      theme: Theme.create('999e4567-e89b-12d3-a456-426614174999', 'Fantasy', 'A fantasy theme'),
      language: Language.create(englishLanguageId, 'English', 'en', true),
      tone: Tone.create(happyToneId, 'Happy', 'A happy tone'),
      isPublic: true,
      chapters: [chapter],
    })

    await storyRepository.create(differentThemeStory)

    // Execute use case with multiple filters
    const useCase = new ListPublicStoriesUseCase(storyRepository)
    const result = await useCase.execute({
      themeId: adventureThemeId,
      languageId: englishLanguageId,
      toneId: happyToneId,
      childAge: 8,
    })

    // Assertions - should only return 1 matching story
    assert.equal(result.stories.length, 1)
    assert.equal(result.total, 1)
    assert.equal(result.stories[0].title, 'Matching Story')
  })

  test('should paginate results correctly', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()
    const dateService = new TestDateService()
    const randomService = new TestRandomService()

    // Create 15 public stories
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
        isPublic: true,
        chapters: [chapter],
      })

      await storyRepository.create(story)
    }

    // Execute use case - Page 1
    const useCase = new ListPublicStoriesUseCase(storyRepository)
    const result1 = await useCase.execute({ page: 1, limit: 5 })

    assert.equal(result1.stories.length, 5)
    assert.equal(result1.total, 15)
    assert.equal(result1.page, 1)
    assert.equal(result1.limit, 5)
    assert.equal(result1.totalPages, 3)

    // Execute use case - Page 2
    const result2 = await useCase.execute({ page: 2, limit: 5 })

    assert.equal(result2.stories.length, 5)
    assert.equal(result2.page, 2)
    assert.equal(result2.totalPages, 3)
  })

  test('should return empty list when no public stories match filters', async ({ assert }) => {
    const storyRepository = new TestStoryRepository()

    const useCase = new ListPublicStoriesUseCase(storyRepository)
    // Use a valid UUID that doesn't exist in the repository
    const result = await useCase.execute({ themeId: '999e4567-e89b-12d3-a456-426614174999' })

    assert.equal(result.stories.length, 0)
    assert.equal(result.total, 0)
    assert.equal(result.totalPages, 0)
  })
})
