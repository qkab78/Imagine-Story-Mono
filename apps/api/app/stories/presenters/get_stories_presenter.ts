import { ChapterImage, Story, StoryChapter } from "#stories/entities/story_entity";
import { Stories, Themes } from "#types/db";

export type StoryLanguage = {
  id: string;
  name: string;
  code: string;
  isFree: boolean;
}
export type StoryTone = {
  id: string;
  name: string;
  description: string;
}
export type StoryWithTheme = Stories & { 
  theme_name: string; 
  theme_description: string;
  language_id: string;
  tone_id: string;
  language_name: string;
  tone_name: string;
  tone_description: string;
  language_code: string;
  language_is_free: boolean;
};
export const getStoriesPresenter = (stories: StoryWithTheme[]): Story[] => {

  return stories.map((story) => {
    const chapterImages =
      (story.chapter_images as unknown as ChapterImage[]).map((chapterImage) => ({
        chapterIndex: chapterImage.chapterIndex,
        chapterTitle: chapterImage.chapterTitle,
        imagePath: chapterImage.imagePath,
        imageUrl: chapterImage.imageUrl,
      })) || []
    const chapters =
      (story.story_chapters as unknown as StoryChapter[]).map((chapter) => ({
        title: chapter.title,
        content: chapter.content,
      })) || []
    const coverImage = story.cover_image.split('/').pop() || ''
    const language: StoryLanguage = {
      id: story.language_id as unknown as string,
      name: story.language_name as unknown as string,
      code: story.language_code as unknown as string,
      isFree: story.language_is_free as unknown as boolean,
    }
    const tone: StoryTone = {
      id: story.tone_id as unknown as string,
      name: story.tone_name as unknown as string,
      description: story.tone_description as unknown as string,
    }
    return {
      id: story.id as unknown as string,
      title: story.title,
      synopsis: story.synopsis,
      chapters,
      chapterImages,
      conclusion: story.conclusion as unknown as string,
      coverImage,
      slug: story.slug as unknown as string,
      public: story.public as unknown as boolean || true,
      userId: story.user_id as unknown as string || '',
      createdAt: story.created_at as unknown as string,
      theme: story.theme_id as unknown as Themes,
      protagonist: story.protagonist as unknown as string || '',
      childAge: story.child_age as unknown as number || 0,
      numberOfChapters: story.chapters as unknown as number || 0,
      language,
      tone,
      species: story.species as unknown as string,
      themeName: story.theme_name as unknown as string,
      themeDescription: story.theme_description as unknown as string,
    }
  })
}
