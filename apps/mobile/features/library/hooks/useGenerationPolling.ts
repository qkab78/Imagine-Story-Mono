import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '@/store/auth/authStore';
import { getStoryGenerationStatus, GenerationStatusResponse } from '@/api/stories/storyApi';
import {
  getPendingGenerations,
  removePendingGeneration,
  PendingGeneration,
} from '@/store/library/libraryStorage';

const POLLING_INTERVAL = 5000; // 5 seconds

interface GenerationState {
  [storyId: string]: {
    status: GenerationStatusResponse['status'];
    progress?: number;
  };
}

interface PollResult {
  pending: PendingGeneration;
  status: GenerationStatusResponse;
}

interface UseGenerationPollingResult {
  generationStates: GenerationState;
  isPolling: boolean;
}

/**
 * Hook for polling generation status of pending stories.
 * Uses React Query's refetchInterval instead of manual setInterval.
 */
export const useGenerationPolling = (): UseGenerationPollingResult => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const [generationStates, setGenerationStates] = useState<GenerationState>({});

  const { data, isFetching } = useQuery<(PollResult | null)[]>({
    queryKey: ['generation-polling', token],
    queryFn: async () => {
      if (!token) return [];

      const pendingGenerations = getPendingGenerations();
      if (pendingGenerations.length === 0) return [];

      return Promise.all(
        pendingGenerations.map(async (pending: PendingGeneration) => {
          try {
            const status = await getStoryGenerationStatus(pending.storyId, token);
            return { pending, status };
          } catch (error) {
            console.error(`Error fetching status for story ${pending.storyId}:`, error);
            return null;
          }
        })
      );
    },
    enabled: !!token,
    refetchInterval: () => {
      const pendings = getPendingGenerations();
      return pendings.length > 0 ? POLLING_INTERVAL : false;
    },
    refetchIntervalInBackground: false,
  });

  // Process poll results: update states, clean up completed generations
  useEffect(() => {
    if (!data) return;

    const newStates: GenerationState = {};

    for (const result of data) {
      if (!result) continue;
      const { pending, status } = result;

      if (status.isCompleted || status.isFailed) {
        removePendingGeneration(pending.jobId);
        queryClient.invalidateQueries({ queryKey: ['library', 'stories'] });
      } else {
        newStates[pending.storyId] = {
          status: status.status,
          progress: status.progressPercentage || (status.isProcessing ? 10 : status.isPending ? 5 : 0),
        };
      }
    }

    setGenerationStates(newStates);
  }, [data, queryClient]);

  const hasPending = getPendingGenerations().length > 0;

  return {
    generationStates,
    isPolling: hasPending && isFetching,
  };
};

export default useGenerationPolling;
