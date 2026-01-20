import { test } from '@japa/runner'
import { StoryFactory } from '../factories/StoryFactory.js'
import { ChapterFactory } from '../factories/ChapterFactory.js'
import { Theme } from '../value-objects/settings/Theme.vo.js'
import { Language } from '../value-objects/settings/Language.vo.js'
import { Tone } from '../value-objects/settings/Tone.vo.js'
import { IDateService } from '../services/IDateService.js'
import { IRandomService } from '../services/IRandomService.js'

class TestDateService implements IDateService {
  public now(): string {
    return '2025-01-01T00:00:00.000Z'
  }
}
class TestRandomService implements IRandomService {
  public generateRandomUuid(): string {
    return '123e4567-e89b-12d3-a456-426614174000'
  }
}
test.group('Story Entity', () => {
  const createValidTheme = () =>
    Theme.create('123e4567-e89b-12d3-a456-426614174000', 'Adventure', 'An adventure theme')

  const createValidLanguage = () =>
    Language.create('223e4567-e89b-12d3-a456-426614174000', 'English', 'en', true)

  const createValidTone = () =>
    Tone.create('323e4567-e89b-12d3-a456-426614174000', 'Happy', 'A happy tone')

  const createValidChapters = () => [
    ChapterFactory.create({
      position: 1,
      title: 'Chapter 1',
      content: 'This is the content of chapter 1.',
    }),
  ]

  test('should create a valid Story using factory', ({ assert }) => {
    const story = StoryFactory.create(new TestDateService(), new TestRandomService(), {
      title: 'My Story',
      synopsis: 'A great story about adventure',
      protagonist: 'Hero',
      childAge: 7,
      species: 'Human',
      conclusion: 'And they lived happily ever after',
      coverImageUrl: 'https://example.com/cover.jpg',
      ownerId: '423e4567-e89b-12d3-a456-426614174000',
      isPublic: false,
      theme: createValidTheme(),
      language: createValidLanguage(),
      tone: createValidTone(),
      chapters: createValidChapters(),
    })

    assert.equal(story.title, 'My Story')
    assert.equal(story.synopsis, 'A great story about adventure')
    assert.equal(story.protagonist, 'Hero')
    assert.equal(story.species, 'Human')
    assert.equal(story.conclusion, 'And they lived happily ever after')
    assert.equal(story.numberOfChapters, 1)
    assert.isFalse(story.isPublic())
    assert.isTrue(story.isPrivate())
  })

  test('should throw error if title is empty', ({ assert }) => {
    assert.throws(() =>
      StoryFactory.create(new TestDateService(), new TestRandomService(), {
        title: '',
        synopsis: 'A great story',
        protagonist: 'Hero',
        childAge: 7,
        species: 'Human',
        conclusion: 'The end',
        coverImageUrl: 'https://example.com/cover.jpg',
        ownerId: '423e4567-e89b-12d3-a456-426614174000',
        isPublic: false,
        theme: createValidTheme(),
        language: createValidLanguage(),
        tone: createValidTone(),
        chapters: createValidChapters(),
      })
    )
  })

  test('should allow creating story without chapters', ({ assert }) => {
    const story = StoryFactory.create(new TestDateService(), new TestRandomService(), {
      title: 'My Story',
      synopsis: 'A great story',
      protagonist: 'Hero',
      childAge: 7,
      species: 'Human',
      conclusion: 'The end',
      coverImageUrl: 'https://example.com/cover.jpg',
      ownerId: '423e4567-e89b-12d3-a456-426614174000',
      isPublic: false,
      theme: createValidTheme(),
      language: createValidLanguage(),
      tone: createValidTone(),
      chapters: [],
    })

    assert.equal(story.numberOfChapters, 0)
  })

  test('should publish a story', ({ assert }) => {
    const story = StoryFactory.create(new TestDateService(), new TestRandomService(), {
      title: 'My Story',
      synopsis: 'A great story',
      protagonist: 'Hero',
      childAge: 7,
      species: 'Human',
      conclusion: 'The end',
      coverImageUrl: 'https://example.com/cover.jpg',
      ownerId: '423e4567-e89b-12d3-a456-426614174000',
      isPublic: false,
      theme: createValidTheme(),
      language: createValidLanguage(),
      tone: createValidTone(),
      chapters: createValidChapters(),
    })

    const publishedStory = story.publish()

    assert.isTrue(publishedStory.isPublic())
    assert.isFalse(story.isPublic())
  })

  test('should add a chapter to story', ({ assert }) => {
    const story = StoryFactory.create(new TestDateService(), new TestRandomService(), {
      title: 'My Story',
      synopsis: 'A great story',
      protagonist: 'Hero',
      childAge: 7,
      species: 'Human',
      conclusion: 'The end',
      coverImageUrl: 'https://example.com/cover.jpg',
      ownerId: '423e4567-e89b-12d3-a456-426614174000',
      isPublic: false,
      theme: createValidTheme(),
      language: createValidLanguage(),
      tone: createValidTone(),
      chapters: createValidChapters(),
    })

    const newChapter = ChapterFactory.create({
      position: 2,
      title: 'Chapter 2',
      content: 'This is chapter 2',
    })

    const updatedStory = story.addChapter(newChapter)

    assert.equal(updatedStory.numberOfChapters, 2)
    assert.equal(story.numberOfChapters, 1)
  })

  test('should get chapter by ID', ({ assert }) => {
    const story = StoryFactory.create(new TestDateService(), new TestRandomService(), {
      title: 'My Story',
      synopsis: 'A great story',
      protagonist: 'Hero',
      childAge: 7,
      species: 'Human',
      conclusion: 'The end',
      coverImageUrl: 'https://example.com/cover.jpg',
      ownerId: '423e4567-e89b-12d3-a456-426614174000',
      isPublic: false,
      theme: createValidTheme(),
      language: createValidLanguage(),
      tone: createValidTone(),
      chapters: [
        ChapterFactory.create({
          position: 1,
          title: 'Chapter 1',
          content: 'Content 1',
        }),
      ],
    })

    const chapter = story.getChapter(1)

    assert.isDefined(chapter)
    assert.equal(chapter?.title, 'Chapter 1')
  })
})
