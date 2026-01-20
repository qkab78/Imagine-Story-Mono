import { ToneId } from '../ids/tone_id.vo.js'

/**
 * Tone value object
 *
 * Represents a story tone (e.g., Happy, Calm, Adventurous, Magical).
 * This is a value object because the story doesn't care about the tone's lifecycle,
 * only its current value at the time of story creation.
 *
 * Tone is managed in a separate bounded context (Settings/Configuration).
 */
export class Tone {
  private constructor(
    public readonly id: ToneId,
    public readonly name: string,
    public readonly description: string
  ) {}

  /**
   * Create a Tone value object
   * @param id Tone UUID
   * @param name Tone name
   * @param description Tone description
   */
  public static create(id: string, name: string, description: string): Tone {
    return new Tone(ToneId.create(id), name, description)
  }

  /**
   * Check equality with another Tone (based on ID)
   */
  public equals(other: Tone): boolean {
    if (other === null || other === undefined) {
      return false
    }

    if (!(other instanceof Tone)) {
      return false
    }

    return this.id.equals(other.id)
  }

  /**
   * Get the tone ID as string
   */
  public getIdValue(): string {
    return this.id.getValue()
  }
}
