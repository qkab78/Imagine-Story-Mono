/**
 * Configuration i18next pour l'internationalisation
 * Point d'entrée pour le système de traduction
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { MMKV } from 'react-native-mmkv';

// Import des traductions françaises
import frCommon from './fr/common.json';
import frAuth from './fr/auth.json';
import frOnboarding from './fr/onboarding.json';
import frProfile from './fr/profile.json';
import frSubscription from './fr/subscription.json';
import frStories from './fr/stories.json';

// Import des traductions anglaises
import enCommon from './en/common.json';
import enAuth from './en/auth.json';
import enOnboarding from './en/onboarding.json';
import enProfile from './en/profile.json';
import enSubscription from './en/subscription.json';
import enStories from './en/stories.json';

// Storage pour la préférence de langue
const languageStorage = new MMKV({ id: 'language-storage' });

/**
 * Récupère la locale de l'appareil (compatible expo-localization v17+)
 */
const getDeviceLocale = (): string => {
  const locales = Localization.getLocales();
  return locales[0]?.languageTag ?? 'fr';
};

/**
 * Détermine la langue initiale
 * Priorité: préférence utilisateur > langue appareil > français
 */
const getInitialLanguage = (): string => {
  const stored = languageStorage.getString('app-language');
  if (stored === 'en' || stored === 'fr') return stored;

  // Détecter depuis l'appareil
  const deviceLocale = getDeviceLocale().split('-')[0].toLowerCase();
  return deviceLocale === 'en' ? 'en' : 'fr';
};

/**
 * Ressources de traduction organisées par langue et namespace
 */
export const resources = {
  fr: {
    common: frCommon,
    auth: frAuth,
    onboarding: frOnboarding,
    profile: frProfile,
    subscription: frSubscription,
    stories: frStories,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    onboarding: enOnboarding,
    profile: enProfile,
    subscription: enSubscription,
    stories: enStories,
  },
} as const;

/**
 * Initialisation de i18next
 */
i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'fr',
  defaultNS: 'common',

  interpolation: {
    escapeValue: false, // React gère déjà l'échappement
  },

  // Support TypeScript
  returnNull: false,

  // Mode debug en développement
  debug: __DEV__,
});

export default i18n;
