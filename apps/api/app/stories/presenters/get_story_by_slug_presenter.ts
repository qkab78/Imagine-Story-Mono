import { Story, StoryChapter } from "#stories/entities/story_entity";
import { Stories } from "#types/db";

export const getStoryBySlugPresenter = (story: Stories): Story => {
  return {
    id: story.id as unknown as string,
    title: story.title,
    synopsis: story.synopsis,
    theme: story.theme as unknown as string,
    protagonist: story.protagonist as unknown as string,
    childAge: story.child_age as unknown as number,
    numberOfChapters: story.chapters,
    language: story.language as unknown as string,
    tone: story.tone as unknown as string,
    species: story.species as unknown as string,
    chapters: (story.story_chapters as unknown as StoryChapter[]).map((chapter: StoryChapter) => ({
      title: chapter.title,
      content: chapter.content,
    })),
    conclusion: story.conclusion as unknown as string,
    coverImage: story.cover_image as unknown as string,
    slug: story.slug as unknown as string,
    public: story.public as unknown as boolean || true,
    userId: story.user_id as unknown as string,
    createdAt: story.created_at as unknown as string,
  };
};