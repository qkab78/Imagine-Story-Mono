import { ChapterImage, Story, StoryChapter } from "#stories/entities/story_entity";
import { Stories } from "#types/db";

export const getStoriesPresenter = (stories: Stories[]): Story[] => {

  return stories.map((story) => {
    const chapterImages = (story.chapter_images as unknown as ChapterImage[]).map((chapterImage) => ({
      chapterIndex: chapterImage.chapterIndex,
      chapterTitle: chapterImage.chapterTitle,
      imagePath: chapterImage.imagePath,
      imageUrl: chapterImage.imageUrl,
    })) || []
    const chapters = (story.story_chapters as unknown as StoryChapter[]).map((chapter) => ({
      title: chapter.title,
      content: chapter.content,
    })) || []
    return {
      id: story.id as unknown as string,
      title: story.title,
      synopsis: story.synopsis || '',
      chapters,
      chapterImages,
      conclusion: story.conclusion as unknown as string || '',
      coverImage: story.cover_image as unknown as string || '',
      slug: story.slug as unknown as string || '',
      public: story.public as unknown as boolean || true,
      userId: story.user_id as unknown as string || '',
      createdAt: story.created_at as unknown as string || '',
      theme: story.theme as unknown as string || '',
      protagonist: story.protagonist as unknown as string || '',
      childAge: story.child_age as unknown as number || 0,
      numberOfChapters: story.chapters as unknown as number || 0,
      language: story.language as unknown as string || '',
      tone: story.tone as unknown as string || '',
      species: story.species as unknown as string || '',
    }
  });
};