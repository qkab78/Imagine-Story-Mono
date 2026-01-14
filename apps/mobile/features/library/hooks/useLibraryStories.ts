import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '@/store/auth/authStore';
import { getStoriesByAuthenticatedUserId } from '@/api/stories/storyApi';
import { StoryListItemDTO } from '@/api/stories/storyTypes';
import { LibraryStory, LibraryFilterType, GenerationStatusType } from '@/types/library';
import {
  getPendingGenerations,
  getLastCreatedStoryId,
  clearLastCreatedStoryId,
} from '@/store/library/libraryStorage';
import { isRecentDate } from '@/utils/date';

/**
 * Transforms API story to LibraryStory format
 */
const transformToLibraryStory = (
  dto: StoryListItemDTO,
  pendingJobIds: string[]
): LibraryStory => {
  const isGenerating = pendingJobIds.includes(dto.id);

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
    generationProgress: isGenerating ? 50 : undefined, // TODO: real progress from websocket
  };
};

/**
 * Hook for fetching and managing library stories
 */
export const useLibraryStories = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

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
    staleTime: 1000 * 60, // 1 minute
  });

  // Get pending generations from MMKV
  const pendingGenerations = useMemo(() => getPendingGenerations(), []);
  const pendingStoryIds = useMemo(
    () => pendingGenerations.map((p) => p.storyId),
    [pendingGenerations]
  );

  // Transform stories to LibraryStory format
  const stories = useMemo<LibraryStory[]>(() => {
    if (!storiesData) return [];
    return storiesData.map((dto) => transformToLibraryStory(dto, pendingStoryIds));
  }, [storiesData, pendingStoryIds]);

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
