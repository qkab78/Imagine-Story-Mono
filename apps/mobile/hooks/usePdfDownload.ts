import { useState, useCallback } from 'react'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import useAuthStore from '@/store/auth/authStore'
import { STORY_ENDPOINTS } from '@/api/stories/storyEndpoints'

export type PdfStatus = 'idle' | 'downloading' | 'ready' | 'error'

interface UsePdfDownloadReturn {
  pdfStatus: PdfStatus
  error: string | null
  downloadAndShare: (storyId: string, storyTitle: string) => Promise<void>
}

/**
 * Hook pour gérer le téléchargement et le partage d'un PDF d'histoire
 */
export const usePdfDownload = (): UsePdfDownloadReturn => {
  const [pdfStatus, setPdfStatus] = useState<PdfStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const downloadAndShare = useCallback(async (storyId: string, storyTitle: string) => {
    const token = useAuthStore.getState().token
    if (!token) {
      setError('Authentication required')
      setPdfStatus('error')
      return
    }

    setPdfStatus('downloading')
    setError(null)

    try {
      // Build safe filename
      const safeTitle = storyTitle
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase()
        .slice(0, 50)
      const fileName = `${safeTitle || 'story'}.pdf`
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`

      // Download PDF from backend
      const result = await FileSystem.downloadAsync(
        STORY_ENDPOINTS.STORY_PDF(storyId),
        fileUri,
        {
          headers: {
            Authorization: token,
          },
        }
      )

      if (result.status !== 200) {
        throw new Error(`Download failed with status ${result.status}`)
      }

      setPdfStatus('ready')

      // Open native share sheet
      const isAvailable = await Sharing.isAvailableAsync()
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: storyTitle,
        })
      }

      // Reset status after sharing
      setPdfStatus('idle')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'PDF download failed'
      setError(errorMessage)
      setPdfStatus('error')

      // Auto-reset after a delay
      setTimeout(() => {
        setPdfStatus('idle')
        setError(null)
      }, 3000)
    }
  }, [])

  return {
    pdfStatus,
    error,
    downloadAndShare,
  }
}

export default usePdfDownload
