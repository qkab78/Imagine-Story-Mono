import { inject } from '@adonisjs/core'
import { IToneRepository } from '#stories/domain/repositories/ToneRepository'
import type { Tone } from '#stories/domain/value-objects/settings/Tone.vo'

/**
 * Get All Tones Use Case
 *
 * Retrieves all available tones for story creation.
 */
@inject()
export class GetAllTonesUseCase {
  constructor(private readonly toneRepository: IToneRepository) {}

  async execute(): Promise<Tone[]> {
    return this.toneRepository.findAll()
  }
}
