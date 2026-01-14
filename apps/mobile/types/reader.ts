// Types pour l'écran de lecture

export interface ReaderChapter {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export interface ReaderProgress {
  currentChapter: number;
  totalChapters: number;
  percentage: number;
}

export interface ReaderState {
  storyId: string;
  storyTitle: string;
  currentChapterIndex: number;
  chapters: ReaderChapter[];
  isLoading: boolean;
  isMenuOpen: boolean;
  error?: string;
}

export type ReaderNavButtonVariant = 'default' | 'back' | 'close';
