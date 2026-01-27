/**
 * Hook personnalisé pour les traductions
 * Fournit un accès type-safe aux traductions avec synchronisation du store
 */

import { useCallback, useEffect } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import useLanguageStore from '@/store/language/languageStore';
import type { SupportedLanguage, TranslationNamespace } from '@/locales/types';

/**
 * Hook pour accéder aux traductions avec support du namespace
 * Synchronise automatiquement i18next avec le store de langue
 *
 * @param ns - Namespace de traduction (optionnel)
 * @returns Fonctions et état de traduction
 *
 * @example
 * ```tsx
 * const { t } = useAppTranslation('auth');
 * return <Text>{t('login.title')}</Text>;
 * ```
 */
export const useAppTranslation = (ns?: TranslationNamespace | TranslationNamespace[]) => {
  const { t, i18n } = useI18nTranslation(ns);
  const { language, setLanguage } = useLanguageStore();

  // Synchroniser i18next avec le store quand la langue change dans le store
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // Fonction pour changer la langue qui met à jour le store et i18next
  const changeLanguage = useCallback(
    (newLanguage: SupportedLanguage) => {
      setLanguage(newLanguage);
      i18n.changeLanguage(newLanguage);
    },
    [setLanguage, i18n]
  );

  return {
    /** Fonction de traduction */
    t,
    /** Instance i18next */
    i18n,
    /** Langue actuelle */
    language: language as SupportedLanguage,
    /** Changer la langue de l'application */
    changeLanguage,
  };
};

export default useAppTranslation;
