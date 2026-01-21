import { Translate } from '@google-cloud/translate/build/src/v2/index.js'
import env from '#start/env'
import { ITranslationService } from '#stories/domain/services/i_translation_service'
import { TranslationRequest, TranslationResult } from '#stories/domain/services/types/translation_types'
import {
  DIRECT_GENERATION_LANGUAGES,
  GOOGLE_LANGUAGE_CODE_MAP,
  MAX_TRANSLATION_TEXT_LENGTH,
} from '#stories/domain/services/types/translation_constants'
import { TranslationException } from '#stories/application/exceptions/index'

export class GoogleTranslationService implements ITranslationService {
  private readonly client: Translate

  constructor() {
    const apiKey = env.get('GOOGLE_TRANSLATE_API_KEY')
    if (!apiKey) {
      throw new Error('GOOGLE_TRANSLATE_API_KEY is not configured')
    }

    this.client = new Translate({ key: apiKey })
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    this.validateRequest(request)

    const targetLang = this.mapToGoogleLanguage(request.targetLanguage)

    try {
      const [translation] = await this.client.translate(request.text, {
        from: request.sourceLanguage.toLowerCase(),
        to: targetLang,
      })

      return {
        translatedText: translation,
        provider: 'google',
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error during Google translation'
      throw TranslationException.googleError(
        errorMessage,
        request.sourceLanguage,
        request.targetLanguage
      )
    }
  }

  async translateBatch(requests: TranslationRequest[]): Promise<TranslationResult[]> {
    if (requests.length === 0) {
      return []
    }

    requests.forEach((request) => this.validateRequest(request))

    const firstRequest = requests[0]
    const texts = requests.map((r) => r.text)
    const targetLang = this.mapToGoogleLanguage(firstRequest.targetLanguage)

    try {
      const [translations] = await this.client.translate(texts, {
        from: firstRequest.sourceLanguage.toLowerCase(),
        to: targetLang,
      })

      const translationsArray = Array.isArray(translations) ? translations : [translations]

      return translationsArray.map((translation, index) => ({
        translatedText: translation,
        provider: 'google' as const,
        sourceLanguage: requests[index].sourceLanguage,
        targetLanguage: requests[index].targetLanguage,
      }))
    } catch (error) {
      if (error instanceof TranslationException) {
        throw error
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error during Google batch translation'
      throw TranslationException.googleError(errorMessage, '', '')
    }
  }

  supportsLanguage(_languageCode: string): boolean {
    return true
  }

  needsTranslation(targetLanguageCode: string): boolean {
    return !DIRECT_GENERATION_LANGUAGES.includes(
      targetLanguageCode.toUpperCase() as (typeof DIRECT_GENERATION_LANGUAGES)[number]
    )
  }

  private validateRequest(request: TranslationRequest): void {
    if (!request.text || request.text.trim().length === 0) {
      throw TranslationException.validationError('Translation text cannot be empty')
    }

    if (request.text.length > MAX_TRANSLATION_TEXT_LENGTH) {
      throw TranslationException.validationError(
        `Translation text exceeds maximum length of ${MAX_TRANSLATION_TEXT_LENGTH} characters (got ${request.text.length})`
      )
    }

    if (!request.sourceLanguage || request.sourceLanguage.trim().length === 0) {
      throw TranslationException.validationError('Source language code is required')
    }

    if (!request.targetLanguage || request.targetLanguage.trim().length === 0) {
      throw TranslationException.validationError('Target language code is required')
    }
  }

  private mapToGoogleLanguage(code: string): string {
    return GOOGLE_LANGUAGE_CODE_MAP[code.toUpperCase()] || code.toLowerCase()
  }
}
