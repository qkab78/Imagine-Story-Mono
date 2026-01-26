/**
 * Store Zustand pour la gestion de la langue de l'application
 * Séparation de la logique métier de l'UI
 */

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import * as Localization from 'expo-localization';
import type { SupportedLanguage } from '@/locales/types';

// Instance MMKV dédiée à la langue
const languageStorage = new MMKV({
  id: 'language-storage',
});

// Clés de stockage
const LANGUAGE_KEY = 'app-language';
const HAS_USER_PREFERENCE_KEY = 'has-user-language-preference';

/**
 * Récupère la locale de l'appareil (compatible expo-localization v17+)
 */
const getDeviceLocale = (): string => {
  const locales = Localization.getLocales();
  return locales[0]?.languageTag ?? 'fr';
};

/**
 * Détermine si une locale correspond à une langue supportée
 */
const getSupportedLanguage = (locale: string): SupportedLanguage => {
  const lang = locale.split('-')[0].toLowerCase();
  if (lang === 'en') return 'en';
  return 'fr'; // Français par défaut
};

/**
 * Charge la langue stockée ou détecte celle de l'appareil
 */
const loadStoredLanguage = (): SupportedLanguage => {
  const stored = languageStorage.getString(LANGUAGE_KEY);
  if (stored === 'en' || stored === 'fr') return stored;

  // Pas de préférence stockée - détecter depuis l'appareil
  return getSupportedLanguage(getDeviceLocale());
};

/**
 * Vérifie si l'utilisateur a défini une préférence de langue
 */
const hasUserPreference = (): boolean => {
  return languageStorage.getBoolean(HAS_USER_PREFERENCE_KEY) ?? false;
};

/**
 * Interface du store de langue
 */
export interface LanguageStore {
  /** Langue actuelle de l'application */
  language: SupportedLanguage;
  /** Indique si l'utilisateur a explicitement choisi une langue */
  hasUserPreference: boolean;
  /** Change la langue de l'application */
  setLanguage: (language: SupportedLanguage) => void;
  /** Réinitialise à la langue de l'appareil */
  resetToDeviceLanguage: () => void;
  /** Retourne le code locale complet (ex: fr-FR, en-US) */
  getLocaleCode: () => string;
}

/**
 * Store Zustand pour la gestion de la langue
 */
const useLanguageStore = create<LanguageStore>((set, get) => ({
  language: loadStoredLanguage(),
  hasUserPreference: hasUserPreference(),

  setLanguage: (language: SupportedLanguage) => {
    // Persister le choix
    languageStorage.set(LANGUAGE_KEY, language);
    languageStorage.set(HAS_USER_PREFERENCE_KEY, true);

    // Mettre à jour le state
    set({ language, hasUserPreference: true });
  },

  resetToDeviceLanguage: () => {
    const deviceLang = getSupportedLanguage(getDeviceLocale());

    // Effacer la préférence persistée
    languageStorage.delete(LANGUAGE_KEY);
    languageStorage.set(HAS_USER_PREFERENCE_KEY, false);

    // Mettre à jour le state
    set({ language: deviceLang, hasUserPreference: false });
  },

  getLocaleCode: () => {
    const lang = get().language;
    return lang === 'en' ? 'en-US' : 'fr-FR';
  },
}));

export default useLanguageStore;
