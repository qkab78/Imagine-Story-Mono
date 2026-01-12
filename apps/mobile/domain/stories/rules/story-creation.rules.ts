import { ChildAge } from '../value-objects/metadata/ChildAge'
import { ChapterCount } from '../value-objects/metadata/ChapterCount'
import { ProtagonistName } from '../value-objects/metadata/ProtagonistName'
import { ThemeId } from '../value-objects/ids/ThemeId'
import { LanguageId } from '../value-objects/ids/LanguageId'
import { ToneId } from '../value-objects/ids/ToneId'
import { InvalidValueObjectException } from '../exceptions/InvalidValueObjectException'

/**
 * Story Creation Rules
 *
 * Contains business rules for story creation validation.
 */
export class StoryCreationRules {
  /**
   * Minimum hero name length
   */
  public static readonly MIN_HERO_NAME_LENGTH = 3

  /**
   * Maximum hero name length
   */
  public static readonly MAX_HERO_NAME_LENGTH = 20

  /**
   * Validate hero name
   * @param name Hero name
   * @throws InvalidValueObjectException if validation fails
   */
  public static validateHeroName(name: string): void {
    if (!name || typeof name !== 'string') {
      throw new InvalidValueObjectException('Hero name must be a non-empty string')
    }

    const trimmed = name.trim()

    if (trimmed.length < StoryCreationRules.MIN_HERO_NAME_LENGTH) {
      throw new InvalidValueObjectException(
        `Hero name must be at least ${StoryCreationRules.MIN_HERO_NAME_LENGTH} characters long`
      )
    }

    if (trimmed.length > StoryCreationRules.MAX_HERO_NAME_LENGTH) {
      throw new InvalidValueObjectException(
        `Hero name cannot exceed ${StoryCreationRules.MAX_HERO_NAME_LENGTH} characters`
      )
    }
  }

  /**
   * Validate child age
   * @param age Child age
   * @returns ChildAge value object
   * @throws InvalidValueObjectException if validation fails
   */
  public static validateChildAge(age: number): ChildAge {
    return ChildAge.create(age)
  }

  /**
   * Validate chapter count
   * @param count Number of chapters
   * @returns ChapterCount value object
   * @throws InvalidValueObjectException if validation fails
   */
  public static validateChapterCount(count: number): ChapterCount {
    return ChapterCount.create(count)
  }

  /**
   * Validate protagonist name
   * @param name Protagonist name
   * @returns ProtagonistName value object
   * @throws InvalidValueObjectException if validation fails
   */
  public static validateProtagonistName(name: string): ProtagonistName {
    return ProtagonistName.create(name)
  }

  /**
   * Validate theme ID
   * @param id Theme ID (UUID)
   * @returns ThemeId value object
   * @throws InvalidValueObjectException if validation fails
   */
  public static validateThemeId(id: string): ThemeId {
    return ThemeId.create(id)
  }

  /**
   * Validate language ID
   * @param id Language ID (UUID)
   * @returns LanguageId value object
   * @throws InvalidValueObjectException if validation fails
   */
  public static validateLanguageId(id: string): LanguageId {
    return LanguageId.create(id)
  }

  /**
   * Validate tone ID
   * @param id Tone ID (UUID)
   * @returns ToneId value object
   * @throws InvalidValueObjectException if validation fails
   */
  public static validateToneId(id: string): ToneId {
    return ToneId.create(id)
  }
}
