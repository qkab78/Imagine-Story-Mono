import { useState, useCallback } from 'react'
import useOfflineStore from '@/store/offline/offlineStore'
import { offlineStorageService } from '@/services/offline'
import { useOfflineAccess } from './useOfflineAccess'
import type { DownloadStatus, DownloadProgress } from '@/types/offline'

interface StoryData {
  id: string
  title: string
  content: string
  coverImageUrl: string | null
}

interface UseOfflineStoryReturn {
  // Statut de téléchargement de l'histoire
  downloadStatus: DownloadStatus
  // Progression du téléchargement (0-100)
  downloadProgress: number
  // Erreur éventuelle
  error: string | null
  // Est-ce que l'histoire est téléchargée
  isDownloaded: boolean
  // Est-ce qu'on peut télécharger cette histoire
  canDownload: boolean
  // Télécharger l'histoire
  download: (story: StoryData) => Promise<boolean>
  // Supprimer l'histoire téléchargée
  remove: () => Promise<void>
  // Lire le contenu offline de l'histoire
  readContent: () => Promise<{ title: string; content: string } | null>
}

/**
 * Hook pour gérer le téléchargement et la lecture offline d'une histoire
 */
export const useOfflineStory = (storyId: string): UseOfflineStoryReturn => {
  const [error, setError] = useState<string | null>(null)

  const { canDownload: hasDownloadAccess, canRead } = useOfflineAccess()

  const isDownloaded = useOfflineStore((state) => state.isStoryDownloaded(storyId))
  const downloadStatus = useOfflineStore((state) => state.getDownloadStatus(storyId))
  const downloadInfo = useOfflineStore((state) => state.downloads[storyId])
  const canDownloadMore = useOfflineStore((state) => state.canDownloadMore())

  const addStory = useOfflineStore((state) => state.addStory)
  const removeStory = useOfflineStore((state) => state.removeStory)
  const setDownloadProgress = useOfflineStore((state) => state.setDownloadProgress)
  const clearDownloadProgress = useOfflineStore((state) => state.clearDownloadProgress)

  const canDownload = hasDownloadAccess && canDownloadMore && !isDownloaded

  const download = useCallback(
    async (story: StoryData): Promise<boolean> => {
      console.log('[useOfflineStory] download called:', { canDownload, storyId, story: story.title })

      if (!canDownload) {
        console.log('[useOfflineStory] canDownload is false, aborting')
        setError('Impossible de télécharger cette histoire')
        return false
      }

      setError(null)

      try {
        console.log('[useOfflineStory] Starting download...')
        const offlineStory = await offlineStorageService.downloadStory(
          story,
          (progress: DownloadProgress) => {
            console.log('[useOfflineStory] Progress:', progress)
            setDownloadProgress(storyId, progress)
          }
        )

        console.log('[useOfflineStory] Download complete:', offlineStory)
        addStory(offlineStory)
        clearDownloadProgress(storyId)
        return true
      } catch (err) {
        console.error('[useOfflineStory] Download error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Erreur de téléchargement'
        setError(errorMessage)
        clearDownloadProgress(storyId)
        return false
      }
    },
    [storyId, canDownload, addStory, setDownloadProgress, clearDownloadProgress]
  )

  const remove = useCallback(async (): Promise<void> => {
    try {
      await offlineStorageService.deleteStory(storyId)
      removeStory(storyId)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de suppression'
      setError(errorMessage)
    }
  }, [storyId, removeStory])

  const readContent = useCallback(async (): Promise<{ title: string; content: string } | null> => {
    if (!canRead) {
      setError('Accès aux contenus hors ligne non disponible')
      return null
    }

    if (!isDownloaded) {
      setError('Cette histoire n\'est pas téléchargée')
      return null
    }

    try {
      const content = await offlineStorageService.readStoryContent(storyId)
      setError(null)
      return content
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de lecture'
      setError(errorMessage)
      return null
    }
  }, [storyId, canRead, isDownloaded])

  return {
    downloadStatus,
    downloadProgress: downloadInfo?.progress ?? 0,
    error,
    isDownloaded,
    canDownload,
    download,
    remove,
    readContent,
  }
}

export default useOfflineStory
