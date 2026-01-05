import { Job } from '@rlanz/bull-queue'
import app from '@adonisjs/core/services/app'
import { GenerateStoryContentUseCase } from '#stories/application/use-cases/GenerateStoryContentUseCase'
import { IThemeRepository } from '#stories/domain/repositories/ThemeRepository'
import { ILanguageRepository } from '#stories/domain/repositories/LanguageRepository'
import { IToneRepository } from '#stories/domain/repositories/ToneRepository'
import { ThemeId } from '#stories/domain/value-objects/ids/ThemeId.vo'
import { LanguageId } from '#stories/domain/value-objects/ids/LanguageId.vo'
import { ToneId } from '#stories/domain/value-objects/ids/ToneId.vo'

export interface GenerateStoryJobPayload {
  storyId: string
  synopsis: string
  protagonist: string
  childAge: number
  species: string
  themeId: string
  languageId: string
  toneId: string
  numberOfChapters: number
}

export default class GenerateStoryJob extends Job {
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Configuration du job
   */
  static get options() {
    return {
      attempts: 3, // 3 tentatives
      backoff: {
        type: 'exponential', // Backoff exponentiel
        delay: 5000, // 5s, 25s, 125s
      },
      removeOnComplete: 50, // Garde 50 jobs complétés
      removeOnFail: 50, // Garde 50 jobs échoués
    }
  }

  /**
   * Traite le job de génération d'histoire
   */
  async handle(payload: GenerateStoryJobPayload) {
    console.log(`🎬 Starting story generation job for story: ${payload.storyId}`)

    const startTime = Date.now()

    try {
      // Récupérer les repositories depuis le container
      const themeRepository = await app.container.make(IThemeRepository)
      const languageRepository = await app.container.make(ILanguageRepository)
      const toneRepository = await app.container.make(IToneRepository)

      // Résoudre les noms des entités
      const [theme, language, tone] = await Promise.all([
        themeRepository.findById(ThemeId.create(payload.themeId)),
        languageRepository.findById(LanguageId.create(payload.languageId)),
        toneRepository.findById(ToneId.create(payload.toneId)),
      ])

      if (!theme || !language || !tone) {
        throw new Error('Related entities (theme, language, tone) not found')
      }

      // Récupérer le use case depuis le container
      const generateStoryContentUseCase = await app.container.make(GenerateStoryContentUseCase)

      // Exécuter la génération
      await generateStoryContentUseCase.execute({
        storyId: payload.storyId,
        synopsis: payload.synopsis,
        theme: theme.name,
        protagonist: payload.protagonist,
        childAge: payload.childAge,
        numberOfChapters: payload.numberOfChapters,
        language: language.name,
        tone: tone.name,
        species: payload.species,
      })

      const endTime = Date.now()
      const duration = ((endTime - startTime) / 1000).toFixed(2)

      console.log(
        `✅ Story generation completed in ${duration}s for story: ${payload.storyId}`
      )
    } catch (error: any) {
      console.error(`❌ Story generation failed for story ${payload.storyId}:`, error.message)
      throw error // Will trigger rescue() after retries exhausted
    }
  }

  /**
   * Appelé quand toutes les tentatives ont échoué
   */
  async rescue(payload: GenerateStoryJobPayload, error: Error) {
    console.error(
      `💀 Story generation permanently failed for story ${payload.storyId} after all retries:`,
      error.message
    )

    // Le use case a déjà marqué la story comme "failed"
    // On pourrait envoyer une notification à l'utilisateur ici
  }
}
