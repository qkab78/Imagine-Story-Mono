import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import { IDateService } from '#stories/domain/services/IDateService'
import { IRandomService } from '#stories/domain/services/IRandomService'
import { IStoryGenerationService } from '#stories/domain/services/IStoryGeneration'
import { IThemeRepository } from '#stories/domain/repositories/ThemeRepository'
import { ILanguageRepository } from '#stories/domain/repositories/LanguageRepository'
import { IToneRepository } from '#stories/domain/repositories/ToneRepository'
import { IDomainEventPublisher } from '#stories/domain/events/IDomainEventPublisher'
import { StoryFactory } from '#stories/domain/factories/StoryFactory'
import { StoryCreatedEvent } from '#stories/domain/events/StoryCreatedEvent'
import { ThemeId } from '#stories/domain/value-objects/ids/ThemeId.vo'
import { LanguageId } from '#stories/domain/value-objects/ids/LanguageId.vo'
import { ToneId } from '#stories/domain/value-objects/ids/ToneId.vo'

/**
 * Payload for creating a new story
 */
export interface CreateStoryPayload {
  title: string
  synopsis: string
  theme: string
  protagonist: string
  childAge: number
  numberOfChapters: number
  language: string
  tone: string
  species: string
  conclusion: string
  coverImageUrl: string
  ownerId: string
  isPublic: boolean
}

/**
 * DTO returned after story creation
 */
export interface CreateStoryDTO {
  id: string
  slug: string
  title: string
  createdAt: Date
}

/**
 * Create Story Use Case
 *
 * Orchestrates the creation of a new story:
 * 1. Generates story content via AI service
 * 2. Fetches theme, language, and tone settings
 * 3. Creates story entity with chapters
 * 4. Persists to repository
 * 5. Publishes StoryCreatedEvent
 */
@inject()
export class CreateStoryUseCase {
  constructor(
    private readonly storyRepository: IStoryRepository,
    private readonly dateService: IDateService,
    private readonly randomService: IRandomService,
    private readonly storyGenerationService: IStoryGenerationService,
    private readonly themeRepository: IThemeRepository,
    private readonly languageRepository: ILanguageRepository,
    private readonly toneRepository: IToneRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) { }

  async execute(payload: CreateStoryPayload): Promise<CreateStoryDTO> {
    // 1. Fetch settings (theme, language, tone)
    const [theme, language, tone] = await Promise.all([
      this.themeRepository.findById(ThemeId.create(payload.theme)),
      this.languageRepository.findById(LanguageId.create(payload.language)),
      this.toneRepository.findById(ToneId.create(payload.tone)),
    ])

    if (!theme || !language || !tone) {
      throw new Error('Theme, language or tone not found')
    }
    // 2. Generate story content via AI
    const generatedStory = await this.storyGenerationService.generateStory({
      ...payload,
      theme: theme.name,
      language: language.name,
      tone: tone.name,
    })

    // 3. Validate generated chapters
    if (generatedStory.chapters.length !== generatedStory.numberOfChapters) {
      throw new Error(
        `Expected ${generatedStory.numberOfChapters} chapters but received ${generatedStory.chapters.length}`
      )
    }

    // 4. Create story entity using factory (chapters are already entities from AI service)
    const story = StoryFactory.create(this.dateService, this.randomService, {
      title: generatedStory.title,
      synopsis: generatedStory.synopsis,
      protagonist: generatedStory.protagonist,
      childAge: generatedStory.childAge,
      species: generatedStory.species,
      conclusion: generatedStory.conclusion,
      coverImageUrl: generatedStory.coverImageUrl,
      ownerId: generatedStory.ownerId,
      isPublic: generatedStory.isPublic,
      theme,
      language,
      tone,
      chapters: generatedStory.chapters,
    })

    // 5. Persist story
    await this.storyRepository.create(story)

    // 6. Publish domain event
    await this.eventPublisher.publish(
      StoryCreatedEvent.create(story.id, story.ownerId, story.slug, story.title)
    )

    // 7. Return DTO
    return {
      id: story.id.getValue(),
      slug: story.slug.getValue(),
      title: story.title,
      createdAt: story.publicationDate.getValue(),
    }
  }
}