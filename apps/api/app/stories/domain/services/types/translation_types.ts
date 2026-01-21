/**
 * Request object for translation operations
 */
export interface TranslationRequest {
  /**
   * The text content to be translated
   */
  text: string

  /**
   * Source language code in ISO 639-1 format (e.g., 'FR', 'EN', 'ES')
   * @example 'FR' for French, 'EN' for English
   */
  sourceLanguage: string

  /**
   * Target language code in ISO 639-1 format (e.g., 'JA', 'AR', 'LI')
   * Note: Some codes may be internal mappings (e.g., 'LI' for Lingala which is 'ln' in ISO)
   * @example 'JA' for Japanese, 'AR' for Arabic
   */
  targetLanguage: string
}

/**
 * Result object returned from translation operations
 */
export interface TranslationResult {
  /**
   * The translated text content
   */
  translatedText: string

  /**
   * The translation provider that was used
   * - 'deepl': DeepL API was used for translation
   * - 'google': Google Translate API was used for translation
   * - 'none': No translation was performed (direct generation language)
   */
  provider: TranslationProvider

  /**
   * Source language code that was used (ISO 639-1 format)
   */
  sourceLanguage: string

  /**
   * Target language code that was requested (ISO 639-1 format)
   */
  targetLanguage: string
}

/**
 * Available translation providers
 * - 'deepl': DeepL API - high quality for supported languages (JA, AR, TR, NL, PL, RU, etc.)
 * - 'google': Google Translate API - fallback for unsupported languages (e.g., Lingala)
 * - 'none': No translation needed (direct generation in FR, EN, ES, PT, DE, IT)
 */
export type TranslationProvider = 'deepl' | 'google' | 'none'
