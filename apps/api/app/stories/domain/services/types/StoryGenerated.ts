import { Chapter } from "#stories/domain/entities/chapter.entity";

export interface StoryGenerated {
    title: string;
    synopsis: string;
    theme: string;
    protagonist: string;
    childAge: number;
    numberOfChapters: number;
    language: string;
    tone: string;
    species: string;
    conclusion: string;
    slug: string;
    chapters: Chapter[];
    coverImageUrl: string;
    ownerId: string;
    isPublic: boolean;
}