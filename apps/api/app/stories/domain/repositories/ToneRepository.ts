import { Tone } from '../value-objects/settings/Tone.vo.js'
import { ToneId } from '../value-objects/ids/ToneId.vo.js'

/**
 * Tone repository interface
 *
 * Read-only repository for tone reference data.
 * Tones are managed in a separate bounded context (Settings/Configuration).
 */
export abstract class IToneRepository {
  abstract findById(id: ToneId): Promise<Tone | null>
  abstract findAll(): Promise<Tone[]>
}