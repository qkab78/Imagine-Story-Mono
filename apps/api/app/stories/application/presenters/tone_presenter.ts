import type { Tone } from '#stories/domain/value-objects/settings/tone.vo'
import type { ToneDTO } from '#stories/application/dtos/story_d_t_o'

/**
 * Tone Presenter
 *
 * Transforms Tone value object to ToneDTO
 */
export class TonePresenter {
  /**
   * Transform a tone to DTO
   */
  public static toDTO(tone: Tone): ToneDTO {
    return {
      id: tone.id.getValue(),
      name: tone.name,
      description: tone.description,
    }
  }

  /**
   * Transform multiple tones to DTOs
   */
  public static toDTOs(tones: Tone[]): ToneDTO[] {
    return tones.map((tone) => this.toDTO(tone))
  }
}
