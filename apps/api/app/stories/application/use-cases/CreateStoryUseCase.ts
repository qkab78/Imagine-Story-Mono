import { StoryBuilder } from "#stories/domain/builders/story.builder";
import { Story } from "#stories/domain/entities/story.entity";
import { IStoryRepository } from "#stories/domain/repositories/StoryRepository";
import { StoryId } from "#stories/domain/value-objects/story-id.vo";
import { inject } from "@adonisjs/core";
import { IDateService } from "#stories/domain/services/IDateService";
import { IRandomService } from "#stories/domain/services/IRandomService";
import { IStoryGenerationService } from "#stories/domain/services/IStoryGeneration";
import { IThemeRepository } from "#stories/domain/repositories/ThemeRepository";
import { ILanguageRepository } from "#stories/domain/repositories/LanguageRepository";
import { IToneRepository } from "#stories/domain/repositories/ToneRepository";

export interface CreateStoryPayload {
    title: string
    synopsis: string
    theme: string
    protagonist: string
    childAge: number
    numberOfChapters: number
    language: string
    tone: string
    species: string
    conclusion: string
    coverImageUrl: string
    ownerId: string
    isPublic: boolean
}

export interface CreateStoryPresenter {
    id: string
}

@inject()
export class CreateStoryUseCase {
    constructor(
        private readonly storyRepository: IStoryRepository,
        private readonly dateService: IDateService,
        private readonly randomService: IRandomService,
        private readonly storyGenerationService: IStoryGenerationService,
        private readonly themeRepository: IThemeRepository,
        private readonly languageRepository: ILanguageRepository,
        private readonly toneRepository: IToneRepository,
    ) { }

    async execute(payload: CreateStoryPayload): Promise<CreateStoryPresenter> {
        // Call the AI Service to generate the story
        const generatedStory = await this.storyGenerationService.generateStory(payload)

        const [theme, language, tone] = await Promise.all([
            this.themeRepository.findById(generatedStory.theme),
            this.languageRepository.findById(generatedStory.language),
            this.toneRepository.findById(generatedStory.tone),
        ])

        if (!theme || !language || !tone) {
            throw new Error('Theme, language or tone not found')
        }

        if (generatedStory.chapters.length !== generatedStory.numberOfChapters) {
            throw new Error('The number of chapters is not the same as the number of chapters generated')
        }

        // Create the story
        const storyId = new StoryId(this.randomService)

        const story = StoryBuilder.create(this.dateService)
            .withId(storyId)
            .withTitle(generatedStory.title)
            .withSynopsis(generatedStory.synopsis)
            .withProtagonist(generatedStory.protagonist)
            .withChildAge(generatedStory.childAge)
            .withLanguage(language)
            .withTone(tone)
            .withSpecies(generatedStory.species)
            .withConclusion(generatedStory.conclusion)
            .withCoverImageUrl(generatedStory.coverImageUrl)
            .withOwnerId(generatedStory.ownerId)
            .withIsPublic(generatedStory.isPublic)
            .withPublicationDate()
            .withTheme(theme)
            .withChapters(generatedStory.chapters)
            .build()
        const createdStory = await this.storyRepository.create(story)
        return this.createStoryPresenter(createdStory)
    }

    private createStoryPresenter(story: Story): CreateStoryPresenter {
        return {
            id: story.id.getValue(),
        }
    }
}