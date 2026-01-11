import { useQuery } from '@tanstack/react-query'
import { GetStoryBySlugUseCase } from '../use-cases/GetStoryBySlugUseCase'
import { Story } from '@/domain/stories/entities/Story'

/**
 * Hook for fetching story detail by slug
 *
 * Uses React Query to handle story detail fetching with use case.
 */
export const useStoryDetail = (slug: string) => {
  return useQuery({
    queryKey: ['story', 'detail', slug],
    queryFn: () => GetStoryBySlugUseCase.execute(slug),
    enabled: !!slug,
  })
}
