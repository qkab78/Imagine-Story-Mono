import { test } from '@japa/runner'
import { GetStoryByIdUseCase } from './GetStoryByIdUseCase.js'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import { MockStorageService } from '#stories/infrastructure/adapters/services/__mocks__/MockStorageService'

import { Story } from '#stories/domain/entities/story.entity'
import { IDateService } from '#stories/domain/services/IDateService'

import { ChapterImage } from '#stories/domain/entities/chapter.entity'
import { Chapter } from '#stories/domain/entities/chapter.entity'
import { StoryBuilder } from '#stories/domain/builders/story.builder'
import { ChapterId } from '#stories/domain/value-objects/ids/ChapterId.vo'
import { ImageUrl } from '#stories/domain/value-objects/media/ImageUrl.vo'
import { Theme } from '#stories/domain/value-objects/settings/Theme.vo'
import { Language } from '#stories/domain/value-objects/settings/Language.vo'
import { Tone } from '#stories/domain/value-objects/settings/Tone.vo'
import { StoryId } from '#stories/domain/value-objects/ids/StoryId.vo'
import { OwnerId } from '#stories/domain/value-objects/ids/OwnerId.vo'
import { IRandomService } from '#stories/domain/services/IRandomService'
import { Slug } from '#stories/domain/value-objects/metadata/Slug.vo'
import {
  PaginationParams,
  PaginatedResult,
  StoryFilters,
} from './story/ListPublicStoriesUseCase.js'

test.group(GetStoryByIdUseCase.name, () => {
  class TestRandomService implements IRandomService {
    public generateRandomUuid(): string {
      return '1ed3df18-0bc3-4a08-aa6b-d5eb20e0dbc0'
    }
  }
  class TestDateService implements IDateService {
    public now(): string {
      return '2025-01-01T00:00:00.000Z'
    }
  }
  const theme = Theme.create(
    '1720955b-4474-4a1d-bf99-3907a000ba65',
    'The name of the theme',
    'The description of the theme'
  )
  const language = Language.create(
    '1720955b-4474-4a1d-bf99-3907a000ba65',
    'The name of the language',
    'The code of the language',
    true
  )
  const tone = Tone.create(
    '1720955b-4474-4a1d-bf99-3907a000ba65',
    'The name of the tone',
    'The description of the tone'
  )
  const chapters = [
    Chapter.create(
      ChapterId.create(1),
      'The title of the chapter',
      'The content of the chapter',
      ChapterImage.create(ChapterId.create(1), ImageUrl.create('https://example.com/image.jpg'))
    ),
    Chapter.create(
      ChapterId.create(2),
      'The title of the chapter',
      'The content of the chapter',
      ChapterImage.create(ChapterId.create(2), ImageUrl.create('https://example.com/image.jpg'))
    ),
  ]
  const randomService = new TestRandomService()
  const storyId = StoryId.generate(randomService)
  const owner = OwnerId.create('1720955b-4474-4a1d-bf99-3907a000ba65')
  const story = StoryBuilder.create(new TestDateService())
    .withId(storyId)
    .withTitle('The title of the story')
    .withSynopsis('The synopsis of the story')
    .withProtagonist('The protagonist of the story')
    .withChildAge(10)
    .withSpecies('The species of the story')
    .withConclusion('The conclusion of the story')
    .withCoverImageUrl('https://example.com/image.jpg')
    .withOwnerId(owner.getValue())
    .withIsPublic(true)
    .withPublicationDate()
    .withTheme(theme)
    .withLanguage(language)
    .withTone(tone)
    .withChapters(chapters)
    .build()
  class TestStoryRepository implements IStoryRepository {
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
    save(_story: Story): Promise<void> {
      throw new Error('Method not implemented.')
    }
    delete(_id: StoryId): Promise<void> {
      throw new Error('Method not implemented.')
    }
    private readonly stories: Story[] = [story]
    async findById(id: string): Promise<Story> {
      const story = this.stories.find((story) => story.id.equals(StoryId.create(id)))
      if (!story) {
        throw new Error('Story not found')
      }
      return story
    }
    findAll(_limit?: number, _offset?: number): Promise<{ stories: Story[]; total: number }> {
      throw new Error('Method not implemented.')
    }
    create(_story: Story): Promise<Story> {
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
  test('should get a story by id', async ({ assert }) => {
    const storageService = new MockStorageService()
    const getStoryByIdUseCase = new GetStoryByIdUseCase(new TestStoryRepository(), storageService)
    const story = await getStoryByIdUseCase.execute(storyId.getValue())
    assert.isDefined(story)
    assert.equal(story.id, storyId.getValue())
    assert.equal(story.title, 'The title of the story')
    assert.equal(story.synopsis, 'The synopsis of the story')
    assert.equal(story.theme.id, theme.id)
    assert.equal(story.theme.name, theme.name)
    assert.equal(story.theme.description, theme.description)
    assert.equal(story.language.id, language.id)
    assert.equal(story.language.name, language.name)
    assert.equal(story.language.code, language.code)
    assert.equal(story.language.isFree, language.isFree)
    assert.equal(story.tone.id, tone.id)
    assert.equal(story.tone.name, tone.name)
    assert.equal(story.childAge, 10)
    assert.equal(story.chapters.length, 2)
    assert.equal(story.conclusion, 'The conclusion of the story')
    assert.equal(story.coverImageUrl, 'https://example.com/image.jpg')
    assert.equal(story.ownerId, '1720955b-4474-4a1d-bf99-3907a000ba65')
    assert.equal(story.isPublic, true)
  })
})
