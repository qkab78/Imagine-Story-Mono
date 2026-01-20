import { inject } from '@adonisjs/core'
import { IThemeRepository } from '#stories/domain/repositories/theme_repository'
import type { Theme } from '#stories/domain/value-objects/settings/theme.vo'

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
