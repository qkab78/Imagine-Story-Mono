import { test } from '@japa/runner'
import { ThemeBuilder } from "./theme.builder.js"
import { ToneBuilder } from "./tone.builder.js"
import { LanguageBuilder } from "./language.builder.js"
import { StoryBuilder } from "./story.builder.js"
import { IDateService } from '../services/IDateService.js'
import { StoryId } from '../value-objects/story-id.vo.js'
import { IRandomService } from '../services/IRandomService.js'

class TestDateService implements IDateService {
    public now(): string {
        return '2025-01-01T00:00:00.000Z'
    }
}

class TestRandomService implements IRandomService {
    public generateRandomUuid(): string {
        return '1234567890-1234-5678-9012-345678901234'
    }
}

test.group(StoryBuilder.name, () => {
    test('should create a story builder', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService())
        assert.isDefined(storyBuilder)
    })
    test('should build a story', async ({ assert }) => {
        const theme = ThemeBuilder.create().withId('1').withName('The name of the theme').withDescription('The description of the theme').build()
        const language = LanguageBuilder.create().withId('1').withName('The name of the language').withCode('The code of the language').build()
        const tone = ToneBuilder.create().withId('1').withName('The name of the tone').withDescription('The description of the tone').build()
        const storyBuilder = StoryBuilder.create(new TestDateService())
        const story = storyBuilder
            .withId(new StoryId(new TestRandomService()))
            .withTitle('The title of the story')
            .withSynopsis('The synopsis of the story')
            .withProtagonist('The protagonist of the story')
            .withChildAge(10)
            .withSpecies('The species of the story')
            .withConclusion('The conclusion of the story')
            .withCoverImageUrl('The cover image url of the story')
            .withOwnerId('The owner id of the story')
            .withIsPublic(true)
            .withPublicationDate()
            .withTheme(theme)
            .withLanguage(language)
            .withTone(tone)
            .withChapters([])
            .build()
        assert.isDefined(story)
        assert.equal(story.id.getValue(), '1234567890-1234-5678-9012-345678901234')
        assert.equal(story.title, 'The title of the story')
        assert.equal(story.synopsis, 'The synopsis of the story')
        assert.equal(story.protagonist, 'The protagonist of the story')
        assert.equal(story.childAge, 10)
        assert.equal(story.numberOfChapters, 0)
        assert.equal(story.species, 'The species of the story')
        assert.equal(story.conclusion, 'The conclusion of the story')
        assert.equal(story.coverImageUrl, 'The cover image url of the story')
        assert.equal(story.ownerId, 'The owner id of the story')
        assert.equal(story.isPublic, true)
        assert.equal(story.publicationDate.toISOString(), new TestDateService().now())
        assert.equal(story.theme, theme)
        assert.equal(story.language, language)
        assert.equal(story.tone, tone)
        assert.lengthOf(story.chapters, 0)
    })
    test('should throw an error if the id is not set', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService())
        assert.throws(() => storyBuilder.build(), 'Id is required')
    })
    test('should throw an error if the title is not set', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService()).withId(new StoryId(new TestRandomService()))
        assert.throws(() => storyBuilder.build(), 'Title is required')
    })
    test('should throw an error if the synopsis is not set', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService()).withId(new StoryId(new TestRandomService())).withTitle('The title of the story')
        assert.throws(() => storyBuilder.build(), 'Synopsis is required')
    })
    test('should throw an error if the protagonist is not set', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService()).withId(new StoryId(new TestRandomService())).withTitle('The title of the story').withSynopsis('The synopsis of the story')
        assert.throws(() => storyBuilder.build(), 'Protagonist is required')
    })
    test('should throw an error if the child age is not set', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService()).withId(new StoryId(new TestRandomService())).withTitle('The title of the story').withSynopsis('The synopsis of the story').withProtagonist('The protagonist of the story')
        assert.throws(() => storyBuilder.build(), 'Child age is required')
    })
    test('should throw an error if the species is not set', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService()).withId(new StoryId(new TestRandomService())).withTitle('The title of the story').withSynopsis('The synopsis of the story').withProtagonist('The protagonist of the story').withChildAge(10)
        assert.throws(() => storyBuilder.build(), 'Species is required')
    })
    test('should throw an error if the conclusion is not set', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService()).withId(new StoryId(new TestRandomService())).withTitle('The title of the story').withSynopsis('The synopsis of the story').withProtagonist('The protagonist of the story').withChildAge(10).withSpecies('The species of the story')
        assert.throws(() => storyBuilder.build(), 'Conclusion is required')
    })
    test('should throw an error if the cover image url is not set', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService()).withId(new StoryId(new TestRandomService())).withTitle('The title of the story').withSynopsis('The synopsis of the story').withProtagonist('The protagonist of the story').withChildAge(10).withSpecies('The species of the story').withConclusion('The conclusion of the story')
        assert.throws(() => storyBuilder.build(), 'Cover image url is required')
    })
    test('should throw an error if the owner id is not set', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService()).withId(new StoryId(new TestRandomService())).withTitle('The title of the story').withSynopsis('The synopsis of the story').withProtagonist('The protagonist of the story').withChildAge(10).withSpecies('The species of the story').withConclusion('The conclusion of the story').withCoverImageUrl('The cover image url of the story')
        assert.throws(() => storyBuilder.build(), 'Owner id is required')
    })
    test('should throw an error if the publication date is not set', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService()).withId(new StoryId(new TestRandomService())).withTitle('The title of the story').withSynopsis('The synopsis of the story').withProtagonist('The protagonist of the story').withChildAge(10).withSpecies('The species of the story').withConclusion('The conclusion of the story').withCoverImageUrl('The cover image url of the story').withOwnerId('The owner id of the story')
        assert.throws(() => storyBuilder.build(), 'Publication date is required')
    })
    test('should throw an error if the theme is not set', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService()).withId(new StoryId(new TestRandomService())).withTitle('The title of the story').withSynopsis('The synopsis of the story').withProtagonist('The protagonist of the story').withChildAge(10).withSpecies('The species of the story').withConclusion('The conclusion of the story').withCoverImageUrl('The cover image url of the story').withOwnerId('The owner id of the story').withPublicationDate()
        assert.throws(() => storyBuilder.build(), 'Theme is required')
    })
    test('should throw an error if the language is not set', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService()).withId(new StoryId(new TestRandomService())).withTitle('The title of the story').withSynopsis('The synopsis of the story').withProtagonist('The protagonist of the story').withChildAge(10).withSpecies('The species of the story').withConclusion('The conclusion of the story').withCoverImageUrl('The cover image url of the story').withOwnerId('The owner id of the story').withPublicationDate().withTheme(ThemeBuilder.create().withId('1').withName('The name of the theme').withDescription('The description of the theme').build())
        assert.throws(() => storyBuilder.build(), 'Language is required')
    })
    test('should throw an error if the tone is not set', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService()).withId(new StoryId(new TestRandomService())).withTitle('The title of the story').withSynopsis('The synopsis of the story').withProtagonist('The protagonist of the story').withChildAge(10).withSpecies('The species of the story').withConclusion('The conclusion of the story').withCoverImageUrl('The cover image url of the story').withOwnerId('The owner id of the story').withPublicationDate().withTheme(ThemeBuilder.create().withId('1').withName('The name of the theme').withDescription('The description of the theme').build()).withLanguage(LanguageBuilder.create().withId('1').withName('The name of the language').withCode('The code of the language').build())
        assert.throws(() => storyBuilder.build(), 'Tone is required')
    })
    test('should throw an error if the chapters are not set', async ({ assert }) => {
        const storyBuilder = StoryBuilder.create(new TestDateService())
            .withId(new StoryId(new TestRandomService()))
            .withTitle('The title of the story')
            .withSynopsis('The synopsis of the story').withProtagonist('The protagonist of the story').withChildAge(10).withSpecies('The species of the story').withConclusion('The conclusion of the story').withCoverImageUrl('The cover image url of the story').withOwnerId('The owner id of the story')
            .withPublicationDate()
            .withTheme(ThemeBuilder.create().withId('1').withName('The name of the theme').withDescription('The description of the theme').build())
            .withLanguage(LanguageBuilder.create().withId('1').withName('The name of the language').withCode('The code of the language').build())
            .withTone(ToneBuilder.create().withId('1').withName('The name of the tone').withDescription('The description of the tone').build())
        const story = storyBuilder.build()
        assert.isDefined(story)
        assert.lengthOf(story.chapters, 0)
    })
})