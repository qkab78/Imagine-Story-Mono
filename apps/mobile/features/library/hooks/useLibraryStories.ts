import { useCallback, useMemo, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '@/store/auth/authStore';
import { getStoriesByAuthenticatedUserId } from '@/api/stories/storyApi';
import { StoryListItemDTO } from '@/api/stories/storyTypes';
import { LibraryStory, LibraryFilterType } from '@/types/library';
import {
  getLastCreatedStoryId,
  clearLastCreatedStoryId,
} from '@/store/library/libraryStorage';
import { isRecentDate } from '@/utils/date';

const POLLING_INTERVAL = 5000; // 5 seconds

/**
 * Transforms API story to LibraryStory format
 */
const transformToLibraryStory = (dto: StoryListItemDTO): LibraryStory => {
  // Use generationStatus from API directly
  const apiStatus = dto.generationStatus || 'completed';
  const isGenerating = apiStatus === 'pending' || apiStatus === 'processing';

  // Calculate progress based on status
  let progress: number | undefined;
  if (apiStatus === 'pending') progress = 10;
  else if (apiStatus === 'processing') progress = 50;
  else if (apiStatus === 'completed') progress = 100;

  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    synopsis: dto.synopsis,
    protagonist: dto.protagonist,
    species: dto.species,
    childAge: dto.childAge,
    coverImageUrl: dto.coverImageUrl,
    publicationDate: new Date(dto.publicationDate),
    numberOfChapters: dto.numberOfChapters,
    theme: {
      id: dto.theme.id,
      name: dto.theme.name,
      emoji: dto.theme.description,
    },
    generationStatus: isGenerating ? 'generating' : 'completed',
    generationProgress: progress,
  };
};

/**
 * Hook for fetching and managing library stories with automatic polling
 */
export const useLibraryStories = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch user stories
  const {
    data: storiesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['library', 'stories', token],
    queryFn: () => getStoriesByAuthenticatedUserId(token || ''),
    enabled: !!token,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Transform stories to LibraryStory format
  const stories = useMemo<LibraryStory[]>(() => {
    if (!storiesData) return [];
    return storiesData.map(transformToLibraryStory);
  }, [storiesData]);

  // Check if there are any generating stories
  const hasGeneratingStories = useMemo(() => {
    return stories.some((s) => s.generationStatus === 'generating');
  }, [stories]);

  // Set up polling when there are generating stories
  useEffect(() => {
    // Clear any existing interval
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    // Only poll if there are generating stories
    if (hasGeneratingStories) {
      pollingRef.current = setInterval(() => {
        refetch();
      }, POLLING_INTERVAL);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [hasGeneratingStories, refetch]);

  // Get highlighted story ID (last created)
  const highlightedStoryId = useMemo(() => getLastCreatedStoryId(), []);

  // Get new story IDs (created in last 24h)
  const newStoryIds = useMemo(() => {
    return stories
      .filter((story) => isRecentDate(story.publicationDate, 24))
      .map((story) => story.id);
  }, [stories]);

  // Filter stories by type
  const filterStories = useCallback(
    (filter: LibraryFilterType): LibraryStory[] => {
      switch (filter) {
        case 'generating':
          return stories.filter((s) => s.generationStatus === 'generating');
        case 'completed':
          return stories.filter((s) => s.generationStatus === 'completed');
        case 'all':
        default:
          return stories;
      }
    },
    [stories]
  );

  // Clear highlight when navigating away
  const clearHighlight = useCallback(() => {
    clearLastCreatedStoryId();
  }, []);

  // Refresh stories
  const refreshStories = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Invalidate cache (useful after creating a new story)
  const invalidateStories = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['library', 'stories'] });
  }, [queryClient]);

  return {
    stories,
    isLoading,
    isError,
    error,
    highlightedStoryId,
    newStoryIds,
    filterStories,
    clearHighlight,
    refreshStories,
    invalidateStories,
    totalCount: stories.length,
    generatingCount: stories.filter((s) => s.generationStatus === 'generating').length,
    completedCount: stories.filter((s) => s.generationStatus === 'completed').length,
  };
};

export default useLibraryStories;
