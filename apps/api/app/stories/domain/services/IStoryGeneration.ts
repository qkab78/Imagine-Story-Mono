
import { ImageUrl } from "../value-objects/media/ImageUrl.vo.js";
import { StoryGenerated } from "./types/StoryGenerated.js";

export abstract class IStoryGenerationService {
    abstract generateStory(payload: StoryGenerationPayload): Promise<StoryGenerated>;
    abstract generateImage?(payload: StoryImagePayload): Promise<ImageUrl>;
    abstract generateCharacterReference?(payload: StoryCharacterReferencePayload): Promise<string>;
    abstract generateCharacter?(payload: StoryCharacterPayload): Promise<string>;
    abstract generateChapterImages?(payload: StoryChapterImagesPayload): Promise<ImageUrl[]>;
    abstract generateCharacterProfiles?(payload: StoryCharacterProfilesPayload): Promise<Record<string, any>[]>;
}

export interface StoryGenerationPayload {
    title: string;
    synopsis: string;
    theme: string;
    protagonist: string;
    childAge: number;
    numberOfChapters: number;
    language: string;
    tone: string;
    species: string;
    ownerId: string;
    isPublic: boolean;
}

export interface StoryImagePayload {
    title: string;
    synopsis: string;
    theme: string;
    childAge: number;
    protagonist: string;
    species: string;
    slug: string;
}

export interface StoryCharacterPayload {
    title: string;
    synopsis: string;
    theme: string;
    childAge: number;
    protagonist: string;
    species: string;
    slug: string;
}

export interface StoryChapterImagesPayload {
    title: string;
    synopsis: string;
    theme: string;
    childAge: number;
    protagonist: string;
    species: string;
    slug: string;
}

export interface StoryCharacterReferencePayload {
    story: string;
    slug: string;
    characterSeed: number;
}

export interface StoryCharacterProfilesPayload {
    storyContent: StoryGenerationPayload
    chapters: StoryChapterPayload[];
}

export interface StoryChapterPayload {
    title: string;
}