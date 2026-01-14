import { useState, useCallback, useMemo } from 'react';
import { useStoryById } from '@/features/stories/hooks/useStoryById';
import type { ReaderChapter, ReaderProgress } from '@/types/reader';

export const useStoryReader = (storyId: string) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: story, isLoading, error } = useStoryById(storyId);

  // Transform domain chapters to reader chapters
  const chapters: ReaderChapter[] = useMemo(() => {
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
  }, [story]);

  const currentChapter = chapters[currentChapterIndex];
  const totalChapters = chapters.length;

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

  return {
    // Story data
    story,
    storyTitle: story?.title || '',
    chapters,
    currentChapter,
    currentChapterIndex,
    totalChapters,
    progress,
    // State
    isLoading,
    error: error?.message,
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
