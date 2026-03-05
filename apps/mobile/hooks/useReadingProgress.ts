import { useRef, useEffect } from 'react';
import {
  getReadingProgress,
  setReadingProgress,
  updateReadingStreak,
  incrementTotalStoriesRead,
  type ReadingProgress,
} from '@/store/notifications/readingProgressStorage';
import {
  scheduleContinueReadingReminder,
  cancelContinueReadingReminder,
} from '@/services/notifications/notificationService';

/**
 * Hook that manages reading progress tracking and related notifications.
 *
 * Call `trackChapterRead` on each chapter change, and `markStoryCompleted`
 * when the user finishes the last chapter.
 */
export const useReadingProgress = (storyId: string, storyTitle: string, totalChapters: number) => {
  const completedRef = useRef(false);

  // Cancel any pending "continue reading" reminder when the reader opens
  useEffect(() => {
    cancelContinueReadingReminder();
  }, []);

  const trackChapterRead = async (currentChapter: number) => {
    const progress: ReadingProgress = {
      storyId,
      storyTitle,
      currentChapter,
      totalChapters,
      lastReadAt: new Date().toISOString(),
    };

    setReadingProgress(storyId, progress);
    updateReadingStreak();

    // Schedule a "continue reading" reminder only if not at last chapter
    if (currentChapter < totalChapters) {
      await scheduleContinueReadingReminder(storyId, storyTitle, currentChapter, totalChapters);
    } else {
      await cancelContinueReadingReminder();
    }
  };

  const markStoryCompleted = async () => {
    if (completedRef.current) return;
    completedRef.current = true;

    incrementTotalStoriesRead();
    // No need for a "continue reading" reminder since the story is done
    await cancelContinueReadingReminder();
  };

  const getSavedProgress = (): ReadingProgress | null => {
    return getReadingProgress(storyId);
  };

  return {
    trackChapterRead,
    markStoryCompleted,
    getSavedProgress,
  };
};

export default useReadingProgress;
