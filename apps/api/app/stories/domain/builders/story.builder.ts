import { Story } from '../entities/story.entity.js'
import { Tone } from '../value-objects/settings/Tone.vo.js'
import { Theme } from '../value-objects/settings/Theme.vo.js'
import { Language } from '../value-objects/settings/Language.vo.js'
import { StoryId } from '../value-objects/ids/StoryId.vo.js'
import { Chapter } from '#stories/domain/entities/chapter.entity'
import { ImageUrl } from '../value-objects/media/ImageUrl.vo.js'
import { Slug } from '../value-objects/metadata/Slug.vo.js'
import { OwnerId } from '../value-objects/ids/OwnerId.vo.js'
import { ChildAge } from '../value-objects/metadata/ChildAge.vo.js'
import { PublicationStatus } from '../value-objects/metadata/PublicationStatus.vo.js'
import { PublicationDate } from '../value-objects/metadata/PublicationDate.vo.js'
import { IDateService } from '#stories/domain/services/IDateService'

export class StoryBuilder {
    private dateService: IDateService
    public id: StoryId | undefined
    public title: string | undefined
    public synopsis: string | undefined
    public protagonist: string | undefined
    public childAge: number | undefined
    public species: string | undefined
    public conclusion: string | undefined
    public coverImageUrl: string | undefined
    public ownerId: string | undefined
    public isPublic: boolean = false
    public publicationDate: PublicationDate | undefined
    public theme: Theme | undefined
    public language: Language | undefined
    public tone: Tone | undefined
    public chapters: Chapter[] = []

    private constructor(dateService: IDateService) {
        this.dateService = dateService
    }

    public static create(dateService: IDateService): StoryBuilder {
        return new StoryBuilder(dateService)
    }

    withId(id: StoryId): StoryBuilder {
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

    withPublicationDate(publicationDate?: PublicationDate): StoryBuilder {
        this.publicationDate = publicationDate ?? PublicationDate.now(this.dateService)
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
        if (!this.publicationDate) {
            throw new Error('Publication date is required')
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
        if (this.chapters.length === 0) {
            throw new Error('Chapters are required')
        }
        return Story.create(
            this.id,
            Slug.fromTitle(this.title),
            ChildAge.create(this.childAge),
            ImageUrl.create(this.coverImageUrl),
            OwnerId.create(this.ownerId),
            PublicationDate.now(this.dateService),
            this.isPublic ? PublicationStatus.public() : PublicationStatus.private(),
            this.title,
            this.synopsis,
            this.protagonist,
            this.species,
            this.conclusion,
            this.theme,
            this.language,
            this.tone,
            this.chapters,
        )
    }
}