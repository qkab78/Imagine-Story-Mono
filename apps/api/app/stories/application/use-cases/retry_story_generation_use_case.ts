import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { IThemeRepository } from '#stories/domain/repositories/theme_repository'
import { ILanguageRepository } from '#stories/domain/repositories/language_repository'
import { IToneRepository } from '#stories/domain/repositories/tone_repository'
import { IJobDispatcher } from '#stories/domain/services/i_job_dispatcher'
import { IDomainEventPublisher } from '#stories/domain/events/i_domain_event_publisher'
import { StoryGenerationRetriedEvent } from '#stories/domain/events/story_generation_retried_event'
import GenerateStoryJob from '#jobs/story/generate_story_job'

@inject()
export class RetryStoryGenerationUseCase {
  constructor(
    private readonly storyRepository: IStoryRepository,
    private readonly themeRepository: IThemeRepository,
    private readonly languageRepository: ILanguageRepository,
    private readonly toneRepository: IToneRepository,
    private readonly jobDispatcher: IJobDispatcher,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(storyId: string, userId: string) {
    logger.info(`🔄 Retrying story generation for: ${storyId}`)

    // 1. Récupérer la story
    const story = await this.storyRepository.findById(storyId)
    if (!story) {
      throw new Error('Story not found')
    }

    // 2. Vérifier que l'utilisateur est le propriétaire
    if (story.ownerId.getValue() !== userId) {
      throw new Error('Unauthorized: you are not the owner of this story')
    }

    // 3. Vérifier que le statut permet le retry
    if (!story.canRetryGeneration()) {
      throw new Error(`Cannot retry: story status is ${story.generationStatus.getValue()}, expected failed`)
    }

    // 4. Transition failed -> pending
    story.retryGeneration()
    await this.storyRepository.save(story)

    // 5. Récupérer les entités de configuration pour le job
    const [theme, language, tone] = await Promise.all([
      this.themeRepository.findById(story.theme.id),
      this.languageRepository.findById(story.language.id),
      this.toneRepository.findById(story.tone.id),
    ])

    if (!theme || !language || !tone) {
      throw new Error('Theme, language or tone not found')
    }

    // 6. Re-dispatcher le job de génération
    const job = await this.jobDispatcher.dispatch(GenerateStoryJob, {
      storyId: story.id.getValue(),
      synopsis: story.synopsis,
      protagonist: story.protagonist,
      childAge: story.childAge.getValue(),
      species: story.species,
      themeId: theme.id.getValue(),
      languageId: language.id.getValue(),
      toneId: tone.id.getValue(),
      numberOfChapters: 3, // Valeur par défaut - non stockée sur l'entité
    })

    if (!job.id) {
      throw new Error('Failed to dispatch retry job')
    }

    // 7. Transition pending -> processing
    story.startGeneration(job.id)
    await this.storyRepository.save(story)

    // 8. Publier l'événement de retry
    await this.eventPublisher.publish(
      StoryGenerationRetriedEvent.create(story.id, story.ownerId, job.id)
    )

    logger.info(`✅ Story retry queued: ${storyId}, Job ID: ${job.id}`)

    return {
      id: story.id.getValue(),
      jobId: job.id,
      status: story.generationStatus.getValue(),
    }
  }
}
