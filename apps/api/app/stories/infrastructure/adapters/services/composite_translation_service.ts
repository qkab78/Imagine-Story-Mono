import { ITranslationService } from '#stories/domain/services/i_translation_service'
import { TranslationRequest, TranslationResult } from '#stories/domain/services/types/translation_types'
import { DeepLTranslationService } from './deepl_translation_service.js'
import { GoogleTranslationService } from './google_translation_service.js'

export class CompositeTranslationService implements ITranslationService {
  private readonly DIRECT_GENERATION_LANGUAGES = ['FR', 'EN', 'ES', 'PT', 'DE', 'IT']

  private readonly DEEPL_LANGUAGES = [
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

  constructor(
    private readonly deeplService: DeepLTranslationService,
    private readonly googleService: GoogleTranslationService
  ) {}

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const targetCode = request.targetLanguage.toUpperCase()

    if (this.DIRECT_GENERATION_LANGUAGES.includes(targetCode)) {
      return {
        translatedText: request.text,
        provider: 'none',
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
      }
    }

    if (this.DEEPL_LANGUAGES.includes(targetCode)) {
      return this.deeplService.translate(request)
    }

    return this.googleService.translate(request)
  }

  async translateBatch(requests: TranslationRequest[]): Promise<TranslationResult[]> {
    if (requests.length === 0) {
      return []
    }

    const targetCode = requests[0].targetLanguage.toUpperCase()

    if (this.DIRECT_GENERATION_LANGUAGES.includes(targetCode)) {
      return requests.map((request) => ({
        translatedText: request.text,
        provider: 'none' as const,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
      }))
    }

    if (this.DEEPL_LANGUAGES.includes(targetCode)) {
      return this.deeplService.translateBatch(requests)
    }

    return this.googleService.translateBatch(requests)
  }

  supportsLanguage(languageCode: string): boolean {
    return true
  }

  needsTranslation(targetLanguageCode: string): boolean {
    return !this.DIRECT_GENERATION_LANGUAGES.includes(targetLanguageCode.toUpperCase())
  }

  getProvider(targetLanguageCode: string): 'deepl' | 'google' | 'none' {
    const code = targetLanguageCode.toUpperCase()

    if (this.DIRECT_GENERATION_LANGUAGES.includes(code)) {
      return 'none'
    }

    if (this.DEEPL_LANGUAGES.includes(code)) {
      return 'deepl'
    }

    return 'google'
  }
}
