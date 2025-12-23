import { test } from "@japa/runner";
import { Story } from "./story.entity.js";
import { StoryId } from "../value-objects/story-id.vo.js";
import { IRandomService } from "../services/IRandomService.js";
import { IDateService } from "../services/IDateService.js";
import { Theme } from "./theme.entity.js";
import { Language } from "./language.entity.js";
import { Tone } from "./tone.entity.js";
import { Chapter, ChapterImage } from "./chapter.entity.js";
import { StoryBuilder } from "../builders/story.builder.js";
import { CreationDate } from "../value-objects/creation-date.vo.js";

class TestRandomService implements IRandomService {
    public generateRandomUuid(): string {
        return '1234567890-1234-5678-9012-345678901234'
    }
}

class TestDateService implements IDateService {
    public now(): string {
        return '2025-01-01T00:00:00.000Z'
    }
}

test.group(Story.name, () => {
    const theme = new Theme('1', 'The name of the theme', 'The description of the theme')
    const language = new Language('1', 'The name of the language', 'The code of the language', true)
    const tone = new Tone('1', 'The name of the tone', 'The description of the tone')
    const storyId = new StoryId(new TestRandomService())
    test('should create a story', async ({ assert }) => {
        const story = StoryBuilder.create(new TestDateService())
            .withId(storyId)
            .withTitle('The title of the story')
            .withSynopsis('The synopsis of the story')
            .withProtagonist('The protagonist of the story')
            .withChildAge(10)
            .withSpecies('The species of the story')
            .withConclusion('The conclusion of the story')
            .withCoverImageUrl('The cover image url of the story')
            .withOwnerId('The owner id of the story')
            .withIsPublic(true)
            .withPublicationDate(CreationDate.fromString(new TestDateService().now()))
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
        assert.equal(story.theme.id, theme.id)
        assert.equal(story.theme.name, theme.name)
        assert.equal(story.theme.description, theme.description)
        assert.equal(story.language.id, language.id)
        assert.equal(story.language.name, language.name)
        assert.equal(story.language.code, language.code)
        assert.equal(story.language.isFree, language.isFree)
        assert.equal(story.tone.id, tone.id)
        assert.equal(story.tone.name, tone.name)
        assert.equal(story.tone.description, tone.description)
        assert.equal(story.chapters.length, 0)
    })

    test('should add a chapter to the story', async ({ assert }) => {
        const story = StoryBuilder.create(new TestDateService())
            .withId(storyId)
            .withTitle('The title of the story')
            .withSynopsis('The synopsis of the story')
            .withProtagonist('The protagonist of the story')
            .withChildAge(10)
            .withSpecies('The species of the story')
            .withConclusion('The conclusion of the story')
            .withCoverImageUrl('The cover image url of the story')
            .withOwnerId('The owner id of the story')
            .withIsPublic(true)
            .withPublicationDate(CreationDate.fromString(new TestDateService().now()))
            .withTheme(theme)
            .withLanguage(language)
            .withTone(tone)
            .withChapters([])
            .build()
        const chapterId = 1
        const chapterImage = new ChapterImage(chapterId, 'The image url of the chapter')
        const chapter = new Chapter(chapterId, 'The title of the chapter', 'The content of the chapter', chapterImage)

        const updatedStory = story.addChapter(chapter, StoryBuilder.create(new TestDateService()))

        assert.equal(updatedStory.chapters.length, 1)
        assert.equal(updatedStory.numberOfChapters, 1)
        assert.equal(updatedStory.chapters[0].id, chapter.id)
        assert.equal(updatedStory.chapters[0].title, chapter.title)
        assert.equal(updatedStory.chapters[0].content, chapter.content)
        assert.equal(updatedStory.chapters[0].image?.id, chapterImage.id)
        assert.equal(updatedStory.chapters[0].image?.imageUrl, chapterImage.imageUrl)
        assert.equal(story.chapters.length, 0) // Original story should not be modified
        assert.equal(story.numberOfChapters, 0) // Original numberOfChapters should still be 0
    })

    test('should get a chapter by id', async ({ assert }) => {
        const chapterId = 1
        const chapterImage = new ChapterImage(chapterId, 'The image url of the chapter')
        const chapter = new Chapter(chapterId, 'The title of the chapter', 'The content of the chapter', chapterImage)

        const story = StoryBuilder.create(new TestDateService())
            .withId(storyId)
            .withTitle('The title of the story')
            .withSynopsis('The synopsis of the story')
            .withProtagonist('The protagonist of the story')
            .withChildAge(10)
            .withSpecies('The species of the story')
            .withConclusion('The conclusion of the story')
            .withCoverImageUrl('The cover image url of the story')
            .withOwnerId('The owner id of the story')
            .withIsPublic(true)
            .withPublicationDate(CreationDate.fromString(new TestDateService().now()))
            .withTheme(theme)
            .withLanguage(language)
            .withTone(tone)
            .withChapters([chapter])
            .build()

        const foundChapter = story.getChapter(chapterId)

        assert.isDefined(foundChapter)
        assert.equal(foundChapter?.id, chapter.id)
        assert.equal(foundChapter?.title, chapter.title)
        assert.equal(foundChapter?.content, chapter.content)
    })

    test('should return undefined when chapter is not found', async ({ assert }) => {
        const story = StoryBuilder.create(new TestDateService())
            .withId(storyId)
            .withTitle('The title of the story')
            .withSynopsis('The synopsis of the story')
            .withProtagonist('The protagonist of the story')
            .withChildAge(10)
            .withSpecies('The species of the story')
            .withConclusion('The conclusion of the story')
            .withCoverImageUrl('The cover image url of the story')
            .withOwnerId('The owner id of the story')
            .withIsPublic(true)
            .withPublicationDate(CreationDate.fromString(new TestDateService().now()))
            .withTheme(theme)
            .withLanguage(language)
            .withTone(tone)
            .withChapters([])
            .build()

        const foundChapter = story.getChapter(999)

        assert.isUndefined(foundChapter)
    })

    test('should get all chapters', async ({ assert }) => {
        const chapter1 = new Chapter(1, 'Chapter 1', 'Content 1', null)
        const chapter2 = new Chapter(2, 'Chapter 2', 'Content 2', null)

        const story = StoryBuilder.create(new TestDateService())
            .withId(storyId)
            .withTitle('The title of the story')
            .withSynopsis('The synopsis of the story')
            .withProtagonist('The protagonist of the story')
            .withChildAge(10)
            .withSpecies('The species of the story')
            .withConclusion('The conclusion of the story')
            .withCoverImageUrl('The cover image url of the story')
            .withOwnerId('The owner id of the story')
            .withIsPublic(true)
            .withPublicationDate(CreationDate.fromString(new TestDateService().now()))
            .withTheme(theme)
            .withLanguage(language)
            .withTone(tone)
            .withChapters([chapter1, chapter2])
            .build()

        const chapters = story.getAllChapters()

        assert.equal(chapters.length, 2)
        assert.equal(story.numberOfChapters, 2)
        assert.equal(chapters[0].id, chapter1.id)
        assert.equal(chapters[1].id, chapter2.id)
    })
})