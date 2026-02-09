import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import queue from '@rlanz/bull-queue/services/main'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { IThemeRepository } from '#stories/domain/repositories/theme_repository'
import { ILanguageRepository } from '#stories/domain/repositories/language_repository'
import { IToneRepository } from '#stories/domain/repositories/tone_repository'
import { StoryFactory } from '#stories/domain/factories/story_factory'
import { IDateService } from '#stories/domain/services/i_date_service'
import { IRandomService } from '#stories/domain/services/i_random_service'
import GenerateStoryJob from '#jobs/story/generate_story_job'
import { ThemeId } from '#stories/domain/value-objects/ids/theme_id.vo'
import { LanguageId } from '#stories/domain/value-objects/ids/language_id.vo'
import { ToneId } from '#stories/domain/value-objects/ids/tone_id.vo'
import { GetStoryQuotaUseCase } from './get_story_quota_use_case.js'
import { StoryQuotaExceededException } from '#stories/application/exceptions/index'

export interface QueueStoryCreationPayload {
  synopsis: string
  protagonist: string
  childAge: number
  species: string
  ownerId: string
  userRole: number
  isPublic: boolean
  themeId: string
  languageId: string
  toneId: string
  numberOfChapters: number
  appearancePreset?: string
  illustrationStyle?: string
}

@inject()
export class QueueStoryCreationUseCase {
  constructor(
    private readonly storyRepository: IStoryRepository,
    private readonly themeRepository: IThemeRepository,
    private readonly languageRepository: ILanguageRepository,
    private readonly toneRepository: IToneRepository,
    private readonly dateService: IDateService,
    private readonly randomService: IRandomService,
    private readonly getStoryQuotaUseCase: GetStoryQuotaUseCase
  ) {}

  async execute(payload: QueueStoryCreationPayload) {
    logger.info('📝 Checking story quota...')

    // Check quota before creating story
    const quota = await this.getStoryQuotaUseCase.execute({
      userId: payload.ownerId,
      userRole: payload.userRole,
    })

    if (!quota.canCreate) {
      logger.warn(`❌ Story quota exceeded for user: ${payload.ownerId}`)
      throw new StoryQuotaExceededException(
        payload.ownerId,
        quota.storiesCreatedThisMonth,
        quota.limit!,
        quota.resetDate!
      )
    }

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
      appearancePreset: payload.appearancePreset,
      illustrationStyle: payload.illustrationStyle,
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
