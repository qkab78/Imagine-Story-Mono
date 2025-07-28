import { useState, useEffect, useCallback } from 'react';
import type { User, Story } from '@/types/home';
import useAuthStore from '@/store/auth/authStore';
import { AuthStore } from '@/store/auth/authStore';
import { useQuery } from '@tanstack/react-query';
import { getLatestStories, getStories } from '@/api/stories';
import { Stories } from '@imagine-story/api/types/db';

interface UseHomeScreenReturn {
  user: AuthStore["user"];
  recentStories: Stories[];
  isLoading: boolean;
  isRefreshing: boolean;
  refreshData: () => Promise<void>;
  markStoryAsRead: (storyId: string) => void;
  toggleStoryFavorite: (storyId: string, isFavorite: boolean) => void;
}

export const useHomeScreen = (): UseHomeScreenReturn => {
  const [recentStories, setRecentStories] = useState<Stories[]>([]);
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
    recentStories: stories as unknown as Stories[],
    isLoading,
    isRefreshing,
    refreshData,
    markStoryAsRead,
    toggleStoryFavorite,
  };
};