import { useState, useCallback } from 'react'
import { File, Paths } from 'expo-file-system'
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

      // Download PDF from backend
      const file = await File.downloadFileAsync(
        STORY_ENDPOINTS.STORY_PDF(storyId),
        new File(Paths.cache, fileName),
        {
          headers: { Authorization: token },
          idempotent: true,
        }
      )

      setPdfStatus('ready')

      // Open native share sheet
      const Sharing = await import('expo-sharing')
      const isAvailable = await Sharing.isAvailableAsync()
      if (isAvailable) {
        await Sharing.shareAsync(file.uri, {
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
