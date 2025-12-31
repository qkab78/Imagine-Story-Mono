import { test } from "@japa/runner";
import { CreateStoryUseCase } from "./CreateStoryUseCase.js";
import { CreateStoryPayload } from "./CreateStoryUseCase.js";
import { IStoryRepository } from "#stories/domain/repositories/StoryRepository";
import { Story } from "#stories/domain/entities/story.entity";
import { IRandomService } from "#stories/domain/services/IRandomService";
import { IDateService } from "#stories/domain/services/IDateService";
import { IStoryGenerationService, StoryChapterImagesPayload, StoryCharacterPayload, StoryCharacterProfilesPayload, StoryCharacterReferencePayload, StoryGenerationPayload, StoryImagePayload } from "#stories/domain/services/IStoryGeneration";
import { Chapter, ChapterImage } from "#stories/domain/entities/chapter.entity";
import { StoryGenerated } from "#stories/domain/services/types/StoryGenerated";
import string from "@adonisjs/core/helpers/string";
import { IToneRepository } from "#stories/domain/repositories/ToneRepository";
import { IThemeRepository } from "#stories/domain/repositories/ThemeRepository";
import { ILanguageRepository } from "#stories/domain/repositories/LanguageRepository";
import { LanguageId } from "#stories/domain/value-objects/ids/LanguageId.vo";
import { ThemeId } from "#stories/domain/value-objects/ids/ThemeId.vo";
import { ToneId } from "#stories/domain/value-objects/ids/ToneId.vo";
import { Theme } from "#stories/domain/value-objects/settings/Theme.vo";
import { Language } from "#stories/domain/value-objects/settings/Language.vo";
import { Tone } from "#stories/domain/value-objects/settings/Tone.vo";


test.group(CreateStoryUseCase.name, () => {
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
        public readonly stories: Story[] = []
        findById(_id: string): Promise<Story> {
            throw new Error("Method not implemented.")
        }
        findAll(_limit?: number, _offset?: number): Promise<{ stories: Story[]; total: number }> {
            throw new Error("Method not implemented.")
        }
        create(story: Story): Promise<Story> {
            this.stories.push(story)
            return Promise.resolve(story)
        }
    }
    class TestStoryGenerationService implements IStoryGenerationService {
        generateStory(payload: StoryGenerationPayload): Promise<StoryGenerated> {
            const chapter1 = new Chapter(1, 'The title of the chapter', 'The content of the chapter', null)
            const chapter2 = new Chapter(2, 'The title of the chapter', 'The content of the chapter', null)
            const chapters: Chapter[] = [chapter1, chapter2]

            const storyGenerated: StoryGenerated = {
                title: payload.title,
                synopsis: payload.synopsis,
                theme: payload.theme,
                protagonist: payload.protagonist,
                childAge: payload.childAge,
                numberOfChapters: payload.numberOfChapters,
                language: payload.language,
                tone: payload.tone,
                species: payload.species,
                conclusion: 'The conclusion of the story',
                slug: string.slug(payload.title, { lower: true, trim: true }),
                coverImageUrl: 'The cover image url of the story',
                ownerId: 'The owner id of the story',
                isPublic: true,
                chapters,
            }
            return Promise.resolve(storyGenerated)
        }
        generateImage(payload: StoryImagePayload): Promise<ChapterImage> {
            throw new Error("Method not implemented.")
        }
        generateCharacter(payload: StoryCharacterPayload): Promise<string> {
            throw new Error("Method not implemented.")
        }
        generateChapterImages(payload: StoryChapterImagesPayload): Promise<ChapterImage[]> {
            throw new Error("Method not implemented.")
        }
        generateCharacterReference(payload: StoryCharacterReferencePayload): Promise<string> {
            throw new Error("Method not implemented.")
        }
        generateCharacterProfiles(payload: StoryCharacterProfilesPayload): Promise<Record<string, any>[]> {
            throw new Error("Method not implemented.")
        }
    }
    class TestThemeRepository implements IThemeRepository {
        findById(id: ThemeId): Promise<Theme | null> {
            return Promise.resolve(Theme.create(id.getValue(), 'The name of the theme', 'The description of the theme'))
        }
        findAll(): Promise<Theme[]> {
            return Promise.resolve([Theme.create('1720955b-4474-4a1d-bf99-3907a000ba65', 'The name of the theme', 'The description of the theme')])
        }
    }
    class TestLanguageRepository implements ILanguageRepository {
        findById(id: LanguageId): Promise<Language | null> {
            return Promise.resolve(Language.create(id.getValue(), 'The name of the language', 'The code of the language', true))
        }
        findAll(): Promise<Language[]> {
            return Promise.resolve([Language.create('1720955b-4474-4a1d-bf99-3907a000ba65', 'The name of the language', 'The code of the language', true)])
        }
        
    }
    class TestToneRepository implements IToneRepository {
        findById(id: ToneId): Promise<Tone> {
            return Promise.resolve(Tone.create(id.getValue(), 'The name of the tone', 'The description of the tone'))
        }
        findAll(): Promise<Tone[]> {
            return Promise.resolve([Tone.create('1720955b-4474-4a1d-bf99-3907a000ba65', 'The name of the tone', 'The description of the tone')])
        }
    }
    test('should create a story', async ({ assert }) => {
        const storyRepository = new TestStoryRepository()
        const dateService = new TestDateService()
        const randomService = new TestRandomService()
        const storyGenerationService = new TestStoryGenerationService()
        const themeRepository = new TestThemeRepository()
        const languageRepository = new TestLanguageRepository()
        const toneRepository = new TestToneRepository()
        const createStoryUseCase = new CreateStoryUseCase(
            storyRepository,
            dateService,
            randomService,
            storyGenerationService,
            themeRepository,
            languageRepository,
            toneRepository
        )
        const payload: CreateStoryPayload = {
            title: 'The title of the story',
            synopsis: 'The synopsis of the story',
            theme: '1720955b-4474-4a1d-bf99-3907a000ba65',
            protagonist: 'The protagonist of the story',
            childAge: 10,
            numberOfChapters: 2,
            language: '1720955b-4474-4a1d-bf99-3907a000ba65',
            tone: '1720955b-4474-4a1d-bf99-3907a000ba65',
            species: 'The species of the story',
            conclusion: 'The conclusion of the story',
            coverImageUrl: 'The cover image url of the story',
            ownerId: '1720955b-4474-4a1d-bf99-3907a000ba65',
            isPublic: true,
        }
        const presenter = await createStoryUseCase.execute(payload)
        assert.isDefined(presenter)
        assert.equal(presenter.id, '1720955b-4474-4a1d-bf99-3907a000ba65')
        assert.equal(storyRepository.stories.length, 1)
    })
})