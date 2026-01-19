import { inject } from '@adonisjs/core'
import { ILanguageRepository } from '#stories/domain/repositories/LanguageRepository'
import type { Language } from '#stories/domain/value-objects/settings/Language.vo'

/**
 * Get All Languages Use Case
 *
 * Retrieves all available languages for story creation.
 */
@inject()
export class GetAllLanguagesUseCase {
  constructor(private readonly languageRepository: ILanguageRepository) {}

  async execute(): Promise<Language[]> {
    return this.languageRepository.findAll()
  }
}
