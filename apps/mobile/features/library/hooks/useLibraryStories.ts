import { useCallback, useMemo, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
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

const sendCompletionNotification = async (storyTitle: string) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Histoire terminée ! ✨',
        body: `"${storyTitle}" est prête à lire !`,
        sound: true,
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error sending completion notification:', error);
  }
};

/**
 * Hook for fetching and managing library stories with automatic polling
 */
export const useLibraryStories = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch user stories with automatic polling when stories are generating
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
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      const hasGenerating = data.some(
        (dto) => dto.generationStatus === 'pending' || dto.generationStatus === 'processing'
      );
      return hasGenerating ? POLLING_INTERVAL : false;
    },
    refetchIntervalInBackground: false,
  });

  // Transform stories to LibraryStory format
  const stories = useMemo<LibraryStory[]>(() => {
    if (!storiesData) return [];
    return storiesData.map(transformToLibraryStory);
  }, [storiesData]);

  // Detect generation completion and send notification
  const previousStatusesRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const prev = previousStatusesRef.current;
    const next: Record<string, string> = {};
    stories.forEach((story) => {
      next[story.id] = story.generationStatus;
      if (prev[story.id] === 'generating' && story.generationStatus === 'completed') {
        sendCompletionNotification(story.title);
      }
    });
    previousStatusesRef.current = next;
  }, [stories]);

  // Check if there are any generating stories
  const hasGeneratingStories = useMemo(() => {
    return stories.some((s) => s.generationStatus === 'generating');
  }, [stories]);

  // Check if there are any failed stories
  const hasFailedStories = useMemo(() => {
    return stories.some((s) => s.generationStatus === 'failed');
  }, [stories]);

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
    failedCount: stories.filter((s) => s.generationStatus === 'failed').length,
    hasFailedStories,
  };
};

export default useLibraryStories;
