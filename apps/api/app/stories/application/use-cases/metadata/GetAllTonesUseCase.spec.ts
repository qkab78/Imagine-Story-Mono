import { test } from '@japa/runner'
import { GetAllTonesUseCase } from './GetAllTonesUseCase.js'
import { IToneRepository } from '#stories/domain/repositories/ToneRepository'
import { Tone } from '#stories/domain/value-objects/settings/Tone.vo'
import { ToneId } from '#stories/domain/value-objects/ids/ToneId.vo'

test.group(GetAllTonesUseCase.name, () => {
  class TestToneRepository implements IToneRepository {
    private readonly tones: Tone[] = []

    constructor(tones: Tone[] = []) {
      this.tones = tones
    }

    findById(_id: ToneId): Promise<Tone | null> {
      throw new Error('Method not implemented.')
    }

    findAll(): Promise<Tone[]> {
      return Promise.resolve(this.tones)
    }
  }

  test('should return all tones', async ({ assert }) => {
    const tones = [
      Tone.create('123e4567-e89b-12d3-a456-426614174001', 'Happy', 'A happy tone'),
      Tone.create('123e4567-e89b-12d3-a456-426614174002', 'Sad', 'A sad tone'),
      Tone.create('123e4567-e89b-12d3-a456-426614174003', 'Exciting', 'An exciting tone'),
    ]

    const toneRepository = new TestToneRepository(tones)
    const useCase = new GetAllTonesUseCase(toneRepository)

    const result = await useCase.execute()

    assert.lengthOf(result, 3)
    assert.equal(result[0].name, 'Happy')
    assert.equal(result[1].name, 'Sad')
    assert.equal(result[2].name, 'Exciting')
  })

  test('should return empty array when no tones exist', async ({ assert }) => {
    const toneRepository = new TestToneRepository([])
    const useCase = new GetAllTonesUseCase(toneRepository)

    const result = await useCase.execute()

    assert.lengthOf(result, 0)
  })
})
