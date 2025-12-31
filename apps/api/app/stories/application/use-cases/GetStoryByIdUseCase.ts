import { Chapter } from "#stories/domain/entities/chapter.entity";
import { Language } from "#stories/domain/value-objects/settings/Language.vo";
import { Story } from "#stories/domain/entities/story.entity";
import { Theme } from "#stories/domain/value-objects/settings/Theme.vo";
import { Tone } from "#stories/domain/value-objects/settings/Tone.vo";
import { IStoryRepository } from "#stories/domain/repositories/StoryRepository";
import { inject } from "@adonisjs/core";

interface GetStoryByIdPresenter {
    id: string
    title: string
    synopsis: string
    theme: Theme
    childAge: number
    numberOfChapters: number
    language: Language
    tone: Tone
    conclusion: string
    coverImageUrl: string
    ownerId: string
    isPublic: boolean
    publicationDate: string
    chapters: readonly Chapter[]
}

@inject()
export class GetStoryByIdUseCase {
    constructor(private readonly storyRepository: IStoryRepository) { }

    async execute(id: string): Promise<GetStoryByIdPresenter> {
        const story = await this.storyRepository.findById(id)

        if (!story) {
            throw new Error('Story not found')
        }

        return this.getStoryByIdPresenter(story)
    }

    private getStoryByIdPresenter(story: Story): GetStoryByIdPresenter {
        return {
            id: story.id.getValue(),
            title: story.title,
            synopsis: story.synopsis,
            theme: story.theme,
            childAge: story.childAge.getValue(),
            numberOfChapters: story.numberOfChapters,
            language: story.language,
            tone: story.tone,
            conclusion: story.conclusion,
            coverImageUrl: story.coverImageUrl.getValue(),
            ownerId: story.ownerId.getValue(),
            isPublic: story.isPublic(),
            publicationDate: story.publicationDate.toISOString(),
            chapters: story.chapters,
        }
    }
}