import { useQuery } from '@tanstack/react-query'
import { GetStoryByIdUseCase } from '../use-cases/GetStoryByIdUseCase'

interface UseStoryByIdOptions {
  enabled?: boolean
}

/**
 * Hook for fetching story detail by ID
 *
 * Uses React Query to handle story detail fetching with use case.
 */
export const useStoryById = (id: string, options?: UseStoryByIdOptions) => {
  return useQuery({
    queryKey: ['story', 'detail', 'by-id', id],
    queryFn: () => GetStoryByIdUseCase.execute(id),
    enabled: options?.enabled !== false && !!id,
  })
}
