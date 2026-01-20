import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { IDateService } from '#stories/domain/services/i_date_service'
import { IRandomService } from '#stories/domain/services/i_random_service'
import { IStoryGenerationService } from '#stories/domain/services/i_story_generation'
import { IThemeRepository } from '#stories/domain/repositories/theme_repository'
import { ILanguageRepository } from '#stories/domain/repositories/language_repository'
import { IToneRepository } from '#stories/domain/repositories/tone_repository'
import { IDomainEventPublisher } from '#stories/domain/events/i_domain_event_publisher'
import { StoryFactory } from '#stories/domain/factories/story_factory'
import { StoryCreatedEvent } from '#stories/domain/events/story_created_event'
import { ThemeId } from '#stories/domain/value-objects/ids/theme_id.vo'
import { LanguageId } from '#stories/domain/value-objects/ids/language_id.vo'
import { ToneId } from '#stories/domain/value-objects/ids/tone_id.vo'
import { GenerationStatus } from '#stories/domain/value-objects/metadata/generation_status.vo'

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
  ) {}

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
      status: GenerationStatus.processing(),
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
