import { test } from '@japa/runner'
import { StoryBuilder } from './story.builder.js'
import { IDateService } from '../services/i_date_service.js'
import { StoryId } from '../value-objects/ids/story_id.vo.js'
import { IRandomService } from '../services/i_random_service.js'
import { Theme } from '../value-objects/settings/theme.vo.js'
import { Language } from '../value-objects/settings/language.vo.js'
import { Tone } from '../value-objects/settings/tone.vo.js'
import { OwnerId } from '../value-objects/ids/owner_id.vo.js'
import { ImageUrl } from '../value-objects/media/image_url.vo.js'
import { Chapter, ChapterImage } from '../entities/chapter.entity.js'
import { ChapterId } from '../value-objects/ids/chapter_id.vo.js'

class TestDateService implements IDateService {
  public now(): string {
    return '2025-01-01T00:00:00.000Z'
  }
}

class TestRandomService implements IRandomService {
  public generateRandomUuid(): string {
    return '1ed3df18-0bc3-4a08-aa6b-d5eb20e0dbc0'
  }
}

test.group(StoryBuilder.name, () => {
  test('should create a story builder', async ({ assert }) => {
    const storyBuilder = StoryBuilder.create(new TestDateService())
    assert.isDefined(storyBuilder)
  })
  test('should build a story', async ({ assert }) => {
    const theme = Theme.create(
      '1720955b-4474-4a1d-bf99-3907a000ba65',
      'The name of the theme',
      'The description of the theme',
      'adventure'
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
    const storyId = StoryId.generate(new TestRandomService())
    const owner = OwnerId.create('1720955b-4474-4a1d-bf99-3907a000ba65')
    const coverImageUrl = ImageUrl.create('https://example.com/image.jpg')
    const chapters = [
      Chapter.create(
        ChapterId.create(1),
        'The title of the chapter',
        'The content of the chapter',
        ChapterImage.create(ChapterId.create(1), coverImageUrl)
      ),
      Chapter.create(
        ChapterId.create(2),
        'The title of the chapter',
        'The content of the chapter',
        ChapterImage.create(ChapterId.create(2), coverImageUrl)
      ),
    ]
    const story = StoryBuilder.create(new TestDateService())
      .withId(storyId)
      .withTitle('The title of the story')
      .withSynopsis('The synopsis of the story')
      .withProtagonist('The protagonist of the story')
      .withChildAge(10)
      .withSpecies('The species of the story')
      .withConclusion('The conclusion of the story')
      .withCoverImageUrl(coverImageUrl.getValue())
      .withOwnerId(owner.getValue())
      .withIsPublic(true)
      .withPublicationDate()
      .withTheme(theme)
      .withLanguage(language)
      .withTone(tone)
      .withChapters(chapters)
      .build()
    assert.isDefined(story)
    assert.equal(story.id.getValue(), storyId.getValue())
    assert.equal(story.title, 'The title of the story')
    assert.equal(story.synopsis, 'The synopsis of the story')
    assert.equal(story.protagonist, 'The protagonist of the story')
    assert.equal(story.childAge, 10)
    assert.equal(story.numberOfChapters, 2)
    assert.equal(story.species, 'The species of the story')
    assert.equal(story.conclusion, 'The conclusion of the story')
    assert.equal(story.coverImageUrl, coverImageUrl.getValue())
    assert.equal(story.ownerId, owner.getValue())
    assert.equal(story.publicationStatus.isPublic(), true)
    assert.equal(story.publicationDate.toISOString(), new TestDateService().now())
    assert.equal(story.theme, theme)
    assert.equal(story.language.id, language.id)
    assert.equal(story.language.name, language.name)
    assert.equal(story.language.code, language.code)
    assert.equal(story.language.isFree, language.isFree)
    assert.equal(story.tone.id, tone.id)
    assert.equal(story.tone.name, tone.name)
    assert.equal(story.tone.description, tone.description)
    assert.lengthOf(story.chapters, 2)
  })
  test('should throw an error if the id is not set', async ({ assert }) => {
    const storyBuilder = StoryBuilder.create(new TestDateService())
    assert.throws(() => storyBuilder.build(), 'Id is required')
  })
  test('should throw an error if the title is not set', async ({ assert }) => {
    const storyBuilder = StoryBuilder.create(new TestDateService()).withId(
      StoryId.generate(new TestRandomService())
    )
    assert.throws(() => storyBuilder.build(), 'Title is required')
  })
  test('should throw an error if the synopsis is not set', async ({ assert }) => {
    const storyBuilder = StoryBuilder.create(new TestDateService())
      .withId(StoryId.generate(new TestRandomService()))
      .withTitle('The title of the story')
    assert.throws(() => storyBuilder.build(), 'Synopsis is required')
  })
  test('should throw an error if the protagonist is not set', async ({ assert }) => {
    const storyBuilder = StoryBuilder.create(new TestDateService())
      .withId(StoryId.generate(new TestRandomService()))
      .withTitle('The title of the story')
      .withSynopsis('The synopsis of the story')
    assert.throws(() => storyBuilder.build(), 'Protagonist is required')
  })
  test('should throw an error if the child age is not set', async ({ assert }) => {
    const storyBuilder = StoryBuilder.create(new TestDateService())
      .withId(StoryId.generate(new TestRandomService()))
      .withTitle('The title of the story')
      .withSynopsis('The synopsis of the story')
      .withProtagonist('The protagonist of the story')
    assert.throws(() => storyBuilder.build(), 'Child age is required')
  })
  test('should throw an error if the species is not set', async ({ assert }) => {
    const storyBuilder = StoryBuilder.create(new TestDateService())
      .withId(StoryId.generate(new TestRandomService()))
      .withTitle('The title of the story')
      .withSynopsis('The synopsis of the story')
      .withProtagonist('The protagonist of the story')
      .withChildAge(10)
    assert.throws(() => storyBuilder.build(), 'Species is required')
  })
  test('should throw an error if the conclusion is not set', async ({ assert }) => {
    const storyBuilder = StoryBuilder.create(new TestDateService())
      .withId(StoryId.generate(new TestRandomService()))
      .withTitle('The title of the story')
      .withSynopsis('The synopsis of the story')
      .withProtagonist('The protagonist of the story')
      .withChildAge(10)
      .withSpecies('The species of the story')
    assert.throws(() => storyBuilder.build(), 'Conclusion is required')
  })
  test('should throw an error if the cover image url is not set', async ({ assert }) => {
    const storyBuilder = StoryBuilder.create(new TestDateService())
      .withId(StoryId.generate(new TestRandomService()))
      .withTitle('The title of the story')
      .withSynopsis('The synopsis of the story')
      .withProtagonist('The protagonist of the story')
      .withChildAge(10)
      .withSpecies('The species of the story')
      .withConclusion('The conclusion of the story')
    assert.throws(() => storyBuilder.build(), 'Cover image url is required')
  })
  test('should throw an error if the owner id is not set', async ({ assert }) => {
    const storyBuilder = StoryBuilder.create(new TestDateService())
      .withId(StoryId.generate(new TestRandomService()))
      .withTitle('The title of the story')
      .withSynopsis('The synopsis of the story')
      .withProtagonist('The protagonist of the story')
      .withChildAge(10)
      .withSpecies('The species of the story')
      .withConclusion('The conclusion of the story')
      .withCoverImageUrl('The cover image url of the story')
    assert.throws(() => storyBuilder.build(), 'Owner id is required')
  })
  test('should throw an error if the publication date is not set', async ({ assert }) => {
    const storyBuilder = StoryBuilder.create(new TestDateService())
      .withId(StoryId.generate(new TestRandomService()))
      .withTitle('The title of the story')
      .withSynopsis('The synopsis of the story')
      .withProtagonist('The protagonist of the story')
      .withChildAge(10)
      .withSpecies('The species of the story')
      .withConclusion('The conclusion of the story')
      .withCoverImageUrl('The cover image url of the story')
      .withOwnerId('The owner id of the story')
    assert.throws(() => storyBuilder.build(), 'Publication date is required')
  })
  test('should throw an error if the theme is not set', async ({ assert }) => {
    const storyBuilder = StoryBuilder.create(new TestDateService())
      .withId(StoryId.generate(new TestRandomService()))
      .withTitle('The title of the story')
      .withSynopsis('The synopsis of the story')
      .withProtagonist('The protagonist of the story')
      .withChildAge(10)
      .withSpecies('The species of the story')
      .withConclusion('The conclusion of the story')
      .withCoverImageUrl('The cover image url of the story')
      .withOwnerId('The owner id of the story')
      .withPublicationDate()
    assert.throws(() => storyBuilder.build(), 'Theme is required')
  })
  test('should throw an error if the language is not set', async ({ assert }) => {
    const theme = Theme.create(
      '1720955b-4474-4a1d-bf99-3907a000ba65',
      'The name of the theme',
      'The description of the theme',
      'adventure'
    )
    const tone = Tone.create(
      '1720955b-4474-4a1d-bf99-3907a000ba65',
      'The name of the tone',
      'The description of the tone'
    )
    const coverImageUrl = ImageUrl.create('https://example.com/image.jpg')
    const owner = OwnerId.create('1720955b-4474-4a1d-bf99-3907a000ba65')
    const storyBuilder = StoryBuilder.create(new TestDateService())
      .withId(StoryId.generate(new TestRandomService()))
      .withTitle('The title of the story')
      .withSynopsis('The synopsis of the story')
      .withProtagonist('The protagonist of the story')
      .withChildAge(10)
      .withSpecies('The species of the story')
      .withConclusion('The conclusion of the story')
      .withCoverImageUrl(coverImageUrl.getValue())
      .withOwnerId(owner.getValue())
      .withPublicationDate()
      .withTheme(theme)
      .withTone(tone)
      .withChapters([])
    assert.throws(() => storyBuilder.build(), 'Language is required')
  })
  test('should throw an error if the tone is not set', async ({ assert }) => {
    const theme = Theme.create(
      '1720955b-4474-4a1d-bf99-3907a000ba65',
      'The name of the theme',
      'The description of the theme',
      'adventure'
    )
    const language = Language.create(
      '1720955b-4474-4a1d-bf99-3907a000ba65',
      'The name of the language',
      'The code of the language',
      true
    )
    const coverImageUrl = ImageUrl.create('https://example.com/image.jpg')
    const owner = OwnerId.create('1720955b-4474-4a1d-bf99-3907a000ba65')
    const storyBuilder = StoryBuilder.create(new TestDateService())
      .withId(StoryId.generate(new TestRandomService()))
      .withTitle('The title of the story')
      .withSynopsis('The synopsis of the story')
      .withProtagonist('The protagonist of the story')
      .withChildAge(10)
      .withSpecies('The species of the story')
      .withConclusion('The conclusion of the story')
      .withCoverImageUrl(coverImageUrl.getValue())
      .withOwnerId(owner.getValue())
      .withPublicationDate()
      .withTheme(theme)
      .withLanguage(language)
      .withChapters([])
    assert.throws(() => storyBuilder.build(), 'Tone is required')
  })
  test('should throw an error if the chapters are not set', async ({ assert }) => {
    const theme = Theme.create(
      '1720955b-4474-4a1d-bf99-3907a000ba65',
      'The name of the theme',
      'The description of the theme',
      'adventure'
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
    const coverImageUrl = ImageUrl.create('https://example.com/image.jpg')
    const owner = OwnerId.create('1720955b-4474-4a1d-bf99-3907a000ba65')
    const storyBuilder = StoryBuilder.create(new TestDateService())
      .withId(StoryId.generate(new TestRandomService()))
      .withTitle('The title of the story')
      .withSynopsis('The synopsis of the story')
      .withProtagonist('The protagonist of the story')
      .withChildAge(10)
      .withSpecies('The species of the story')
      .withConclusion('The conclusion of the story')
      .withCoverImageUrl(coverImageUrl.getValue())
      .withOwnerId(owner.getValue())
      .withPublicationDate()
      .withTheme(theme)
      .withLanguage(language)
      .withTone(tone)
    assert.throws(() => storyBuilder.build(), 'Chapters are required')
  })
})
