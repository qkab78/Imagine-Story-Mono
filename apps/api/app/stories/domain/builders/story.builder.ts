import { Story } from "../entities/story.entity.js"
import { Tone } from "../entities/tone.entity.js"
import { Chapter } from "../entities/chapter.entity.js"
import { Theme } from "../entities/theme.entity.js"
import { Language } from "../entities/language.entity.js"
import { IDateService } from "../services/IDateService.js"

export class StoryBuilder {
    public id: string | undefined
    public title: string | undefined
    public synopsis: string | undefined
    public protagonist: string | undefined
    public childAge: number | undefined
    public numberOfChapters: number | undefined
    public species: string | undefined
    public conclusion: string | undefined
    public coverImageUrl: string | undefined
    public ownerId: string | undefined
    public isPublic: boolean = false
    public createdAt: string | undefined
    public theme: Theme | undefined
    public language: Language | undefined
    public tone: Tone | undefined
    public chapters: Chapter[] = []

    private constructor(private readonly dateService: IDateService) {}

    static create(dateService: IDateService): StoryBuilder {
        return new StoryBuilder(dateService)
    }

    withId(id: string): StoryBuilder {
        this.id = id
        return this
    }

    withTitle(title: string): StoryBuilder {
        this.title = title
        return this
    }

    withSynopsis(synopsis: string): StoryBuilder {
        this.synopsis = synopsis
        return this
    }

    withProtagonist(protagonist: string): StoryBuilder {
        this.protagonist = protagonist
        return this
    }

    withChildAge(childAge: number): StoryBuilder {
        this.childAge = childAge
        return this
    }

    withNumberOfChapters(numberOfChapters: number): StoryBuilder {
        this.numberOfChapters = numberOfChapters
        return this
    }


    withSpecies(species: string): StoryBuilder {
        this.species = species
        return this
    }

    withConclusion(conclusion: string): StoryBuilder {
        this.conclusion = conclusion
        return this
    }

    withCoverImageUrl(coverImageUrl: string): StoryBuilder {
        this.coverImageUrl = coverImageUrl
        return this
    }

    withOwnerId(ownerId: string): StoryBuilder {
        this.ownerId = ownerId
        return this
    }

    withIsPublic(isPublic: boolean): StoryBuilder {
        this.isPublic = isPublic
        return this
    }

    withCreatedAt(): StoryBuilder {
        this.createdAt = this.dateService.now()
        return this
    }

    withTheme(theme: Theme): StoryBuilder {
        this.theme = theme
        return this
    }

    withLanguage(language: Language): StoryBuilder {
        this.language = language
        return this
    }

    withTone(tone: Tone): StoryBuilder {
        this.tone = tone
        return this
    }

    withChapters(chapters: Chapter[]): StoryBuilder {
        this.chapters = chapters
        return this
    }

    public build(): Story {
        if (!this.id) {
            throw new Error('Id is required')
        }
        if (!this.title) {
            throw new Error('Title is required')
        }
        if (!this.synopsis) {
            throw new Error('Synopsis is required')
        }
        if (!this.protagonist) {
            throw new Error('Protagonist is required')
        }
        if (!this.childAge) {
            throw new Error('Child age is required')
        }
        if (!this.numberOfChapters) {
            throw new Error('Number of chapters is required')
        }
        if (!this.species) {
            throw new Error('Species is required')
        }
        if (!this.conclusion) {
            throw new Error('Conclusion is required')
        }
        if (!this.coverImageUrl) {
            throw new Error('Cover image url is required')
        }
        if (!this.ownerId) {
            throw new Error('Owner id is required')
        }
        if (!this.createdAt) {
            throw new Error('Created at is required')
        }
        if (!this.theme) {
            throw new Error('Theme is required')
        }
        if (!this.language) {
            throw new Error('Language is required')
        }
        if (!this.tone) {
            throw new Error('Tone is required')
        }
        if (!this.chapters) {
            throw new Error('Chapters are required')
        }
        return new Story(
            this.id,
            this.title,
            this.synopsis,
            this.protagonist,
            this.childAge,
            this.numberOfChapters,
            this.species,
            this.conclusion,
            this.coverImageUrl,
            this.ownerId,
            this.isPublic,
            this.createdAt,
            this.theme,
            this.language,
            this.tone,
            this.chapters,
        )
    }
}