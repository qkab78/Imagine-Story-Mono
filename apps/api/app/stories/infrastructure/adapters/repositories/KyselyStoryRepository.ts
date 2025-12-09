import { IStoryRepository } from "#stories/domain/repositories/StoryRepository"
import { db } from "#services/db"
import { Story } from "#stories/domain/entities/story.entity"
import { StoryBuilder } from "#stories/domain/builders/story.builder"
import app from "@adonisjs/core/services/app"
import { StoryId } from "#stories/domain/value-objects/story-id.vo"
import { DateService } from "../services/date.service.js"
import { RandomService } from "../services/random.service.js"
import { Chapter, ChapterImage } from "#stories/domain/entities/chapter.entity"
import { ThemeBuilder } from "#stories/domain/builders/theme.builder"
import { LanguageBuilder } from "#stories/domain/builders/language.builder"
import { ToneBuilder } from "#stories/domain/builders/tone.builder"

interface IKyselyStoryChapter {
    content: string
    title: string
}

interface IKyselyStoryChapterImage {
    chapterIndex: number
    chapterTitle: string
    imagePath: string
}

export class KyselyStoryRepository implements IStoryRepository {
    create(_story: Story): Promise<{ id: StoryId }> {
        throw new Error("Method not implemented.")
    }

    async findById(id: string): Promise<Story> {
        const dateService = await app.container.make(DateService)
        const randomService = await app.container.make(RandomService)
        const storyData = await db.selectFrom('stories').where('id', '=', id).selectAll().executeTakeFirst()
        if (!storyData) {
            throw new Error('Story not found')
        }
        const [themeData, toneData, languageData] = await Promise.all([
            db.selectFrom('themes').where('id', '=', storyData.theme_id as string).selectAll().executeTakeFirst(),
            db.selectFrom('tones').where('id', '=', storyData.tone_id as string).selectAll().executeTakeFirst(),
            db.selectFrom('languages').where('id', '=', storyData.language_id as string).selectAll().executeTakeFirst(),
        ])
        if (!themeData || !toneData || !languageData) {
            throw new Error('Theme, tone or language not found')
        }
        const storyChapters = (storyData.story_chapters as unknown as IKyselyStoryChapter[]).map((chapter: IKyselyStoryChapter, index: number) => {
            const chapterImage = (storyData.chapter_images as unknown as IKyselyStoryChapterImage[]).find((image: IKyselyStoryChapterImage) => {
                return image.chapterIndex === index
            })
            const chapterImageUrl = chapterImage?.imagePath.split('/').pop() || ''
            const chapterId = index + 1

            if (!chapterImageUrl) {
                return new Chapter(
                    chapterId,
                    chapter.title,
                    chapter.content,
                    null,
                )
            }

            return new Chapter(
                chapterId,
                chapter.title,
                chapter.content,
                new ChapterImage(chapterId, chapterImageUrl),
            )
        }) || []

        const theme = ThemeBuilder.create()
            .withId(themeData.id)
            .withName(themeData.name)
            .withDescription(themeData.description)
            .build()
        const language = LanguageBuilder.create()
            .withId(languageData.id)
            .withName(languageData.name)
            .withIsFree(languageData.is_free)
            .withCode(languageData.code)
            .build()
            const tone = ToneBuilder.create()
            .withId(toneData.id)
            .withName(toneData.name)
            .withDescription(toneData.description ?? '')
            .build()

        return StoryBuilder.create(dateService)
            .withId(new StoryId(randomService, storyData.id.toString()))
            .withTitle(storyData.title)
            .withSynopsis(storyData.synopsis)
            .withProtagonist(storyData.protagonist)
            .withChildAge(storyData.child_age)
            .withNumberOfChapters(storyData.chapters)
            .withSpecies(storyData.species)
            .withConclusion(storyData.conclusion)
            .withCoverImageUrl(storyData.cover_image)
            .withOwnerId(storyData.user_id)
            .withIsPublic(storyData.public)
            .withChapters(storyChapters)
            .withTheme(theme)
            .withLanguage(language)
            .withTone(tone)
            .withCreatedAt(storyData.created_at.toISOString())
            .withCoverImageUrl(storyData.cover_image)
            .build()
    }

    async findAll(): Promise<{ stories: Story[], total: number }> {
        throw new Error("Method not implemented.")
    }
}