import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { getStoryQuota } from '@/api/stories/storyApi'
import useAuthStore from '@/store/auth/authStore'
import useQuotaStore from '@/store/quota/quotaStore'
import type { StoryQuotaDTO } from '@/api/stories/quotaTypes'

const QUOTA_QUERY_KEY = ['story-quota']
const STALE_TIME = 5 * 60 * 1000 // 5 minutes

export const useStoryQuota = () => {
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const {
    quota: cachedQuota,
    setQuota,
    decrementRemaining,
    reset,
  } = useQuotaStore()

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<StoryQuotaDTO>({
    queryKey: QUOTA_QUERY_KEY,
    queryFn: () => {
      if (!token) {
        throw new Error('No token available')
      }
      return getStoryQuota(token)
    },
    enabled: !!token,
    staleTime: STALE_TIME,
    placeholderData: cachedQuota ?? undefined,
  })

  // Persist to MMKV for offline access
  useEffect(() => {
    if (data) {
      setQuota(data)
    }
  }, [data, setQuota])

  const refreshQuota = useCallback(async () => {
    const result = await refetch()
    return result.data
  }, [refetch])

  const onStoryCreated = useCallback(() => {
    decrementRemaining()
    queryClient.invalidateQueries({ queryKey: QUOTA_QUERY_KEY })
  }, [decrementRemaining, queryClient])

  const resetQuota = useCallback(() => {
    reset()
    queryClient.removeQueries({ queryKey: QUOTA_QUERY_KEY })
  }, [reset, queryClient])

  const quota = data ?? cachedQuota

  return {
    quota,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refreshQuota,
    onStoryCreated,
    resetQuota,
    canCreateStory: quota?.canCreate ?? true,
    isUnlimited: quota?.isUnlimited ?? false,
    remaining: quota?.remaining ?? null,
    storiesCreatedThisMonth: quota?.storiesCreatedThisMonth ?? 0,
    limit: quota?.limit ?? null,
    resetDate: quota?.resetDate ?? null,
  }
}

export default useStoryQuota
