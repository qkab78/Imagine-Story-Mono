import { Translate } from '@google-cloud/translate/build/src/v2/index.js'
import env from '#start/env'
import { ITranslationService } from '#stories/domain/services/i_translation_service'
import { TranslationRequest, TranslationResult } from '#stories/domain/services/types/translation_types'

export class GoogleTranslationService implements ITranslationService {
  private readonly client: Translate

  private readonly DIRECT_GENERATION_LANGUAGES = ['FR', 'EN', 'ES', 'PT', 'DE', 'IT']

  constructor() {
    const apiKey = env.get('GOOGLE_TRANSLATE_API_KEY')
    if (!apiKey) {
      throw new Error('GOOGLE_TRANSLATE_API_KEY is not configured')
    }

    this.client = new Translate({ key: apiKey })
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const targetLang = this.mapToGoogleLanguage(request.targetLanguage)

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
  }

  async translateBatch(requests: TranslationRequest[]): Promise<TranslationResult[]> {
    if (requests.length === 0) {
      return []
    }

    const firstRequest = requests[0]
    const texts = requests.map((r) => r.text)
    const targetLang = this.mapToGoogleLanguage(firstRequest.targetLanguage)

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
  }

  supportsLanguage(_languageCode: string): boolean {
    return true
  }

  needsTranslation(targetLanguageCode: string): boolean {
    return !this.DIRECT_GENERATION_LANGUAGES.includes(targetLanguageCode.toUpperCase())
  }

  private mapToGoogleLanguage(code: string): string {
    const mappings: Record<string, string> = {
      LI: 'ln',
      ZH: 'zh-CN',
    }
    return mappings[code.toUpperCase()] || code.toLowerCase()
  }
}
