import { useEffect, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useOfflineStore from '@/store/offline/offlineStore'
import useAuthStore from '@/store/auth/authStore'
import { offlineStorageService } from '@/services/offline'
import { getOfflineConfig } from '@/api/offline'
import { useOfflineAccess } from './useOfflineAccess'
import type { OfflineStory, OfflineConfig } from '@/types/offline'

// Query keys
const OFFLINE_QUERY_KEYS = {
  config: ['offline', 'config'] as const,
  stories: ['offline', 'stories'] as const,
}

// Configuration par défaut si le backend n'est pas disponible
const DEFAULT_CONFIG: OfflineConfig = {
  maxStories: 20,
  currentCount: 0,
  maxSizeBytes: 500 * 1024 * 1024, // 500 MB
  currentSizeBytes: 0,
}

interface UseOfflineLibraryReturn {
  stories: OfflineStory[]
  downloadedCount: number
  maxStories: number
  remainingSlots: number
  usedStorage: string
  usedStorageBytes: number
  isLoading: boolean
  error: string | null
  canDownloadMore: boolean
  refresh: () => Promise<void>
  removeStory: (storyId: string) => void
  removeAll: () => void
}

/**
 * Hook pour gérer la bibliothèque de contenus téléchargés
 * Utilise React Query pour la config API et les mutations
 */
export const useOfflineLibrary = (): UseOfflineLibraryReturn => {
  const { canDownload } = useOfflineAccess()
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  const {
    stories: storiesMap,
    totalSizeBytes,
    setStories,
    removeStory: removeStoryFromStore,
    setConfig,
    reset,
  } = useOfflineStore()

  // Query pour récupérer la config depuis le backend
  const {
    data: configData,
    isLoading: isConfigLoading,
    error: configError,
  } = useQuery({
    queryKey: OFFLINE_QUERY_KEYS.config,
    queryFn: () => getOfflineConfig(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Ne pas réessayer si l'endpoint n'existe pas
  })

  // Query pour charger les histoires locales
  const {
    data: localStories,
    isLoading: isStoriesLoading,
    error: storiesError,
    refetch: refetchStories,
  } = useQuery({
    queryKey: OFFLINE_QUERY_KEYS.stories,
    queryFn: () => offlineStorageService.getAllStories(),
    staleTime: 0, // Toujours refetch car c'est du local
  })

  // Mutation pour supprimer une histoire
  const deleteStoryMutation = useMutation({
    mutationFn: (storyId: string) => offlineStorageService.deleteStory(storyId),
    onSuccess: (_, storyId) => {
      removeStoryFromStore(storyId)
      queryClient.invalidateQueries({ queryKey: OFFLINE_QUERY_KEYS.stories })
    },
  })

  // Mutation pour supprimer toutes les histoires
  const deleteAllMutation = useMutation({
    mutationFn: () => offlineStorageService.deleteAllContent(),
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: OFFLINE_QUERY_KEYS.stories })
    },
  })

  // Sync les stories locales avec le store
  useEffect(() => {
    if (localStories) {
      setStories(localStories)
    }
  }, [localStories, setStories])

  // Sync la config avec le store
  useEffect(() => {
    if (configData) {
      setConfig({
        maxStories: configData.maxStories,
        maxSizeBytes: configData.maxSizeBytes,
        currentCount: Object.keys(storiesMap).length,
        currentSizeBytes: totalSizeBytes,
      })
    }
  }, [configData, storiesMap, totalSizeBytes, setConfig])

  // Convertir le map en array trié par date de téléchargement
  const stories = useMemo(() => {
    return Object.values(storiesMap).sort((a, b) => {
      return new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime()
    })
  }, [storiesMap])

  const effectiveConfig = configData
    ? { ...DEFAULT_CONFIG, maxStories: configData.maxStories, maxSizeBytes: configData.maxSizeBytes }
    : DEFAULT_CONFIG
  const downloadedCount = stories.length
  const maxStories = effectiveConfig.maxStories
  const remainingSlots = Math.max(0, maxStories - downloadedCount)
  const canDownloadMore = canDownload && remainingSlots > 0

  const isLoading = isConfigLoading || isStoriesLoading || deleteStoryMutation.isPending || deleteAllMutation.isPending
  const error = configError?.message || storiesError?.message || deleteStoryMutation.error?.message || deleteAllMutation.error?.message || null

  const refresh = useCallback(async (): Promise<void> => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: OFFLINE_QUERY_KEYS.config }),
      refetchStories(),
    ])
  }, [queryClient, refetchStories])

  const removeStory = useCallback((storyId: string) => {
    deleteStoryMutation.mutate(storyId)
  }, [deleteStoryMutation])

  const removeAll = useCallback(() => {
    deleteAllMutation.mutate()
  }, [deleteAllMutation])

  return {
    stories,
    downloadedCount,
    maxStories,
    remainingSlots,
    usedStorage: offlineStorageService.formatSize(totalSizeBytes),
    usedStorageBytes: totalSizeBytes,
    isLoading,
    error,
    canDownloadMore,
    refresh,
    removeStory,
    removeAll,
  }
}

export default useOfflineLibrary
