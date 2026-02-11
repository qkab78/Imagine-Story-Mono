import { Theme } from '@/domain/stories/value-objects/settings/Theme'
import { Language } from '@/domain/stories/value-objects/settings/Language'
import { Tone } from '@/domain/stories/value-objects/settings/Tone'

/**
 * Backend DTO interfaces for settings
 */
export interface ThemeDTO {
  id: string
  name: string
  description: string
  key: string
}

export interface LanguageDTO {
  id: string
  name: string
  code: string
  isFree: boolean
}

export interface ToneDTO {
  id: string
  name: string
  description: string
}

/**
 * Theme, Language, Tone Mapper
 *
 * Maps backend settings DTOs to frontend domain value objects.
 */
export class ThemeLanguageToneMapper {
  /**
   * Map backend ThemeDTO to frontend Theme value object
   * @param dto Backend ThemeDTO
   * @returns Frontend Theme value object
   */
  public static themeDTOToDomain(dto: ThemeDTO): Theme {
    return Theme.create(dto.id, dto.name, dto.description, dto.key)
  }

  /**
   * Map backend LanguageDTO to frontend Language value object
   * @param dto Backend LanguageDTO
   * @returns Frontend Language value object
   */
  public static languageDTOToDomain(dto: LanguageDTO): Language {
    return Language.create(dto.id, dto.name, dto.code, dto.isFree)
  }

  /**
   * Map backend ToneDTO to frontend Tone value object
   * @param dto Backend ToneDTO
   * @returns Frontend Tone value object
   */
  public static toneDTOToDomain(dto: ToneDTO): Tone {
    return Tone.create(dto.id, dto.name, dto.description)
  }

  /**
   * Map array of ThemeDTOs to array of Theme value objects
   * @param dtos Array of backend ThemeDTOs
   * @returns Array of frontend Theme value objects
   */
  public static themesDTOToDomain(dtos: ThemeDTO[]): Theme[] {
    return dtos.map((dto) => this.themeDTOToDomain(dto))
  }

  /**
   * Map array of LanguageDTOs to array of Language value objects
   * @param dtos Array of backend LanguageDTOs
   * @returns Array of frontend Language value objects
   */
  public static languagesDTOToDomain(dtos: LanguageDTO[]): Language[] {
    return dtos.map((dto) => this.languageDTOToDomain(dto))
  }

  /**
   * Map array of ToneDTOs to array of Tone value objects
   * @param dtos Array of backend ToneDTOs
   * @returns Array of frontend Tone value objects
   */
  public static tonesDTOToDomain(dtos: ToneDTO[]): Tone[] {
    return dtos.map((dto) => this.toneDTOToDomain(dto))
  }
}
