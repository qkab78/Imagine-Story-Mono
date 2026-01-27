import { create } from 'zustand'
import type {
  OfflineStory,
  DownloadProgress,
  DownloadStatus,
  OfflineAccessLevel,
  OfflineConfig,
} from '@/types/offline'

interface OfflineState {
  // Stories téléchargées
  stories: Record<string, OfflineStory>
  // Progression des téléchargements en cours
  downloads: Record<string, DownloadProgress>
  // Stockage total utilisé
  totalSizeBytes: number
  // Configuration des limites (depuis le backend)
  config: OfflineConfig | null
  // Niveau d'accès actuel
  accessLevel: OfflineAccessLevel
  // Message d'avertissement si accès limité
  accessMessage: string | null
  // Jours avant suppression des contenus
  daysUntilDeletion: number | null
  // État de chargement
  isLoading: boolean
  // Erreur globale
  error: string | null
}

interface OfflineActions {
  // Gestion des stories
  setStories: (stories: OfflineStory[]) => void
  addStory: (story: OfflineStory) => void
  removeStory: (storyId: string) => void
  updateStoryLastRead: (storyId: string) => void

  // Gestion des téléchargements
  setDownloadProgress: (storyId: string, progress: DownloadProgress) => void
  clearDownloadProgress: (storyId: string) => void

  // Configuration
  setConfig: (config: OfflineConfig) => void

  // Accès
  setAccessLevel: (
    level: OfflineAccessLevel,
    message: string | null,
    daysUntilDeletion: number | null
  ) => void

  // État
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void

  // Utilitaires
  getDownloadStatus: (storyId: string) => DownloadStatus
  isStoryDownloaded: (storyId: string) => boolean
  canDownloadMore: () => boolean
  reset: () => void
}

type OfflineStore = OfflineState & OfflineActions

// Default config values
const DEFAULT_MAX_STORIES = 10
const DEFAULT_MAX_SIZE_BYTES = 500 * 1024 * 1024 // 500 MB

const initialState: OfflineState = {
  stories: {},
  downloads: {},
  totalSizeBytes: 0,
  config: {
    maxStories: DEFAULT_MAX_STORIES,
    currentCount: 0,
    maxSizeBytes: DEFAULT_MAX_SIZE_BYTES,
    currentSizeBytes: 0,
  },
  accessLevel: 'none',
  accessMessage: null,
  daysUntilDeletion: null,
  isLoading: false,
  error: null,
}

const useOfflineStore = create<OfflineStore>((set, get) => ({
  ...initialState,

  setStories: (stories: OfflineStory[]) => {
    const storiesMap: Record<string, OfflineStory> = {}
    let totalSize = 0

    for (const story of stories) {
      storiesMap[story.id] = story
      totalSize += story.sizeInBytes
    }

    set({
      stories: storiesMap,
      totalSizeBytes: totalSize,
    })
  },

  addStory: (story: OfflineStory) => {
    set((state) => ({
      stories: {
        ...state.stories,
        [story.id]: story,
      },
      totalSizeBytes: state.totalSizeBytes + story.sizeInBytes,
    }))
  },

  removeStory: (storyId: string) => {
    set((state) => {
      const story = state.stories[storyId]
      if (!story) return state

      const { [storyId]: removed, ...remainingStories } = state.stories
      return {
        stories: remainingStories,
        totalSizeBytes: state.totalSizeBytes - story.sizeInBytes,
      }
    })
  },

  updateStoryLastRead: (storyId: string) => {
    set((state) => {
      const story = state.stories[storyId]
      if (!story) return state

      return {
        stories: {
          ...state.stories,
          [storyId]: {
            ...story,
            lastReadAt: new Date().toISOString(),
          },
        },
      }
    })
  },

  setDownloadProgress: (storyId: string, progress: DownloadProgress) => {
    set((state) => ({
      downloads: {
        ...state.downloads,
        [storyId]: progress,
      },
    }))
  },

  clearDownloadProgress: (storyId: string) => {
    set((state) => {
      const { [storyId]: removed, ...remainingDownloads } = state.downloads
      return { downloads: remainingDownloads }
    })
  },

  setConfig: (config: OfflineConfig) => {
    set({ config })
  },

  setAccessLevel: (
    level: OfflineAccessLevel,
    message: string | null,
    daysUntilDeletion: number | null
  ) => {
    set({
      accessLevel: level,
      accessMessage: message,
      daysUntilDeletion,
    })
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setError: (error: string | null) => set({ error }),

  getDownloadStatus: (storyId: string): DownloadStatus => {
    const state = get()
    if (state.stories[storyId]) return 'downloaded'
    if (state.downloads[storyId]) return state.downloads[storyId].status
    return 'idle'
  },

  isStoryDownloaded: (storyId: string): boolean => {
    return !!get().stories[storyId]
  },

  canDownloadMore: (): boolean => {
    const state = get()
    if (!state.config) return false
    if (state.accessLevel !== 'full') return false
    return Object.keys(state.stories).length < state.config.maxStories
  },

  reset: () => set(initialState),
}))

export default useOfflineStore
