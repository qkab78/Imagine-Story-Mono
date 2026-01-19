import { test } from "@japa/runner";
import { CreateStoryUseCase } from "./CreateStoryUseCase.js";
import { CreateStoryPayload } from "./CreateStoryUseCase.js";
import { IStoryRepository } from "#stories/domain/repositories/StoryRepository";
import { Story } from "#stories/domain/entities/story.entity";
import { IRandomService } from "#stories/domain/services/IRandomService";
import { IDateService } from "#stories/domain/services/IDateService";
import { IStoryGenerationService, StoryChapterImagesPayload, StoryCharacterPayload, StoryCharacterProfilesPayload, StoryCharacterReferencePayload, StoryGenerationPayload, StoryImagePayload } from "#stories/domain/services/IStoryGeneration";

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
import { ChapterFactory } from "#stories/domain/factories/ChapterFactory";
import { ImageUrl } from "#stories/domain/value-objects/media/ImageUrl.vo";
import { StoryId } from "#stories/domain/value-objects/ids/StoryId.vo";
import type { IDomainEventPublisher } from "#stories/domain/events/IDomainEventPublisher";
import type { DomainEvent } from "#stories/domain/events/DomainEvent";
import { StoryId as StoryIdVO } from "#stories/domain/value-objects/ids/StoryId.vo";
import { Slug } from "#stories/domain/value-objects/metadata/Slug.vo";
import { OwnerId } from "#stories/domain/value-objects/ids/OwnerId.vo";
import type { StoryFilters, PaginationParams, PaginatedResult } from "#stories/application/use-cases/story/ListPublicStoriesUseCase";


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
        findById(_id: StoryIdVO | string): Promise<Story | null> {
            throw new Error("Method not implemented.")
        }
        findBySlug(_slug: Slug): Promise<Story | null> {
            throw new Error("Method not implemented.")
        }
        findByOwnerId(_ownerId: OwnerId, _pagination: PaginationParams): Promise<PaginatedResult<Story>> {
            throw new Error("Method not implemented.")
        }
        findPublicStories(_filters: StoryFilters, _pagination: PaginationParams): Promise<PaginatedResult<Story>> {
            throw new Error("Method not implemented.")
        }
        existsBySlug(_slug: Slug, _excludeId?: StoryIdVO): Promise<boolean> {
            throw new Error("Method not implemented.")
        }
        create(story: Story): Promise<Story> {
            this.stories.push(story)
            return Promise.resolve(story)
        }
        save(_story: Story): Promise<void> {
            throw new Error("Method not implemented.")
        }
        delete(_id: StoryIdVO): Promise<void> {
            throw new Error("Method not implemented.")
        }
        findAll(_limit?: number, _offset?: number): Promise<{ stories: Story[]; total: number }> {
            throw new Error("Method not implemented.")
        }
        findByJobId(_jobId: string): Promise<Story | null> {
            throw new Error("Method not implemented.")
        }
        findPendingStories(): Promise<Story[]> {
            throw new Error("Method not implemented.")
        }
        findByGenerationStatus(_status: any): Promise<Story[]> {
            throw new Error("Method not implemented.")
        }
        countByOwnerIdAndDateRange(_ownerId: OwnerId, _startDate: Date, _endDate: Date): Promise<number> {
            throw new Error("Method not implemented.")
        }
        searchByTitle(_query: string, _limit?: number): Promise<Story[]> {
            throw new Error("Method not implemented.")
        }
    }
    class TestStoryGenerationService implements IStoryGenerationService {
        generateStory(payload: StoryGenerationPayload): Promise<StoryGenerated> {
            const chapter1 = ChapterFactory.create({
                position: 1,
                title: 'The title of the chapter',
                content: 'The content of the chapter',
                imageUrl: 'https://example.com/image.jpg',
            })
            const chapter2 = ChapterFactory.create({
                position: 2,
                title: 'The title of the chapter',
                content: 'The content of the chapter',
                imageUrl: 'https://example.com/image.jpg',
            })
            const chapters = [chapter1, chapter2]

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
                coverImageUrl: 'https://example.com/image.jpg',
                ownerId: '1720955b-4474-4a1d-bf99-3907a000ba65',
                isPublic: true,
                chapters,
            }
            return Promise.resolve(storyGenerated)
        }
        generateImage(_payload: StoryImagePayload): Promise<ImageUrl> {
            return Promise.resolve(ImageUrl.create('https://example.com/image.jpg'))
        }
        generateCharacter(_payload: StoryCharacterPayload): Promise<string> {
            throw new Error("Method not implemented.")
        }
        generateChapterImages(_payload: StoryChapterImagesPayload): Promise<ImageUrl[]> {
            return Promise.resolve([
                ImageUrl.create('https://example.com/image.jpg'),
                ImageUrl.create('https://example.com/image.jpg'),
            ])
        }
        generateCharacterReference(_payload: StoryCharacterReferencePayload): Promise<string> {
            throw new Error("Method not implemented.")
        }
        generateCharacterProfiles(_payload: StoryCharacterProfilesPayload): Promise<Record<string, any>[]> {
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
    class TestEventPublisher implements IDomainEventPublisher {
        public readonly events: DomainEvent[] = []
        async publish(event: DomainEvent): Promise<void> {
            this.events.push(event)
        }
        async publishMany(events: DomainEvent[]): Promise<void> {
            this.events.push(...events)
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
        const eventPublisher = new TestEventPublisher()
        const createStoryUseCase = new CreateStoryUseCase(
            storyRepository,
            dateService,
            randomService,
            storyGenerationService,
            themeRepository,
            languageRepository,
            toneRepository,
            eventPublisher
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
            coverImageUrl: 'https://example.com/image.jpg',
            ownerId: '1720955b-4474-4a1d-bf99-3907a000ba65',
            isPublic: true,
        }
        const presenter = await createStoryUseCase.execute(payload)
        assert.isDefined(presenter)
        assert.equal(presenter.id, StoryId.create('1720955b-4474-4a1d-bf99-3907a000ba65').getValue())
        assert.equal(storyRepository.stories.length, 1)
        assert.equal(eventPublisher.events.length, 1)
        assert.equal(eventPublisher.events[0].eventName, 'story.created')
    })
})