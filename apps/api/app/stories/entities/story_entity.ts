import { StoryLanguage, StoryTone } from "#stories/presenters/get_stories_presenter";
import { Themes } from "#types/db";

export interface StoryChapter {
  title: string
  content: string
}

export interface ChapterImage {
  chapterIndex: number
  chapterTitle: string
  imagePath: string
  imageUrl: string
}

export interface Story {
  id: string;
  title: string;
  synopsis: string;
  theme: Themes;
  themeName: string;
  themeDescription: string;
  protagonist: string;
  childAge: number;
  numberOfChapters: number;
  language: StoryLanguage;
  tone: StoryTone;
  species: string;
  chapters: StoryChapter[];
  conclusion: string;
  coverImage: string;
  slug: string;
  public: boolean;
  userId: string;
  createdAt: string;
  chapterImages?: ChapterImage[];
}
