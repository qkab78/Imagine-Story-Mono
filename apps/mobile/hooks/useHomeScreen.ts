import { useState, useCallback } from 'react';
import useAuthStore from '@/store/auth/authStore';
import { AuthStore } from '@/store/auth/authStore';
import { useQuery } from '@tanstack/react-query';
import { getLatestStories } from '@/api/stories';
import { Story } from '@imagine-story/api/stories/entities';

interface UseHomeScreenReturn {
  user: AuthStore["user"];
  recentStories: Story[];
  isLoading: boolean;
  isRefreshing: boolean;
  refreshData: () => Promise<void>;
  markStoryAsRead: (storyId: string) => void;
  toggleStoryFavorite: (storyId: string, isFavorite: boolean) => void;
}

export const useHomeScreen = (): UseHomeScreenReturn => {
  const [, setRecentStories] = useState<Story[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user, token } = useAuthStore();
  const { data: stories, isLoading, refetch } = useQuery({
    queryKey: ['stories', token],
    queryFn: ({ queryKey }) => getLatestStories(queryKey[1]!),
  })
  
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    refetch();
    setIsRefreshing(false);
  }, []);

  const markStoryAsRead = useCallback((storyId: string) => {
    setRecentStories(prevStories =>
      prevStories.map(story =>
        String(story.id) === storyId
          ? { ...story, isCompleted: true }
          : story
      )
    );
  }, []);

  const toggleStoryFavorite = useCallback((storyId: string, isFavorite: boolean) => {
    setRecentStories(prevStories =>
      prevStories.map(story =>
        String(story.id) === storyId
          ? { ...story, isFavorite }
          : story
      )
    );
  }, []);

  return {
    user: user as AuthStore["user"],
    recentStories: stories as unknown as Story[],
    isLoading,
    isRefreshing,
    refreshData,
    markStoryAsRead,
    toggleStoryFavorite,
  };
};