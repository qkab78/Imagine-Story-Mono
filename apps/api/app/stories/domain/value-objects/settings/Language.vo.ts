import { LanguageId } from '../ids/LanguageId.vo.js'

/**
 * Language value object
 *
 * Represents a story language (e.g., French, English, Spanish).
 * Includes whether the language is free or requires payment.
 *
 * This is a value object because the story doesn't care about the language's lifecycle,
 * only its current value at the time of story creation.
 *
 * Language is managed in a separate bounded context (Settings/Configuration).
 */
export class Language {
  private constructor(
    public readonly id: LanguageId,
    public readonly name: string,
    public readonly code: string,
    public readonly isFree: boolean
  ) {}

  /**
   * Create a Language value object
   * @param id Language UUID
   * @param name Language name (e.g., "Français", "English")
   * @param code ISO language code (e.g., "fr", "en")
   * @param isFree Whether the language is free or requires payment
   */
  public static create(id: string, name: string, code: string, isFree: boolean): Language {
    return new Language(LanguageId.create(id), name, code, isFree)
  }

  /**
   * Check equality with another Language (based on ID)
   */
  public equals(other: Language): boolean {
    if (other === null || other === undefined) {
      return false
    }

    if (!(other instanceof Language)) {
      return false
    }

    return this.id.equals(other.id)
  }

  /**
   * Get the language ID as string
   */
  public getIdValue(): string {
    return this.id.getValue()
  }

  /**
   * Check if this is a premium language
   */
  public isPremium(): boolean {
    return !this.isFree
  }
}
