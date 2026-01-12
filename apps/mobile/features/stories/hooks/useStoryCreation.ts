import { useMutation } from '@tanstack/react-query'
import { CreateStoryUseCase } from '../use-cases/CreateStoryUseCase'
import type { StoryCreationFormData } from '@/types/creation'
import type { StoryCreatedResponse } from '@/api/stories/storyTypes'
import useAuthStore from '@/store/auth/authStore'

/**
 * Hook for story creation
 *
 * Uses React Query mutation to handle story creation with use case.
 */
export const useStoryCreation = () => {
  const { token, user } = useAuthStore()

  return useMutation({
    mutationFn: (formData: StoryCreationFormData) =>
      CreateStoryUseCase.execute(formData, token || '', user?.id),
    onSuccess: (data: StoryCreatedResponse) => {
      // Story created successfully
      // Additional side effects can be added here (e.g., navigation, cache invalidation)
    },
    onError: (error: Error) => {
      // Error handling
      console.error('Story creation failed:', error)
    },
  })
}
