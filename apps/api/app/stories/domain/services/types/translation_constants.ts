/**
 * Languages that GPT-4o handles well natively - no translation needed
 * These are Tier 1 and Tier 2 languages in our strategy
 */
export const DIRECT_GENERATION_LANGUAGES = ['FR', 'EN', 'ES', 'PT', 'DE', 'IT'] as const

/**
 * Languages supported by DeepL API for translation
 * These are Tier 3 languages - generated in French then translated via DeepL
 */
export const DEEPL_SUPPORTED_LANGUAGES = [
  'JA',
  'AR',
  'TR',
  'NL',
  'PL',
  'RU',
  'ZH',
  'KO',
  'UK',
  'ID',
  'CS',
  'RO',
  'HU',
  'EL',
  'DA',
  'FI',
  'SV',
  'NO',
  'SK',
  'SL',
  'LT',
  'LV',
  'ET',
  'BG',
] as const

/**
 * Maximum text length allowed for translation (in characters)
 * Google Translate API has a limit of 5000 characters per request
 */
export const MAX_TRANSLATION_TEXT_LENGTH = 5000

/**
 * Mapping from our internal language codes to Google Translate codes
 * Note: 'LN' is the ISO 639-1 code for Lingala (not 'LI' which is Limburgish)
 * However, in our database we use 'LI' for Lingala, so we map it here
 */
export const GOOGLE_LANGUAGE_CODE_MAP: Record<string, string> = {
  LI: 'ln', // Our DB uses 'LI' for Lingala, Google uses 'ln'
  ZH: 'zh-CN', // Chinese simplified
}

/**
 * Mapping from our internal language codes to DeepL codes
 */
export const DEEPL_LANGUAGE_CODE_MAP: Record<string, string> = {
  EN: 'EN-US',
  PT: 'PT-BR',
  ZH: 'ZH-HANS',
}

export type DirectGenerationLanguage = (typeof DIRECT_GENERATION_LANGUAGES)[number]
export type DeepLSupportedLanguage = (typeof DEEPL_SUPPORTED_LANGUAGES)[number]
