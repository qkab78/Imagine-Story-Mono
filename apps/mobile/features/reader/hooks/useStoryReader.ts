import { useState, useCallback, useMemo, useEffect } from 'react';
import { useStoryById } from '@/features/stories/hooks/useStoryById';
import { useOfflineStory } from '@/hooks/useOfflineStory';
import type { ReaderChapter, ReaderProgress } from '@/types/reader';

interface OfflineChapter {
  id: string;
  title: string;
  content: string;
}

export const useStoryReader = (storyId: string, isOffline: boolean = false) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Offline content state
  const [offlineContent, setOfflineContent] = useState<{ title: string; chapters: OfflineChapter[] } | null>(null);
  const [offlineLoading, setOfflineLoading] = useState(false);
  const [offlineError, setOfflineError] = useState<string | null>(null);

  // Online mode: fetch from API (disabled in offline mode)
  const { data: story, isLoading: onlineLoading, error: onlineError } = useStoryById(storyId, {
    enabled: !isOffline,
  });

  // Offline mode: read from local storage
  const { readContent } = useOfflineStory(storyId);

  useEffect(() => {
    if (isOffline) {
      setOfflineLoading(true);
      readContent()
        .then((content) => {
          setOfflineContent(content);
          setOfflineLoading(false);
        })
        .catch((err) => {
          setOfflineError(err instanceof Error ? err.message : 'Erreur de lecture');
          setOfflineLoading(false);
        });
    }
  }, [isOffline, storyId, readContent]);

  // Determine loading and error states
  const isLoading = isOffline ? offlineLoading : onlineLoading;
  const error = isOffline ? offlineError : onlineError?.message;

  // Transform chapters based on mode (online vs offline)
  const chapters: ReaderChapter[] = useMemo(() => {
    if (isOffline) {
      // Offline mode: use stored chapters directly
      if (!offlineContent?.chapters) return [];

      return offlineContent.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        content: chapter.content,
        imageUrl: undefined,
      }));
    }

    // Online mode: use story chapters
    if (!story) return [];
    return story.getAllChapters().map((chapter) => {
      const rawImageUrl = chapter.image?.imageUrl?.getValue();
      return {
        id: chapter.id.getValue().toString(),
        title: chapter.title,
        content: chapter.content,
        imageUrl: rawImageUrl,
      };
    });
  }, [isOffline, offlineContent, story]);

  const currentChapter = chapters[currentChapterIndex];
  const totalChapters = chapters.length;

  // Story title (handles both online and offline)
  const storyTitle = isOffline ? (offlineContent?.title || '') : (story?.title || '');

  // Navigation
  const goToNextChapter = useCallback(() => {
    if (currentChapterIndex < totalChapters - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
    }
  }, [currentChapterIndex, totalChapters]);

  const goToPreviousChapter = useCallback(() => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
    }
  }, [currentChapterIndex]);

  const goToChapter = useCallback((index: number) => {
    if (index >= 0 && index < totalChapters) {
      setCurrentChapterIndex(index);
      setIsMenuOpen(false);
    }
  }, [totalChapters]);

  // Progress
  const progress: ReaderProgress = useMemo(
    () => ({
      currentChapter: currentChapterIndex + 1,
      totalChapters,
      percentage: totalChapters > 0 ? ((currentChapterIndex + 1) / totalChapters) * 100 : 0,
    }),
    [currentChapterIndex, totalChapters]
  );

  // Menu
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Check if current chapter is the last one
  const isLastChapter = currentChapterIndex === totalChapters - 1;

  return {
    // Story data
    story,
    storyTitle,
    conclusion: story?.conclusion || '',
    chapters,
    currentChapter,
    currentChapterIndex,
    totalChapters,
    progress,
    isLastChapter,
    // State
    isLoading,
    error,
    isMenuOpen,
    // Navigation
    goToNextChapter,
    goToPreviousChapter,
    goToChapter,
    hasPreviousChapter: currentChapterIndex > 0,
    hasNextChapter: currentChapterIndex < totalChapters - 1,
    // Menu
    toggleMenu,
    closeMenu,
  };
};

export default useStoryReader;
