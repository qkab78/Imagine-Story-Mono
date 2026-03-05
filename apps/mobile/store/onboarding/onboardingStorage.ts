import { MMKV } from 'react-native-mmkv';

export const onboardingStorage = new MMKV({
  id: 'onboarding-storage',
});

const KEYS = {
  ONBOARDING_COMPLETED: 'onboarding.completed',
} as const;

export const hasCompletedOnboarding = () =>
  onboardingStorage.getBoolean(KEYS.ONBOARDING_COMPLETED) ?? false;

export const setOnboardingCompleted = (completed: boolean) =>
  onboardingStorage.set(KEYS.ONBOARDING_COMPLETED, completed);
