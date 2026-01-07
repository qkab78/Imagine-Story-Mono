import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import queue from '@rlanz/bull-queue/services/main'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import { IThemeRepository } from '#stories/domain/repositories/ThemeRepository'
import { ILanguageRepository } from '#stories/domain/repositories/LanguageRepository'
import { IToneRepository } from '#stories/domain/repositories/ToneRepository'
import { StoryFactory } from '#stories/domain/factories/StoryFactory'
import { IDateService } from '#stories/domain/services/IDateService'
import { IRandomService } from '#stories/domain/services/IRandomService'
import GenerateStoryJob from '#jobs/story/generate_story_job'
import { ThemeId } from '#stories/domain/value-objects/ids/ThemeId.vo'
import { LanguageId } from '#stories/domain/value-objects/ids/LanguageId.vo'
import { ToneId } from '#stories/domain/value-objects/ids/ToneId.vo'

export interface QueueStoryCreationPayload {
  synopsis: string
  protagonist: string
  childAge: number
  species: string
  ownerId: string
  isPublic: boolean
  themeId: string
  languageId: string
  toneId: string
  numberOfChapters: number
}

@inject()
export class QueueStoryCreationUseCase {
  constructor(
    private readonly storyRepository: IStoryRepository,
    private readonly themeRepository: IThemeRepository,
    private readonly languageRepository: ILanguageRepository,
    private readonly toneRepository: IToneRepository,
    private readonly dateService: IDateService,
    private readonly randomService: IRandomService
  ) {}

  async execute(payload: QueueStoryCreationPayload) {
    logger.info('📝 Queuing story creation...')

    // 1. Récupérer les entités de configuration
    const [theme, language, tone] = await Promise.all([
      this.themeRepository.findById(ThemeId.create(payload.themeId)),
      this.languageRepository.findById(LanguageId.create(payload.languageId)),
      this.toneRepository.findById(ToneId.create(payload.toneId)),
    ])

    if (!theme || !language || !tone) {
      throw new Error('Theme, language or tone not found')
    }

    // Create a temporary title with the current date and time
    const temporaryTitle = `Story ${this.dateService.now().toString()}`

    logger.info(`📝 Temporary title: ${temporaryTitle}`)

    // 2. Créer une Story avec status="pending"
    const story = StoryFactory.createPending(this.dateService, this.randomService, {
      title: temporaryTitle,
      synopsis: payload.synopsis,
      protagonist: payload.protagonist,
      childAge: payload.childAge,
      species: payload.species,
      ownerId: payload.ownerId,
      isPublic: payload.isPublic,
      theme,
      language,
      tone,
      isGenerated: false,
    })

    // 3. Persister la story
    await this.storyRepository.create(story)

    // 4. Dispatcher le job de génération
    const job = await queue.dispatch(GenerateStoryJob, {
      storyId: story.id.getValue(),
      synopsis: story.synopsis,
      protagonist: story.protagonist,
      childAge: story.childAge.getValue(),
      species: story.species,
      themeId: theme.id.getValue(),
      languageId: language.id.getValue(),
      toneId: tone.id.getValue(),
      numberOfChapters: payload.numberOfChapters,
    })

    if (!job.id) {
      story.failGeneration('Failed to dispatch job')
      await this.storyRepository.save(story)
      throw new Error('Failed to dispatch job')
    }

    // 5. Mettre à jour le jobId
    story.startGeneration(job.id)
    await this.storyRepository.save(story)

    logger.info(`✅ Story queued: ${story.id.getValue()}, Job ID: ${job.id}`)

    return {
      id: story.id.getValue(),
      jobId: job.id,
      status: story.generationStatus.getValue(),
    }
  }
}
