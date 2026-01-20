export interface TranslationRequest {
  text: string
  sourceLanguage: string
  targetLanguage: string
}

export interface TranslationResult {
  translatedText: string
  provider: TranslationProvider
  sourceLanguage: string
  targetLanguage: string
}

export type TranslationProvider = 'deepl' | 'google' | 'none'
