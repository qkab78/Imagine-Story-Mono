import { useState, useEffect, useRef } from 'react';
import { useStoryById } from '@/features/stories/hooks/useStoryById';
import { useOfflineStory } from '@/hooks/useOfflineStory';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { getReadingProgress } from '@/store/notifications/readingProgressStorage';
import { Story } from '@/domain/stories/entities/Story';
import type { ReaderChapter, ReaderProgress } from '@/types/reader';

interface OfflineChapter {
  id: string;
  title: string;
  content: string;
}

const getChapters = (
  isOffline: boolean,
  offlineContent: { title: string; chapters: OfflineChapter[] } | null,
  story: Story | undefined,
): ReaderChapter[] => {
  if (isOffline) {
    if (!offlineContent?.chapters) return [];
    return offlineContent.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      content: chapter.content,
      imageUrl: undefined,
    }));
  }
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
};

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
  const chapters: ReaderChapter[] = getChapters(isOffline, offlineContent, story);

  const currentChapter = chapters[currentChapterIndex];
  const totalChapters = chapters.length;

  // Story title (handles both online and offline)
  const storyTitle = isOffline ? (offlineContent?.title || '') : (story?.title || '');

  // Reading progress tracking
  const { trackChapterRead, markStoryCompleted } = useReadingProgress(
    storyId,
    storyTitle,
    totalChapters
  );

  // Auto-resume at last read chapter + track initial chapter
  const hasResumedRef = useRef(false);
  useEffect(() => {
    if (totalChapters > 0 && !hasResumedRef.current) {
      hasResumedRef.current = true;
      const savedProgress = getReadingProgress(storyId);
      if (savedProgress && savedProgress.currentChapter > 1) {
        const resumeIndex = Math.min(savedProgress.currentChapter - 1, totalChapters - 1);
        setCurrentChapterIndex(resumeIndex);
        trackChapterRead(resumeIndex + 1);
      } else {
        trackChapterRead(1);
      }
    }
  }, [totalChapters]);

  // Navigation
  const goToNextChapter = () => {
    if (currentChapterIndex < totalChapters - 1) {
      const nextIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(nextIndex);
      trackChapterRead(nextIndex + 1);
    } else if (currentChapterIndex === totalChapters - 1) {
      markStoryCompleted();
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      const prevIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(prevIndex);
      trackChapterRead(prevIndex + 1);
    }
  };

  const goToChapter = (index: number) => {
    if (index >= 0 && index < totalChapters) {
      setCurrentChapterIndex(index);
      setIsMenuOpen(false);
      trackChapterRead(index + 1);
    }
  };

  // Progress
  const progress: ReaderProgress = {
    currentChapter: currentChapterIndex + 1,
    totalChapters,
    percentage: totalChapters > 0 ? ((currentChapterIndex + 1) / totalChapters) * 100 : 0,
  };

  // Menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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
