import { MMKV } from 'react-native-mmkv';

export const notificationStorage = new MMKV({
  id: 'notification-storage',
});

const KEYS = {
  PERMISSION_STATUS: 'notification.permissionStatus',
  PUSH_TOKEN: 'notification.pushToken',
  ONBOARDING_COMPLETED: 'notification.onboardingCompleted',
} as const;

// Permission status: 'granted' | 'denied' | 'undetermined'
export const getPermissionStatus = () =>
  notificationStorage.getString(KEYS.PERMISSION_STATUS);

export const setPermissionStatus = (status: string) =>
  notificationStorage.set(KEYS.PERMISSION_STATUS, status);

// Push token
export const getPushToken = () =>
  notificationStorage.getString(KEYS.PUSH_TOKEN);

export const setPushToken = (token: string) =>
  notificationStorage.set(KEYS.PUSH_TOKEN, token);

// Onboarding completed flag
export const hasCompletedNotificationOnboarding = () =>
  notificationStorage.getBoolean(KEYS.ONBOARDING_COMPLETED) ?? false;

export const setNotificationOnboardingCompleted = (completed: boolean) =>
  notificationStorage.set(KEYS.ONBOARDING_COMPLETED, completed);
