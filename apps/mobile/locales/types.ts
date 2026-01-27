/**
 * Types TypeScript pour l'internationalisation
 * Fournit la sécurité de type pour les clés de traduction
 */

import type { resources } from './index';

/**
 * Langues supportées par l'application
 */
export type SupportedLanguage = 'fr' | 'en';

/**
 * Namespaces disponibles pour les traductions
 */
export type TranslationNamespace = keyof (typeof resources)['fr'];

/**
 * Déclaration du module i18next pour le typage des traductions
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: (typeof resources)['fr'];
  }
}
