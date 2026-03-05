import { MMKV } from 'react-native-mmkv';

export const readingProgressStorage = new MMKV({
  id: 'reading-progress-storage',
});

const KEYS = {
  READING_PROGRESS_PREFIX: 'reading.progress.',
  READING_STREAK: 'reading.streak',
  TOTAL_STORIES_READ: 'reading.totalStoriesRead',
  STORY_TIME_HOUR: 'notification.storyTimeHour',
  STORY_TIME_MINUTE: 'notification.storyTimeMinute',
  STORY_TIME_ENABLED: 'notification.storyTimeEnabled',
  LAST_READ_STORY: 'reading.lastReadStory',
} as const;

// Types
export interface ReadingProgress {
  storyId: string;
  storyTitle: string;
  currentChapter: number;
  totalChapters: number;
  lastReadAt: string; // ISO string
}

export interface ReadingStreak {
  count: number;
  lastReadDate: string; // YYYY-MM-DD
}

export interface StoryTimeConfig {
  hour: number;
  minute: number;
  enabled: boolean;
}

// ---- Reading Progress ----

export const getReadingProgress = (storyId: string): ReadingProgress | null => {
  const stored = readingProgressStorage.getString(KEYS.READING_PROGRESS_PREFIX + storyId);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const setReadingProgress = (storyId: string, progress: ReadingProgress) => {
  readingProgressStorage.set(KEYS.READING_PROGRESS_PREFIX + storyId, JSON.stringify(progress));
  // Also update last read story
  readingProgressStorage.set(KEYS.LAST_READ_STORY, JSON.stringify(progress));
};

export const getLastReadStory = (): ReadingProgress | null => {
  const stored = readingProgressStorage.getString(KEYS.LAST_READ_STORY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

// ---- Reading Streak ----

const getTodayDateString = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const getYesterdayDateString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
};

export const getReadingStreak = (): ReadingStreak => {
  const stored = readingProgressStorage.getString(KEYS.READING_STREAK);
  if (!stored) return { count: 0, lastReadDate: '' };
  try {
    return JSON.parse(stored);
  } catch {
    return { count: 0, lastReadDate: '' };
  }
};

export const updateReadingStreak = (): ReadingStreak => {
  const current = getReadingStreak();
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  // Already read today, no update needed
  if (current.lastReadDate === today) {
    return current;
  }

  let newStreak: ReadingStreak;

  if (current.lastReadDate === yesterday) {
    // Consecutive day — increment
    newStreak = { count: current.count + 1, lastReadDate: today };
  } else {
    // Streak broken — reset to 1
    newStreak = { count: 1, lastReadDate: today };
  }

  readingProgressStorage.set(KEYS.READING_STREAK, JSON.stringify(newStreak));
  return newStreak;
};

// ---- Total Stories Read ----

export const getTotalStoriesRead = (): number => {
  return readingProgressStorage.getNumber(KEYS.TOTAL_STORIES_READ) ?? 0;
};

export const incrementTotalStoriesRead = () => {
  const current = getTotalStoriesRead();
  readingProgressStorage.set(KEYS.TOTAL_STORIES_READ, current + 1);
};

// ---- Story Time Config ----

export const getStoryTimeConfig = (): StoryTimeConfig => {
  return {
    hour: readingProgressStorage.getNumber(KEYS.STORY_TIME_HOUR) ?? 20,
    minute: readingProgressStorage.getNumber(KEYS.STORY_TIME_MINUTE) ?? 0,
    enabled: readingProgressStorage.getBoolean(KEYS.STORY_TIME_ENABLED) ?? true,
  };
};

export const setStoryTimeConfig = (hour: number, minute: number) => {
  readingProgressStorage.set(KEYS.STORY_TIME_HOUR, hour);
  readingProgressStorage.set(KEYS.STORY_TIME_MINUTE, minute);
};

export const setStoryTimeEnabled = (enabled: boolean) => {
  readingProgressStorage.set(KEYS.STORY_TIME_ENABLED, enabled);
};
