import { ITranslationService } from '#stories/domain/services/i_translation_service'
import {
  TranslationRequest,
  TranslationResult,
  TranslationProvider,
} from '#stories/domain/services/types/translation_types'
import {
  DIRECT_GENERATION_LANGUAGES,
  DEEPL_SUPPORTED_LANGUAGES,
} from '#stories/domain/services/types/translation_constants'
import { DeepLTranslationService } from './deepl_translation_service.js'
import { GoogleTranslationService } from './google_translation_service.js'

export class CompositeTranslationService implements ITranslationService {
  constructor(
    private readonly deeplService: DeepLTranslationService,
    private readonly googleService: GoogleTranslationService
  ) {}

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const targetCode = request.targetLanguage.toUpperCase()

    if (this.isDirectGenerationLanguage(targetCode)) {
      return {
        translatedText: request.text,
        provider: 'none',
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
      }
    }

    if (this.isDeepLLanguage(targetCode)) {
      return this.deeplService.translate(request)
    }

    return this.googleService.translate(request)
  }

  async translateBatch(requests: TranslationRequest[]): Promise<TranslationResult[]> {
    if (requests.length === 0) {
      return []
    }

    // Group requests by target language to route to appropriate providers
    const groupedByLanguage = this.groupRequestsByTargetLanguage(requests)

    const results: TranslationResult[] = []

    for (const [targetLanguage, groupedRequests] of Object.entries(groupedByLanguage)) {
      const targetCode = targetLanguage.toUpperCase()

      if (this.isDirectGenerationLanguage(targetCode)) {
        // No translation needed
        const noTranslationResults = groupedRequests.map((request) => ({
          translatedText: request.text,
          provider: 'none' as const,
          sourceLanguage: request.sourceLanguage,
          targetLanguage: request.targetLanguage,
        }))
        results.push(...noTranslationResults)
      } else if (this.isDeepLLanguage(targetCode)) {
        const deeplResults = await this.deeplService.translateBatch(groupedRequests)
        results.push(...deeplResults)
      } else {
        const googleResults = await this.googleService.translateBatch(groupedRequests)
        results.push(...googleResults)
      }
    }

    // Restore original order based on original request indices
    return this.restoreOriginalOrder(requests, results)
  }

  supportsLanguage(_languageCode: string): boolean {
    return true
  }

  needsTranslation(targetLanguageCode: string): boolean {
    return !this.isDirectGenerationLanguage(targetLanguageCode.toUpperCase())
  }

  getProvider(targetLanguageCode: string): TranslationProvider {
    const code = targetLanguageCode.toUpperCase()

    if (this.isDirectGenerationLanguage(code)) {
      return 'none'
    }

    if (this.isDeepLLanguage(code)) {
      return 'deepl'
    }

    return 'google'
  }

  private isDirectGenerationLanguage(code: string): boolean {
    return DIRECT_GENERATION_LANGUAGES.includes(
      code as (typeof DIRECT_GENERATION_LANGUAGES)[number]
    )
  }

  private isDeepLLanguage(code: string): boolean {
    return DEEPL_SUPPORTED_LANGUAGES.includes(code as (typeof DEEPL_SUPPORTED_LANGUAGES)[number])
  }

  private groupRequestsByTargetLanguage(
    requests: TranslationRequest[]
  ): Record<string, TranslationRequest[]> {
    return requests.reduce(
      (groups, request) => {
        const key = request.targetLanguage.toUpperCase()
        if (!groups[key]) {
          groups[key] = []
        }
        groups[key].push(request)
        return groups
      },
      {} as Record<string, TranslationRequest[]>
    )
  }

  private restoreOriginalOrder(
    originalRequests: TranslationRequest[],
    results: TranslationResult[]
  ): TranslationResult[] {
    // Create a map of results by their text content for matching
    const resultMap = new Map<string, TranslationResult>()

    for (const result of results) {
      // Use a composite key of source language + target language + original text position
      const key = `${result.sourceLanguage}:${result.targetLanguage}`
      if (!resultMap.has(key)) {
        resultMap.set(key, result)
      }
    }

    // For each original request, find its corresponding result
    return originalRequests.map((request) => {
      const matchingResult = results.find(
        (r) =>
          r.sourceLanguage === request.sourceLanguage &&
          r.targetLanguage === request.targetLanguage
      )
      return matchingResult!
    })
  }
}
