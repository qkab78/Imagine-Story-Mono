import { TranslationRequest, TranslationResult } from './types/translation_types.js'

export abstract class ITranslationService {
  abstract translate(request: TranslationRequest): Promise<TranslationResult>

  abstract translateBatch(requests: TranslationRequest[]): Promise<TranslationResult[]>

  abstract supportsLanguage(languageCode: string): boolean

  abstract needsTranslation(targetLanguageCode: string): boolean
}
