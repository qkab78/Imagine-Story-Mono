
import { test } from "@japa/runner"
import { GetStoryByIdUseCase } from "./GetStoryByIdUseCase.js"
import { IStoryRepository } from "#stories/domain/repositories/StoryRepository";
import { StoryId } from "#stories/domain/value-objects/story-id.vo";
import { Story } from "#stories/domain/entities/story.entity";
import { IRandomService } from "#stories/domain/services/IRandomService";
import { IDateService } from "#stories/domain/services/IDateService";
import { Language } from "#stories/domain/entities/language.entity";
import { Tone } from "#stories/domain/entities/tone.entity";
import { Theme } from "#stories/domain/entities/theme.entity";
import { ChapterImage } from "#stories/domain/entities/chapter.entity";
import { Chapter } from "#stories/domain/entities/chapter.entity";
import { StoryBuilder } from "#stories/domain/builders/story.builder";

test.group(GetStoryByIdUseCase.name, () => {
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
    const theme = new Theme('1', 'The name of the theme', 'The description of the theme')
    const language = new Language('1', 'The name of the language', 'The code of the language', true)
    const tone = new Tone('1', 'The name of the tone', 'The description of the tone')
    const chapters = [
        new Chapter(1, 'The title of the chapter', 'The content of the chapter', new ChapterImage(1, 'The image url of the chapter')),
        new Chapter(2, 'The title of the chapter', 'The content of the chapter', new ChapterImage(2, 'The image url of the chapter')),
    ]
    const storyId = new StoryId(new TestRandomService())
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
            .withCreatedAt(new TestDateService().now())
            .withTheme(theme)
            .withLanguage(language)
            .withTone(tone)
            .withChapters(chapters)
            .build()
    class TestStoryRepository implements IStoryRepository {
        private readonly stories: Story[] = [story]
        async findById(id: string): Promise<Story> {
            const story = this.stories.find(story => story.id.getValue() === id)
            if (!story) {
                throw new Error("Story not found")
            }
            return story
        }
        findAll(_limit?: number, _offset?: number): Promise<{ stories: Story[]; total: number }> {
            throw new Error("Method not implemented.")
        }
        create(_story: Story): Promise<Story> {
            throw new Error("Method not implemented.")
        }
    }
    test('should get a story by id', async ({ assert }) => {
        const getStoryByIdUseCase = new GetStoryByIdUseCase(new TestStoryRepository())
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
        assert.equal(story.numberOfChapters, 2)
        assert.equal(story.conclusion, 'The conclusion of the story')
        assert.equal(story.coverImageUrl, 'The cover image url of the story')
        assert.equal(story.ownerId, 'The owner id of the story')
        assert.equal(story.isPublic, true)
        assert.equal(story.createdAt, new TestDateService().now())
    })
})