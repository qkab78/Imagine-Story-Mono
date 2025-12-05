import { Story } from "../entities/story.entity.js";

export interface IStoryRepository {
    findById(id: string): Promise<Story>;
    findBySlug(slug: string): Promise<Story>;
    findAll(): Promise<Story[]>;
    findAllByUserId(userId: string): Promise<Story[]>;
    findLatest(): Promise<Story[]>;
    create(story: Story): Promise<Story>;
    delete(id: string): Promise<void>;
}