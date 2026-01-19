import type { LanguageDTO, ToneDTO, ThemeDTO } from "#stories/application/dtos/StoryDTO";

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
  theme: ThemeDTO;
  themeName: string;
  themeDescription: string;
  protagonist: string;
  childAge: number;
  numberOfChapters: number;
  language: LanguageDTO;
  tone: ToneDTO;
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
