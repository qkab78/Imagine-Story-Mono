import { useMutation } from '@tanstack/react-query'
import { retryStoryGeneration } from '@/api/stories/storyApi'
import type { StoryCreatedResponse } from '@/api/stories/storyTypes'
import useAuthStore from '@/store/auth/authStore'

/**
 * Hook for retrying a failed story generation
 *
 * Uses React Query mutation to handle story retry with the API client.
 */
export const useStoryRetry = () => {
  const { token } = useAuthStore()

  return useMutation({
    mutationFn: (storyId: string) =>
      retryStoryGeneration(storyId, token || ''),
    onSuccess: (data: StoryCreatedResponse) => {
      // Story retry queued successfully
    },
    onError: (error: Error) => {
      console.error('Story retry failed:', error)
    },
  })
}
