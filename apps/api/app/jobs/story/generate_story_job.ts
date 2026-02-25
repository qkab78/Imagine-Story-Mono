import { Job } from '@rlanz/bull-queue'
import logger from '@adonisjs/core/services/logger'
import app from '@adonisjs/core/services/app'
import queue from '@rlanz/bull-queue/services/main'
import { GenerateStoryContentUseCase } from '#stories/application/use-cases/generate_story_content_use_case'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { IUserRepository } from '#users/domain/repositories/user_repository'
import { IThemeRepository } from '#stories/domain/repositories/theme_repository'
import { ILanguageRepository } from '#stories/domain/repositories/language_repository'
import { IToneRepository } from '#stories/domain/repositories/tone_repository'
import { ThemeId } from '#stories/domain/value-objects/ids/theme_id.vo'
import { LanguageId } from '#stories/domain/value-objects/ids/language_id.vo'
import { ToneId } from '#stories/domain/value-objects/ids/tone_id.vo'
import SendStoryGenerationFailedEmailJob from '#jobs/story/send_story_generation_failed_email_job'

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
  appearancePreset?: string
  illustrationStyle?: string
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
    logger.debug(`Starting story generation job for story: ${payload.storyId}`)

    const startTime = Date.now()

    try {
      const bullJob = this.getJob()
      const onProgress = async (progress: number) => {
        await bullJob.updateProgress(progress)
      }

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
        languageCode: language.code,
        tone: tone.name,
        species: payload.species,
        appearancePreset: payload.appearancePreset,
        illustrationStyle: payload.illustrationStyle,
        onProgress,
      })

      const endTime = Date.now()
      const duration = ((endTime - startTime) / 1000).toFixed(2)

      logger.debug(`Story generation completed in ${duration}s for story: ${payload.storyId}`)
    } catch (error: any) {
      logger.error({ err: error }, `Story generation failed for story ${payload.storyId}`)
      throw error // Will trigger rescue() after retries exhausted
    }
  }

  /**
   * Appelé quand toutes les tentatives ont échoué
   */
  async rescue(payload: GenerateStoryJobPayload, error: Error) {
    logger.error(
      { err: error },
      `Story generation permanently failed for story ${payload.storyId} after all retries`
    )

    try {
      const storyRepository = await app.container.make(IStoryRepository)
      const userRepository = await app.container.make(IUserRepository)

      const story = await storyRepository.findById(payload.storyId)
      if (!story) {
        logger.error(`Story not found: ${payload.storyId}`)
        return
      }

      // Marquer la story comme failed
      if (story.generationStatus.isProcessing()) {
        story.failGeneration(error.message)
        await storyRepository.save(story)
      }

      // Envoyer l'email d'échec
      const user = await userRepository.findById(story.ownerId.getValue())
      if (user) {
        const userFriendlyError = this.simplifyErrorMessage(error.message)
        await queue.dispatch(SendStoryGenerationFailedEmailJob, {
          recipientEmail: user.email.getValue(),
          recipientName: user.getFullName(),
          storyId: story.id.getValue(),
          errorMessage: userFriendlyError,
        })
      }
    } catch (rescueError: any) {
      logger.error({ err: rescueError }, `Failed to handle rescue for story ${payload.storyId}`)
    }
  }

  /**
   * Simplify technical error messages for end users
   */
  private simplifyErrorMessage(technicalError: string): string {
    if (technicalError.includes('quota') || technicalError.includes('rate limit')) {
      return 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.'
    }

    if (technicalError.includes('timeout') || technicalError.includes('timed out')) {
      return 'Le serveur a mis trop de temps à répondre. Veuillez réessayer.'
    }

    if (technicalError.includes('API') || technicalError.includes('OpenAI')) {
      return 'Service de génération temporairement indisponible. Veuillez réessayer.'
    }

    return 'Une erreur technique est survenue. Notre équipe a été notifiée.'
  }
}
