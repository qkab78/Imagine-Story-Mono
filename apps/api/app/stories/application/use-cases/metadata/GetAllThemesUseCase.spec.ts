import { test } from '@japa/runner'
import { GetAllThemesUseCase } from './GetAllThemesUseCase.js'
import { IThemeRepository } from '#stories/domain/repositories/ThemeRepository'
import { Theme } from '#stories/domain/value-objects/settings/Theme.vo'
import { ThemeId } from '#stories/domain/value-objects/ids/ThemeId.vo'

test.group(GetAllThemesUseCase.name, () => {
  class TestThemeRepository implements IThemeRepository {
    private readonly themes: Theme[] = []

    constructor(themes: Theme[] = []) {
      this.themes = themes
    }

    findById(_id: ThemeId): Promise<Theme | null> {
      throw new Error('Method not implemented.')
    }

    findAll(): Promise<Theme[]> {
      return Promise.resolve(this.themes)
    }
  }

  test('should return all themes', async ({ assert }) => {
    const themes = [
      Theme.create('123e4567-e89b-12d3-a456-426614174001', 'Adventure', 'An adventure theme'),
      Theme.create('123e4567-e89b-12d3-a456-426614174002', 'Fantasy', 'A fantasy theme'),
      Theme.create('123e4567-e89b-12d3-a456-426614174003', 'Science Fiction', 'A sci-fi theme'),
    ]

    const themeRepository = new TestThemeRepository(themes)
    const useCase = new GetAllThemesUseCase(themeRepository)

    const result = await useCase.execute()

    assert.lengthOf(result, 3)
    assert.equal(result[0].name, 'Adventure')
    assert.equal(result[1].name, 'Fantasy')
    assert.equal(result[2].name, 'Science Fiction')
  })

  test('should return empty array when no themes exist', async ({ assert }) => {
    const themeRepository = new TestThemeRepository([])
    const useCase = new GetAllThemesUseCase(themeRepository)

    const result = await useCase.execute()

    assert.lengthOf(result, 0)
  })
})
