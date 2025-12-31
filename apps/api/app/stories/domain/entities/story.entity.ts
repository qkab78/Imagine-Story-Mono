import type { Chapter } from './chapter.entity.js'
import type { Theme } from '../value-objects/settings/Theme.vo.js'
import type { Language } from '../value-objects/settings/Language.vo.js'
import type { Tone } from '../value-objects/settings/Tone.vo.js'
import type { StoryId } from '../value-objects/story-id.vo.js'
import type { StoryBuilder } from '../builders/story.builder.js'
import type { CreationDate } from '../value-objects/creation-date.vo.js'

export class Story {
    constructor(
        public readonly id: StoryId,
        public readonly title: string,
        public readonly synopsis: string,
        public readonly protagonist: string,
        public readonly childAge: number,
        public readonly species: string,
        public readonly conclusion: string,
        public readonly coverImageUrl: string,
        public readonly ownerId: string,
        public readonly isPublic: boolean,
        public readonly publicationDate: CreationDate,
        public readonly theme: Theme,
        public readonly language: Language,
        public readonly tone: Tone,
        public readonly chapters: readonly Chapter[],
    ) {}

    get numberOfChapters(): number {
        return this.chapters.length;
    }

    toBuilder(builderInstance: StoryBuilder): StoryBuilder {
        return builderInstance
            .withId(this.id)
            .withTitle(this.title)
            .withSynopsis(this.synopsis)
            .withProtagonist(this.protagonist)
            .withChildAge(this.childAge)
            .withSpecies(this.species)
            .withConclusion(this.conclusion)
            .withCoverImageUrl(this.coverImageUrl)
            .withOwnerId(this.ownerId)
            .withIsPublic(this.isPublic)
            .withPublicationDate(this.publicationDate)
            .withTheme(this.theme)
            .withLanguage(this.language)
            .withTone(this.tone)
            .withChapters([...this.chapters]);
    }

    addChapter(chapter: Chapter, builderInstance: StoryBuilder): Story {
        return this.toBuilder(builderInstance)
            .withChapters([...this.chapters, chapter])
            .build();
    }

    getChapter(chapterId: number): Chapter | undefined {
        return this.chapters.find(chapter => chapter.id === chapterId);
    }

    getAllChapters(): readonly Chapter[] {
        return this.chapters;
    }
}