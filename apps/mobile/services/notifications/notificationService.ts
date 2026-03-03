import * as Notifications from 'expo-notifications';
import {
  getReadingStreak,
  getTotalStoriesRead,
  getStoryTimeConfig,
} from '@/store/notifications/readingProgressStorage';

const NOTIFICATION_IDS = {
  CONTINUE_READING: 'continue-reading-reminder',
  STORY_TIME: 'story-time-daily',
} as const;

const THEME_SUGGESTIONS = [
  'Aventure et exploration',
  'Magie et fantastique',
  'Animaux et nature',
  'Amitié et solidarité',
  'Mystère et enquête',
  'Courage et dépassement',
  'Famille et foyer',
];

const getRandomThemeSuggestion = (): string => {
  return THEME_SUGGESTIONS[Math.floor(Math.random() * THEME_SUGGESTIONS.length)];
};

/**
 * Send an immediate notification when a story generation is completed.
 */
export const scheduleStoryReadyNotification = async (
  storyTitle: string,
  chaptersCount: number,
  themeName: string
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ Ton histoire est prête !',
        body: `« ${storyTitle} » vient d'être créée avec ${chaptersCount} chapitres sur le thème ${themeName}. Viens la découvrir !`,
        sound: true,
        data: { type: 'story_ready' },
      },
      trigger: null,
    });
  } catch (error) {
    console.error('[NotificationService] Error sending story ready notification:', error);
  }
};

/**
 * Schedule a "continue reading" reminder 24h from now.
 * Cancels any previous continue-reading reminder first.
 */
export const scheduleContinueReadingReminder = async (
  storyTitle: string,
  currentChapter: number,
  totalChapters: number
) => {
  try {
    // Cancel any existing continue-reading reminder
    await cancelContinueReadingReminder();

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.CONTINUE_READING,
      content: {
        title: '📚 Reprends ton histoire !',
        body: `Tu en étais au chapitre ${currentChapter} sur ${totalChapters} de « ${storyTitle} ». Continue l'aventure !`,
        sound: true,
        data: { type: 'continue_reading' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 86400, // 24 hours
        repeats: false,
      },
    });
  } catch (error) {
    console.error('[NotificationService] Error scheduling continue reading reminder:', error);
  }
};

/**
 * Cancel the continue-reading reminder.
 */
export const cancelContinueReadingReminder = async () => {
  try {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.CONTINUE_READING);
  } catch {
    // Notification may not exist yet, that's fine
  }
};

/**
 * Schedule the daily "story time" notification at a specific hour/minute.
 * Cancels any previous daily reminder first.
 */
export const scheduleStoryTimeNotification = async (hour: number, minute: number) => {
  try {
    await cancelStoryTimeNotification();

    const streak = getReadingStreak();
    const totalRead = getTotalStoriesRead();
    const suggestion = getRandomThemeSuggestion();

    let body: string;
    if (streak.count > 1) {
      body = `${streak.count} soirs consécutifs de lecture 🔥 ! Ce soir, que dirais-tu d'une histoire « ${suggestion} » ?`;
    } else if (totalRead > 0) {
      body = `Tu as déjà lu ${totalRead} histoire${totalRead > 1 ? 's' : ''}. Le moment parfait pour une nouvelle aventure « ${suggestion} » !`;
    } else {
      body = `Le moment parfait pour une histoire avant de dormir. Que dirais-tu d'une aventure « ${suggestion} » ?`;
    }

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.STORY_TIME,
      content: {
        title: '🌙 C\'est l\'heure du conte !',
        body,
        sound: true,
        data: { type: 'story_time' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch (error) {
    console.error('[NotificationService] Error scheduling story time notification:', error);
  }
};

/**
 * Cancel the daily story-time notification.
 */
export const cancelStoryTimeNotification = async () => {
  try {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.STORY_TIME);
  } catch {
    // Notification may not exist yet, that's fine
  }
};

/**
 * Reschedule the story-time notification (cancel + schedule at new time).
 */
export const rescheduleStoryTimeNotification = async (hour: number, minute: number) => {
  await scheduleStoryTimeNotification(hour, minute);
};

/**
 * Initialize the story-time notification on app startup if enabled.
 */
export const initStoryTimeNotification = async () => {
  const config = getStoryTimeConfig();
  if (config.enabled) {
    await scheduleStoryTimeNotification(config.hour, config.minute);
  }
};
