import { create } from "zustand";
import { profileStorage } from "../mmkv";

export type ProfileSettings = {
  notifications: boolean;
  personalizedRecommendations: boolean;
  strictParentalControl: boolean;
  shareStories?: boolean;
  darkMode?: boolean;
};

export type ProfileStats = {
  storiesCreated: number;
  storiesRead: number;
  favorites: number;
  daysUsed: number;
};

export type FamilyProfile = {
  familyName: string;
  parentName: string;
  childName: string;
  childAge: number;
  avatar: string;
};

export type ProfileStore = {
  settings: ProfileSettings;
  stats: ProfileStats;
  updateSetting: (key: keyof ProfileSettings, value: boolean) => void;
  updateStats: (stats: Partial<ProfileStats>) => void;
  resetSettings: () => void;
  loadFromStorage: () => void;
};

const defaultSettings: ProfileSettings = {
  notifications: true,
  personalizedRecommendations: true,
  strictParentalControl: true,
  // shareStories: false,
  // darkMode: false,
};

export const settingsDescription: Record<keyof ProfileSettings, string> = {
  notifications: "Recevoir des notifications",
  personalizedRecommendations: "Recevoir des recommandations personnalisées",
  shareStories: "Partager des histoires",
  darkMode: "Mode sombre",
  strictParentalControl: "Contrôle parental strict",
};

export const settingsLabel: Record<keyof ProfileSettings, string> = {
  notifications: "Notifications",
  personalizedRecommendations: "Recommandations personnalisées",
  shareStories: "Partager des histoires",
  darkMode: "Mode sombre",
  strictParentalControl: "Contrôle parental strict",
};
const defaultStats: ProfileStats = {
  storiesCreated: 12,
  storiesRead: 45,
  favorites: 7,
  daysUsed: 23,
};

// Helpers pour la persistance MMKV
const loadSettings = (): ProfileSettings => {
  try {
    const stored = profileStorage.getString('profile-settings');
    return stored ? JSON.parse(stored) : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

const saveSettings = (settings: ProfileSettings) => {
  profileStorage.set('profile-settings', JSON.stringify(settings));
};

const loadStats = (): ProfileStats => {
  try {
    const stored = profileStorage.getString('profile-stats');
    return stored ? JSON.parse(stored) : defaultStats;
  } catch {
    return defaultStats;
  }
};

const saveStats = (stats: ProfileStats) => {
  profileStorage.set('profile-stats', JSON.stringify(stats));
};

const useProfileStore = create<ProfileStore>((set, get) => ({
  settings: loadSettings(),
  stats: loadStats(),

  updateSetting: (key: keyof ProfileSettings, value: boolean) => {
    const newSettings = {
      ...get().settings,
      [key]: value,
    };
    saveSettings(newSettings);
    set({ settings: newSettings });
  },

  updateStats: (statsUpdate: Partial<ProfileStats>) => {
    const newStats = {
      ...get().stats,
      ...statsUpdate,
    };
    saveStats(newStats);
    set({ stats: newStats });
  },

  resetSettings: () => {
    saveSettings(defaultSettings);
    set({ settings: defaultSettings });
  },

  loadFromStorage: () => {
    set({
      settings: loadSettings(),
      stats: loadStats(),
    });
  },
}));

export default useProfileStore;