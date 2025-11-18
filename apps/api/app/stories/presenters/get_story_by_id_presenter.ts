
import { ChapterImage, Story, StoryChapter } from "#stories/entities/story_entity";
import { Themes } from "#types/db";
import { StoryWithTheme } from "#stories/presenters/get_stories_presenter";

export const getStoryByIdPresenter = (story: StoryWithTheme): Story => {
  const chapterImages = (story.chapter_images as unknown as ChapterImage[]).map((chapterImage) => ({
    chapterIndex: chapterImage.chapterIndex,
    chapterTitle: chapterImage.chapterTitle,
    imagePath: chapterImage.imagePath.split('/').pop() || '',
    imageUrl: chapterImage.imagePath.split('/').pop() || '',
  })) || []
  const chapters = (story.story_chapters as unknown as StoryChapter[]).map((chapter) => ({
    title: chapter.title,
    content: chapter.content,
  })) || []
  const coverImage = story.cover_image.split('/').pop() || ''

  return {
    id: story.id as unknown as string,
    title: story.title,
    synopsis: story.synopsis,
    theme: story.theme_id as unknown as Themes,
    themeName: story.theme_name as unknown as string,
    themeDescription: story.theme_description as unknown as string,
    protagonist: story.protagonist as unknown as string,
    childAge: story.child_age as unknown as number,
    numberOfChapters: story.chapters,
    language: story.language as unknown as string,
    tone: story.tone as unknown as string,
    species: story.species as unknown as string,
    conclusion: story.conclusion as unknown as string,
    coverImage,
    slug: story.slug as unknown as string,
    public: (story.public as unknown as boolean) || true,
    userId: story.user_id as unknown as string,
    createdAt: story.created_at as unknown as string,
    chapters,
    chapterImages,
  }
}
