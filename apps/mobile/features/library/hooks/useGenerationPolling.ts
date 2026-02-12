import { useEffect, useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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

interface UseGenerationPollingResult {
  generationStates: GenerationState;
  isPolling: boolean;
}

/**
 * Hook for polling generation status of pending stories
 */
export const useGenerationPolling = (): UseGenerationPollingResult => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const pollingRef = useRef<number | null>(null);
  const [generationStates, setGenerationStates] = useState<GenerationState>({});
  const [isPolling, setIsPolling] = useState(false);

  const checkGenerationStatus = useCallback(async () => {
    if (!token) return;

    const pendingGenerations = getPendingGenerations();
    if (pendingGenerations.length === 0) {
      setIsPolling(false);
      return;
    }

    setIsPolling(true);

    // Check status for each pending generation
    const statusPromises = pendingGenerations.map(async (pending: PendingGeneration) => {
      try {
        const status = await getStoryGenerationStatus(pending.storyId, token);

        // If completed or failed, remove from pending and invalidate queries
        if (status.isCompleted || status.isFailed) {
          removePendingGeneration(pending.jobId);

          // Invalidate library stories to refresh the list
          queryClient.invalidateQueries({ queryKey: ['library', 'stories'] });

          // Remove from local state
          setGenerationStates(prev => {
            const next = { ...prev };
            delete next[pending.storyId];
            return next;
          });
        } else {
          // Update state with progress from backend
          setGenerationStates(prev => ({
            ...prev,
            [pending.storyId]: {
              status: status.status,
              progress: status.progressPercentage || (status.isProcessing ? 10 : status.isPending ? 5 : 0),
            },
          }));
        }

        return { storyId: pending.storyId, status };
      } catch (error) {
        console.error(`Error fetching status for story ${pending.storyId}:`, error);
        return null;
      }
    });

    await Promise.all(statusPromises);
  }, [token, queryClient]);

  // Start polling
  useEffect(() => {
    // Initial check
    checkGenerationStatus();

    // Set up polling interval
    pollingRef.current = setInterval(() => {
      checkGenerationStatus();
    }, POLLING_INTERVAL);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [checkGenerationStatus]);

  return {
    generationStates,
    isPolling,
  };
};

export default useGenerationPolling;
