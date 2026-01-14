/**
 * Languages constants - Synchronisé avec le backend
 * Source: apps/api/app/stories/constants/allowed_languages.ts
 */

export const ALLOWED_LANGUAGES = {
  FR: 'French',
  EN: 'English',
  LI: 'Lingala',
  ES: 'Spanish',
  PT: 'Portuguese',
  DE: 'Deutsch',
  IT: 'Italiano',
  NL: 'Nederlands',
  PL: 'Polski',
  RU: 'Russian',
  TR: 'Turkish',
  AR: 'Arabic',
  JA: 'Japanese',
} as const;

export type LanguageCode = keyof typeof ALLOWED_LANGUAGES;

/**
 * Mapping des langues vers leurs labels affichables avec emojis
 */
export const LANGUAGE_LABELS: Record<LanguageCode, { label: string; icon: string }> = {
  FR: { label: 'Français', icon: '🇫🇷' },
  EN: { label: 'English', icon: '🇬🇧' },
  ES: { label: 'Español', icon: '🇪🇸' },
  PT: { label: 'Português', icon: '🇵🇹' },
  DE: { label: 'Deutsch', icon: '🇩🇪' },
  IT: { label: 'Italiano', icon: '🇮🇹' },
  NL: { label: 'Nederlands', icon: '🇳🇱' },
  PL: { label: 'Polski', icon: '🇵🇱' },
  RU: { label: 'Русский', icon: '🇷🇺' },
  TR: { label: 'Türkçe', icon: '🇹🇷' },
  AR: { label: 'العربية', icon: '🇸🇦' },
  JA: { label: '日本語', icon: '🇯🇵' },
  LI: { label: 'Lingala', icon: '🇨🇩' },
};

/**
 * Options pour le select de langue
 */
export const getLanguageOptions = () => {
  return Object.entries(LANGUAGE_LABELS).map(([code, { label, icon }]) => ({
    label: `${label} ${icon}`,
    value: code,
    icon,
  }));
};
