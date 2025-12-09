import { Story } from "#stories/domain/entities/story.entity";

export abstract class IStoryRepository {
    abstract findById(id: string): Promise<Story>;
    abstract findAll(): Promise<{ stories: Story[], total: number }>;
    abstract create(story: Story): Promise<{ id: string }>;
}