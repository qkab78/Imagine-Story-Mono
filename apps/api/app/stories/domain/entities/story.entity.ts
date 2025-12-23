import type { Chapter } from "./chapter.entity.js";
import type { Theme } from "./theme.entity.js";
import type { Language } from "./language.entity.js";
import type { Tone } from "./tone.entity.js";
import type { StoryId } from "../value-objects/story-id.vo.js";
import type { StoryBuilder } from "../builders/story.builder.js";

export class Story {
    constructor(
        public readonly id: StoryId,
        public readonly title: string,
        public readonly synopsis: string,
        public readonly protagonist: string,
        public readonly childAge: number,
        public readonly numberOfChapters: number,
        public readonly species: string,
        public readonly conclusion: string,
        public readonly coverImageUrl: string,
        public readonly ownerId: string,
        public readonly isPublic: boolean,
        public readonly createdAt: string,
        public readonly theme: Theme,
        public readonly language: Language,
        public readonly tone: Tone,
        public readonly chapters: readonly Chapter[],
    ) {}

    toBuilder(builderInstance: StoryBuilder): StoryBuilder {
        return builderInstance
            .withId(this.id)
            .withTitle(this.title)
            .withSynopsis(this.synopsis)
            .withProtagonist(this.protagonist)
            .withChildAge(this.childAge)
            .withNumberOfChapters(this.numberOfChapters)
            .withSpecies(this.species)
            .withConclusion(this.conclusion)
            .withCoverImageUrl(this.coverImageUrl)
            .withOwnerId(this.ownerId)
            .withIsPublic(this.isPublic)
            .withCreatedAt(this.createdAt)
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