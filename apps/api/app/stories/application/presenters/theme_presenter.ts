import type { Theme } from '#stories/domain/value-objects/settings/theme.vo'
import type { ThemeDTO } from '#stories/application/dtos/story_d_t_o'

/**
 * Theme Presenter
 *
 * Transforms Theme value object to ThemeDTO
 */
export class ThemePresenter {
  /**
   * Transform a theme to DTO
   */
  public static toDTO(theme: Theme): ThemeDTO {
    return {
      id: theme.id.getValue(),
      name: theme.name,
      description: theme.description,
      key: theme.key,
    }
  }

  /**
   * Transform multiple themes to DTOs
   */
  public static toDTOs(themes: Theme[]): ThemeDTO[] {
    return themes.map((theme) => this.toDTO(theme))
  }
}
