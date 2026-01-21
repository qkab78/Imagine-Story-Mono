import * as deepl from 'deepl-node'
import env from '#start/env'
import { ITranslationService } from '#stories/domain/services/i_translation_service'
import { TranslationRequest, TranslationResult } from '#stories/domain/services/types/translation_types'
import {
  DEEPL_SUPPORTED_LANGUAGES,
  DIRECT_GENERATION_LANGUAGES,
  DEEPL_LANGUAGE_CODE_MAP,
} from '#stories/domain/services/types/translation_constants'
import { TranslationException } from '#stories/application/exceptions/index'

export class DeepLTranslationService implements ITranslationService {
  private readonly client: deepl.Translator

  constructor() {
    const apiKey = env.get('DEEPL_API_KEY')
    if (!apiKey) {
      throw new Error('DEEPL_API_KEY is not configured')
    }
    this.client = new deepl.Translator(apiKey)
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const targetLang = this.mapToDeepLLanguage(request.targetLanguage)

    try {
      const result = await this.client.translateText(
        request.text,
        request.sourceLanguage.toLowerCase() as deepl.SourceLanguageCode,
        targetLang as deepl.TargetLanguageCode
      )

      const translatedText = Array.isArray(result) ? result[0].text : result.text

      return {
        translatedText,
        provider: 'deepl',
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error during DeepL translation'
      throw TranslationException.deeplError(
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

    try {
      return await Promise.all(requests.map((request) => this.translate(request)))
    } catch (error) {
      if (error instanceof TranslationException) {
        throw error
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error during DeepL batch translation'
      throw TranslationException.deeplError(errorMessage, '', '')
    }
  }

  supportsLanguage(languageCode: string): boolean {
    return DEEPL_SUPPORTED_LANGUAGES.includes(
      languageCode.toUpperCase() as (typeof DEEPL_SUPPORTED_LANGUAGES)[number]
    )
  }

  needsTranslation(targetLanguageCode: string): boolean {
    return !DIRECT_GENERATION_LANGUAGES.includes(
      targetLanguageCode.toUpperCase() as (typeof DIRECT_GENERATION_LANGUAGES)[number]
    )
  }

  private mapToDeepLLanguage(code: string): string {
    return DEEPL_LANGUAGE_CODE_MAP[code.toUpperCase()] || code.toUpperCase()
  }
}
