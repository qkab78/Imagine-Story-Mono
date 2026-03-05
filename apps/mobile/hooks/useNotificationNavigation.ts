import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { getLastReadStory } from '@/store/notifications/readingProgressStorage';

/**
 * Handles navigation when a user taps on a notification.
 * Must be used inside a component with access to expo-router.
 */
export function useNotificationNavigation() {
  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, string> | undefined;
      if (!data?.type) return;

      switch (data.type) {
        case 'story_ready':
        case 'story_completed':
          if (data.storyId) {
            router.push(`/stories/${data.storyId}/reader`);
          }
          break;

        case 'continue_reading':
          if (data.storyId) {
            router.push(`/stories/${data.storyId}/reader`);
          } else {
            const lastRead = getLastReadStory();
            if (lastRead) {
              router.push(`/stories/${lastRead.storyId}/reader`);
            } else {
              router.push('/(tabs)/library');
            }
          }
          break;

        case 'story_time':
          router.push('/(tabs)/library');
          break;
      }
    });

    return () => subscription.remove();
  }, [router]);
}
