import { useQuery } from '@tanstack/react-query'
import { GetStoriesUseCase } from '../use-cases/GetStoriesUseCase'
import { Story } from '@/domain/stories/entities/Story'
import useAuthStore from '@/store/auth/authStore'

/**
 * Hook for fetching stories list
 *
 * Uses React Query to handle story list fetching with use case.
 */
export const useStoryList = () => {
  const { token } = useAuthStore()

  return useQuery({
    queryKey: ['stories', token],
    queryFn: () => GetStoriesUseCase.execute(token || ''),
    enabled: !!token,
  })
}

/**
 * Hook for fetching latest stories
 */
export const useLatestStories = () => {
  const { token } = useAuthStore()

  return useQuery({
    queryKey: ['stories', 'latest', token],
    queryFn: () => GetStoriesUseCase.getLatest(token || ''),
    enabled: !!token,
  })
}

/**
 * Hook for fetching user's stories
 */
export const useUserStories = () => {
  const { token } = useAuthStore()

  return useQuery({
    queryKey: ['stories', 'user', token],
    queryFn: () => GetStoriesUseCase.getByUserId(token || ''),
    enabled: !!token,
  })
}
