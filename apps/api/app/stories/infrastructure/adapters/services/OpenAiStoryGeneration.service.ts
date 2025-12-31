import { IStoryGenerationService, StoryChapterImagesPayload, StoryCharacterPayload, StoryCharacterProfilesPayload, StoryCharacterReferencePayload, StoryGenerationPayload, StoryImagePayload } from "#stories/domain/services/IStoryGeneration";
import { StoryGenerated } from "#stories/domain/services/types/StoryGenerated";
import { ImageUrl } from "#stories/domain/value-objects/media/ImageUrl.vo";

export class OpenAiStoryGenerationService implements IStoryGenerationService {
    
    generateStory(payload: StoryGenerationPayload): Promise<StoryGenerated> {
        throw new Error('Not implemented');
    }
    generateImage(payload: StoryImagePayload): Promise<ImageUrl> {
        throw new Error('Not implemented');
    }
    generateCharacter(payload: StoryCharacterPayload): Promise<string> {
        throw new Error('Not implemented');
    }
    generateChapterImages(payload: StoryChapterImagesPayload): Promise<ImageUrl[]> {
        throw new Error('Not implemented');
    }
    generateCharacterReference(payload: StoryCharacterReferencePayload): Promise<string> {
        throw new Error('Not implemented');
    }
    generateCharacterProfiles(payload: StoryCharacterProfilesPayload): Promise<Record<string, any>[]> {
        throw new Error('Not implemented');
    }
}