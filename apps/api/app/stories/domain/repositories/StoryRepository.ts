import { Story } from "#stories/domain/entities/story.entity";
import { StoryId } from "#stories/domain/value-objects/story-id.vo";

export abstract class IStoryRepository {
    abstract findById(id: string): Promise<Story>;
    abstract findAll(): Promise<{ stories: Story[], total: number }>;
    abstract create(story: Story): Promise<{ id: StoryId }>;
}