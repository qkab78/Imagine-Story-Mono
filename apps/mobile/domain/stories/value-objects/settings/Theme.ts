import { ThemeId } from '../ids/ThemeId'

/**
 * Theme value object
 *
 * Represents a story theme (e.g., Adventure, Mystery, Fantasy).
 * This is a value object because the story doesn't care about the theme's lifecycle,
 * only its current value at the time of story creation.
 *
 * Theme is managed in a separate bounded context (Settings/Configuration).
 */
export class Theme {
  private constructor(
    public readonly id: ThemeId,
    public readonly name: string,
    public readonly description: string,
    public readonly key: string
  ) {}

  /**
   * Create a Theme value object
   * @param id Theme UUID
   * @param name Theme name
   * @param description Theme description
   * @param key Theme key (english slug)
   */
  public static create(id: string, name: string, description: string, key: string): Theme {
    return new Theme(ThemeId.create(id), name, description, key)
  }

  /**
   * Check equality with another Theme (based on ID)
   */
  public equals(other: Theme): boolean {
    if (other === null || other === undefined) {
      return false
    }

    if (!(other instanceof Theme)) {
      return false
    }

    return this.id.equals(other.id)
  }

  /**
   * Get the theme ID as string
   */
  public getIdValue(): string {
    return this.id.getValue()
  }

  /**
   * Get the theme name
   */
  public getName(): string {
    return this.name
  }

  /**
   * Get the theme description
   */
  public getDescription(): string {
    return this.description
  }
}
