import { Chapter } from "./chapter.entity.js";
import { Theme } from "./theme.entity.js";
import { Language } from "./language.entity.js";
import { Tone } from "./tone.entity.js";
import { StoryId } from "../value-objects/story-id.vo.js";

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
        public readonly chapters: Chapter[],
    ) {}
    addChapter(chapter: Chapter): void {
        this.chapters.push(chapter)
    }
}