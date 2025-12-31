import type { Language } from '#stories/domain/value-objects/settings/Language.vo'
import type { LanguageDTO } from '#stories/application/dtos/StoryDTO'

/**
 * Language Presenter
 *
 * Transforms Language value object to LanguageDTO
 */
export class LanguagePresenter {
  /**
   * Transform a language to DTO
   */
  public static toDTO(language: Language): LanguageDTO {
    return {
      id: language.id.getValue(),
      name: language.name,
      code: language.code,
      isFree: language.isFree,
    }
  }

  /**
   * Transform multiple languages to DTOs
   */
  public static toDTOs(languages: Language[]): LanguageDTO[] {
    return languages.map((language) => this.toDTO(language))
  }
}
