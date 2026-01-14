import { MMKV } from 'react-native-mmkv';

export const libraryStorage = new MMKV({
  id: 'library-storage',
});

const KEYS = {
  PENDING_GENERATIONS: 'library.pendingGenerations',
  LAST_CREATED_STORY_ID: 'library.lastCreatedStoryId',
} as const;

// Types
export interface PendingGeneration {
  jobId: string;
  storyId: string;
  createdAt: number;
}

// Pending generations (histoires en cours de génération)
export const getPendingGenerations = (): PendingGeneration[] => {
  const stored = libraryStorage.getString(KEYS.PENDING_GENERATIONS);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const addPendingGeneration = (jobId: string, storyId: string) => {
  const current = getPendingGenerations();
  const updated = [...current, { jobId, storyId, createdAt: Date.now() }];
  libraryStorage.set(KEYS.PENDING_GENERATIONS, JSON.stringify(updated));
};

export const removePendingGeneration = (jobId: string) => {
  const current = getPendingGenerations();
  const updated = current.filter((p) => p.jobId !== jobId);
  libraryStorage.set(KEYS.PENDING_GENERATIONS, JSON.stringify(updated));
};

export const clearPendingGenerations = () => {
  libraryStorage.delete(KEYS.PENDING_GENERATIONS);
};

// Last created story ID (pour highlight après création)
export const getLastCreatedStoryId = (): string | undefined => {
  return libraryStorage.getString(KEYS.LAST_CREATED_STORY_ID);
};

export const setLastCreatedStoryId = (id: string) => {
  libraryStorage.set(KEYS.LAST_CREATED_STORY_ID, id);
};

export const clearLastCreatedStoryId = () => {
  libraryStorage.delete(KEYS.LAST_CREATED_STORY_ID);
};
