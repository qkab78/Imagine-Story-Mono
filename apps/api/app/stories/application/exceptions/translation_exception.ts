import { ApplicationException } from './application_exception.js'

/**
 * Translation Exception
 *
 * Exception for translation service errors.
 * Includes information about the provider and language pair involved.
 */
export class TranslationException extends ApplicationException {
  public readonly provider: string
  public readonly sourceLanguage: string
  public readonly targetLanguage: string

  constructor(
    message: string,
    provider: string,
    sourceLanguage: string,
    targetLanguage: string,
    code: string = 'TRANSLATION_ERROR'
  ) {
    super(message, code, 502) // 502 Bad Gateway - external service failure
    this.name = 'TranslationException'
    this.provider = provider
    this.sourceLanguage = sourceLanguage
    this.targetLanguage = targetLanguage
  }

  static deeplError(
    message: string,
    sourceLanguage: string,
    targetLanguage: string
  ): TranslationException {
    return new TranslationException(
      message,
      'deepl',
      sourceLanguage,
      targetLanguage,
      'DEEPL_TRANSLATION_ERROR'
    )
  }

  static googleError(
    message: string,
    sourceLanguage: string,
    targetLanguage: string
  ): TranslationException {
    return new TranslationException(
      message,
      'google',
      sourceLanguage,
      targetLanguage,
      'GOOGLE_TRANSLATION_ERROR'
    )
  }

  static validationError(message: string): TranslationException {
    return new TranslationException(message, 'none', '', '', 'TRANSLATION_VALIDATION_ERROR')
  }
}
