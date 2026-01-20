import { inject } from '@adonisjs/core'
import { IToneRepository } from '#stories/domain/repositories/tone_repository'
import type { Tone } from '#stories/domain/value-objects/settings/tone.vo'

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
