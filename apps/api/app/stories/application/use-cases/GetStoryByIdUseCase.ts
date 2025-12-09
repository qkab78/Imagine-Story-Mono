import { Chapter } from "#stories/domain/entities/chapter.entity";
import { Language } from "#stories/domain/entities/language.entity";
import { Story } from "#stories/domain/entities/story.entity";
import { Theme } from "#stories/domain/entities/theme.entity";
import { Tone } from "#stories/domain/entities/tone.entity";
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
    createdAt: string
    chapters: Chapter[]
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
            childAge: story.childAge,
            numberOfChapters: story.numberOfChapters,
            language: story.language,
            tone: story.tone,
            conclusion: story.conclusion,
            coverImageUrl: story.coverImageUrl,
            ownerId: story.ownerId,
            isPublic: story.isPublic,
            createdAt: story.createdAt,
            chapters: story.chapters,
        }
    }
}