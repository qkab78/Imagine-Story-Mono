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

const STALE_TIME = 1000 * 30; // 30 seconds

/**
 * Transforms API story to LibraryStory format
 */
const transformToLibraryStory = (dto: StoryListItemDTO): LibraryStory => {
  // Use generationStatus from API directly
  const apiStatus = dto.generationStatus || 'completed';
  const isGenerating = apiStatus === 'pending' || apiStatus === 'processing';
  const isFailed = apiStatus === 'failed';

  // Calculate progress based on status
  let progress: number | undefined;
  if (apiStatus === 'pending') progress = 10;
  else if (apiStatus === 'processing') progress = 50;
  else if (apiStatus === 'completed') progress = 100;

  // Map API status to library status
  let generationStatus: LibraryStory['generationStatus'];
  if (isFailed) generationStatus = 'failed';
  else if (isGenerating) generationStatus = 'generating';
  else generationStatus = 'completed';

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
    generationStatus,
    generationProgress: progress,
  };
};

/**
 * Hook for fetching and managing library stories.
 * Real-time updates are handled by useStorySSE (no polling).
 */
export const useLibraryStories = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

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
    staleTime: STALE_TIME,
  });

  // Transform stories to LibraryStory format
  const stories: LibraryStory[] = storiesData
    ? storiesData.map(transformToLibraryStory)
    : [];

  // Check if there are any generating stories
  const hasGeneratingStories = stories.some((s) => s.generationStatus === 'generating');

  // Check if there are any failed stories
  const hasFailedStories = stories.some((s) => s.generationStatus === 'failed');

  // Get highlighted story ID (last created)
  const highlightedStoryId = getLastCreatedStoryId();

  // Get new story IDs (created in last 24h)
  const newStoryIds = stories
    .filter((story) => isRecentDate(story.publicationDate, 24))
    .map((story) => story.id);

  // Filter stories by type
  const filterStories = (filter: LibraryFilterType): LibraryStory[] => {
    switch (filter) {
      case 'generating':
        return stories.filter((s) => s.generationStatus === 'generating');
      case 'completed':
        return stories.filter((s) => s.generationStatus === 'completed');
      case 'all':
      default:
        return stories;
    }
  };

  // Clear highlight when navigating away
  const clearHighlight = () => {
    clearLastCreatedStoryId();
  };

  // Refresh stories
  const refreshStories = async () => {
    await refetch();
  };

  // Invalidate cache (useful after creating a new story)
  const invalidateStories = () => {
    queryClient.invalidateQueries({ queryKey: ['library', 'stories'] });
  };

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
    failedCount: stories.filter((s) => s.generationStatus === 'failed').length,
    hasFailedStories,
  };
};

export default useLibraryStories;
