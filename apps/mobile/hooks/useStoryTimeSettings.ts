import { useState, useCallback } from 'react';
import {
  getStoryTimeConfig,
  setStoryTimeConfig,
  setStoryTimeEnabled as persistStoryTimeEnabled,
} from '@/store/notifications/readingProgressStorage';
import {
  rescheduleStoryTimeNotification,
  cancelStoryTimeNotification,
} from '@/services/notifications/notificationService';

/**
 * Hook for managing the daily "story time" notification settings.
 */
export const useStoryTimeSettings = () => {
  const [config, setConfig] = useState(getStoryTimeConfig);

  const updateTime = useCallback(async (hour: number, minute: number) => {
    setStoryTimeConfig(hour, minute);
    setConfig((prev) => ({ ...prev, hour, minute }));

    if (config.enabled) {
      await rescheduleStoryTimeNotification(hour, minute);
    }
  }, [config.enabled]);

  const toggleEnabled = useCallback(async (enabled: boolean) => {
    persistStoryTimeEnabled(enabled);
    setConfig((prev) => ({ ...prev, enabled }));

    if (enabled) {
      const current = getStoryTimeConfig();
      await rescheduleStoryTimeNotification(current.hour, current.minute);
    } else {
      await cancelStoryTimeNotification();
    }
  }, []);

  const formatTime = useCallback((hour: number, minute: number): string => {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }, []);

  return {
    hour: config.hour,
    minute: config.minute,
    enabled: config.enabled,
    formattedTime: formatTime(config.hour, config.minute),
    updateTime,
    toggleEnabled,
  };
};

export default useStoryTimeSettings;
