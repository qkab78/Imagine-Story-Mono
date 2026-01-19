import { inject } from '@adonisjs/core'
import { IThemeRepository } from '#stories/domain/repositories/ThemeRepository'
import type { Theme } from '#stories/domain/value-objects/settings/Theme.vo'

/**
 * Get All Themes Use Case
 *
 * Retrieves all available themes for story creation.
 */
@inject()
export class GetAllThemesUseCase {
  constructor(private readonly themeRepository: IThemeRepository) {}

  async execute(): Promise<Theme[]> {
    return this.themeRepository.findAll()
  }
}
