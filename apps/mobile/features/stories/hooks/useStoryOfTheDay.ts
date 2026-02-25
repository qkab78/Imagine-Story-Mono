import { useQuery } from '@tanstack/react-query'
import { GetStoryOfTheDayUseCase } from '../use-cases/GetStoryOfTheDayUseCase'

/**
 * Hook for fetching the story of the day
 *
 * Uses React Query with a stale time of 1 hour since the story changes daily.
 */
export const useStoryOfTheDay = () => {
  return useQuery({
    queryKey: ['stories', 'story-of-the-day'],
    queryFn: () => GetStoryOfTheDayUseCase.execute(),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}
