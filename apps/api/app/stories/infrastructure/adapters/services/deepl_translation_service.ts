import * as deepl from 'deepl-node'
import env from '#start/env'
import { ITranslationService } from '#stories/domain/services/i_translation_service'
import { TranslationRequest, TranslationResult } from '#stories/domain/services/types/translation_types'

export class DeepLTranslationService implements ITranslationService {
  private readonly client: deepl.Translator

  private readonly SUPPORTED_LANGUAGES = [
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
  ]

  private readonly DIRECT_GENERATION_LANGUAGES = ['FR', 'EN', 'ES', 'PT', 'DE', 'IT']

  constructor() {
    const apiKey = env.get('DEEPL_API_KEY')
    if (!apiKey) {
      throw new Error('DEEPL_API_KEY is not configured')
    }
    this.client = new deepl.Translator(apiKey)
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const targetLang = this.mapToDeepLLanguage(request.targetLanguage)

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
  }

  async translateBatch(requests: TranslationRequest[]): Promise<TranslationResult[]> {
    return Promise.all(requests.map((request) => this.translate(request)))
  }

  supportsLanguage(languageCode: string): boolean {
    return this.SUPPORTED_LANGUAGES.includes(languageCode.toUpperCase())
  }

  needsTranslation(targetLanguageCode: string): boolean {
    return !this.DIRECT_GENERATION_LANGUAGES.includes(targetLanguageCode.toUpperCase())
  }

  private mapToDeepLLanguage(code: string): string {
    const mappings: Record<string, string> = {
      EN: 'EN-US',
      PT: 'PT-BR',
      ZH: 'ZH-HANS',
    }
    return mappings[code.toUpperCase()] || code.toUpperCase()
  }
}
