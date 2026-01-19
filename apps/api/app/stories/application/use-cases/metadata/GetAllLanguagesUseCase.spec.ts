import { test } from '@japa/runner'
import { GetAllLanguagesUseCase } from './GetAllLanguagesUseCase.js'
import { ILanguageRepository } from '#stories/domain/repositories/LanguageRepository'
import { Language } from '#stories/domain/value-objects/settings/Language.vo'
import { LanguageId } from '#stories/domain/value-objects/ids/LanguageId.vo'

test.group(GetAllLanguagesUseCase.name, () => {
  class TestLanguageRepository implements ILanguageRepository {
    private readonly languages: Language[] = []

    constructor(languages: Language[] = []) {
      this.languages = languages
    }

    findById(_id: LanguageId): Promise<Language | null> {
      throw new Error('Method not implemented.')
    }

    findAll(): Promise<Language[]> {
      return Promise.resolve(this.languages)
    }
  }

  test('should return all languages', async ({ assert }) => {
    const languages = [
      Language.create('123e4567-e89b-12d3-a456-426614174001', 'English', 'en', true),
      Language.create('123e4567-e89b-12d3-a456-426614174002', 'French', 'fr', true),
      Language.create('123e4567-e89b-12d3-a456-426614174003', 'Spanish', 'es', false),
    ]

    const languageRepository = new TestLanguageRepository(languages)
    const useCase = new GetAllLanguagesUseCase(languageRepository)

    const result = await useCase.execute()

    assert.lengthOf(result, 3)
    assert.equal(result[0].name, 'English')
    assert.equal(result[0].code, 'en')
    assert.isTrue(result[0].isFree)
    assert.equal(result[1].name, 'French')
    assert.equal(result[2].name, 'Spanish')
    assert.isFalse(result[2].isFree)
  })

  test('should return empty array when no languages exist', async ({ assert }) => {
    const languageRepository = new TestLanguageRepository([])
    const useCase = new GetAllLanguagesUseCase(languageRepository)

    const result = await useCase.execute()

    assert.lengthOf(result, 0)
  })
})
