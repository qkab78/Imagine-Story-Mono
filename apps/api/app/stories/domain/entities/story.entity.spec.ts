import { test } from "@japa/runner";
import { Story } from "./story.entity.js";
import { StoryId } from "../value-objects/story-id.vo.js";
import { IRandomService } from "../services/IRandomService.js";
import { IDateService } from "../services/IDateService.js";
import { Theme } from "./theme.entity.js";
import { Language } from "./language.entity.js";
import { Tone } from "./tone.entity.js";
import { Chapter, ChapterImage } from "./chapter.entity.js";

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
        const story = new Story(
            storyId,
            'The title of the story',
            'The synopsis of the story',
            'The protagonist of the story',
            10, 
            10, 
            'The species of the story', 
            'The conclusion of the story', 
            'The cover image url of the story', 
            'The owner id of the story', 
            true, 
            new TestDateService().now(), 
            theme, 
            language,
            tone,
            [])
        assert.isDefined(story)
        assert.equal(story.id.getValue(), storyId.getValue())
        assert.equal(story.title, 'The title of the story')
        assert.equal(story.synopsis, 'The synopsis of the story')
        assert.equal(story.protagonist, 'The protagonist of the story')
        assert.equal(story.childAge, 10)
        assert.equal(story.numberOfChapters, 10)
        assert.equal(story.species, 'The species of the story')
        assert.equal(story.conclusion, 'The conclusion of the story')
        assert.equal(story.coverImageUrl, 'The cover image url of the story')
        assert.equal(story.ownerId, 'The owner id of the story')
        assert.equal(story.isPublic, true)
        assert.equal(story.createdAt, new TestDateService().now())
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
        const story = new Story(
            storyId,
            'The title of the story',
            'The synopsis of the story',
            'The protagonist of the story',
            10, 
            10, 
            'The species of the story', 
            'The conclusion of the story', 
            'The cover image url of the story', 
            'The owner id of the story', 
            true, 
            new TestDateService().now(), 
            theme, 
            language,
            tone,
            [])
        const chapterId = 1
        const chapterImage = new ChapterImage(chapterId, 'The image url of the chapter')
        const chapter = new Chapter(chapterId, 'The title of the chapter', 'The content of the chapter', chapterImage)
        story.addChapter(chapter)
        assert.equal(story.chapters.length, 1)
        assert.equal(story.chapters[0].id, chapter.id)
        assert.equal(story.chapters[0].content, chapter.content)
        assert.equal(story.chapters[0].image?.id, chapterImage.id)
        assert.equal(story.chapters[0].image?.imageUrl, chapterImage.imageUrl)
    })
})