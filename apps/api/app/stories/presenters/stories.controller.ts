import { GetStoryByIdUseCase } from '#stories/application/use-cases/get_story_by_id_use_case'
import { QueueStoryCreationUseCase } from '#stories/application/use-cases/queue_story_creation_use_case'
import { RetryStoryGenerationUseCase } from '#stories/application/use-cases/retry_story_generation_use_case'
import { GetStoryGenerationStatusUseCase } from '#stories/application/use-cases/get_story_generation_status_use_case'
import { GetStoryQuotaUseCase } from '#stories/application/use-cases/get_story_quota_use_case'
import { ListPublicStoriesUseCase } from '#stories/application/use-cases/story/list_public_stories_use_case'
import { GetLatestPublicStoriesUseCase } from '#stories/application/use-cases/story/get_latest_public_stories_use_case'
import { ListUserStoriesUseCase } from '#stories/application/use-cases/story/list_user_stories_use_case'
import { GetStoryBySlugUseCase } from '#stories/application/use-cases/story/get_story_by_slug_use_case'
import { SearchStoriesUseCase } from '#stories/application/use-cases/story/search_stories_use_case'
import { GetAllThemesUseCase } from '#stories/application/use-cases/metadata/get_all_themes_use_case'
import { GetAllTonesUseCase } from '#stories/application/use-cases/metadata/get_all_tones_use_case'
import { GetAllLanguagesUseCase } from '#stories/application/use-cases/metadata/get_all_languages_use_case'
import { StoryListItemPresenter } from '#stories/application/presenters/story_list_item_presenter'
import { StoryDetailPresenter } from '#stories/application/presenters/story_detail_presenter'
import { ThemePresenter } from '#stories/application/presenters/theme_presenter'
import { TonePresenter } from '#stories/application/presenters/tone_presenter'
import { LanguagePresenter } from '#stories/application/presenters/language_presenter'
import { IStorageService } from '#stories/domain/services/i_storage_service'
import { getStoryByIdValidator } from '#stories/application/validators/get_story_by_id_validator'
import { createStoryValidator } from '#stories/application/validators/create_story_validator'
import { getStoryBySlugValidator } from '#stories/application/validators/get_story_by_slug_validator'
import { searchStoriesValidator } from '#stories/application/validators/search_stories_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class StoriesController {
  constructor(
    private readonly getStoryByIdUseCase: GetStoryByIdUseCase,
    private readonly queueStoryCreationUseCase: QueueStoryCreationUseCase,
    private readonly retryStoryGenerationUseCase: RetryStoryGenerationUseCase,
    private readonly getStoryGenerationStatusUseCase: GetStoryGenerationStatusUseCase,
    private readonly getStoryQuotaUseCase: GetStoryQuotaUseCase,
    private readonly listPublicStoriesUseCase: ListPublicStoriesUseCase,
    private readonly getLatestPublicStoriesUseCase: GetLatestPublicStoriesUseCase,
    private readonly listUserStoriesUseCase: ListUserStoriesUseCase,
    private readonly getStoryBySlugUseCase: GetStoryBySlugUseCase,
    private readonly searchStoriesUseCase: SearchStoriesUseCase,
    private readonly getAllThemesUseCase: GetAllThemesUseCase,
    private readonly getAllTonesUseCase: GetAllTonesUseCase,
    private readonly getAllLanguagesUseCase: GetAllLanguagesUseCase,
    private readonly storageService: IStorageService
  ) {}

  async getStoryById({ request, response }: HttpContext) {
    const payload = await getStoryByIdValidator.validate(request.params())
    const story = await this.getStoryByIdUseCase.execute(payload.id)
    return response.json(story)
  }

  async createStory({ request, response, auth }: HttpContext) {
    // Validate request body
    const payload = await createStoryValidator.validate(request.body())

    // Get authenticated user (middleware already did auth)
    const user = auth.getUserOrFail()

    // Utiliser la queue pour générer l'histoire en arrière-plan
    const result = await this.queueStoryCreationUseCase.execute({
      synopsis: payload.synopsis || '',
      protagonist: payload.protagonist || '',
      childAge: payload.childAge || 5,
      species: payload.species || '',
      ownerId: String(user.id),
      userRole: Number(user.role),
      isPublic: !payload.isPrivate,
      themeId: payload.theme || '',
      languageId: payload.language || '',
      toneId: payload.tone || '',
      numberOfChapters: payload.numberOfChapters || 3,
      appearancePreset: payload.appearancePreset,
      illustrationStyle: payload.illustrationStyle,
    })

    return response.accepted({
      message: 'Story generation queued successfully',
      data: result,
    })
  }

  async retryStoryGeneration({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const result = await this.retryStoryGenerationUseCase.execute(
      params.id,
      String(user.id)
    )

    return response.accepted({
      message: 'Story generation retry queued successfully',
      data: result,
    })
  }

  async getGenerationStatus({ params, response }: HttpContext) {
    const status = await this.getStoryGenerationStatusUseCase.execute(params.id)

    return response.ok({
      data: status,
    })
  }

  async getPublicStories({ request, response }: HttpContext) {
    const { themeId, languageId, toneId, childAge, page, limit } = request.qs()

    const result = await this.listPublicStoriesUseCase.execute({
      themeId,
      languageId,
      toneId,
      childAge: childAge ? Number(childAge) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    })

    // Transform domain entities to DTOs
    const storiesDTO = await StoryListItemPresenter.toDTOs(result.stories, this.storageService)

    return response.ok({
      stories: storiesDTO,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    })
  }

  async getLatestPublicStories({ request, response }: HttpContext) {
    const { limit } = request.qs()

    const result = await this.getLatestPublicStoriesUseCase.execute({
      limit: limit ? Number(limit) : undefined,
    })

    // Transform domain entities to DTOs
    const storiesDTO = await StoryListItemPresenter.toDTOs(result.stories, this.storageService)

    return response.ok({
      stories: storiesDTO,
    })
  }

  async getUserStories({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const { page, limit } = request.qs()

    const result = await this.listUserStoriesUseCase.execute({
      ownerId: String(user.id),
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    })

    // Transform domain entities to DTOs
    const storiesDTO = await StoryListItemPresenter.toDTOs(result.stories, this.storageService)

    return response.ok({
      stories: storiesDTO,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    })
  }

  async getStoryQuota({ response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const quota = await this.getStoryQuotaUseCase.execute({
      userId: String(user.id),
      userRole: Number(user.role),
    })

    return response.ok({
      data: quota,
    })
  }

  async getThemes({ response }: HttpContext) {
    const themes = await this.getAllThemesUseCase.execute()
    return response.ok(ThemePresenter.toDTOs(themes))
  }

  async getTones({ response }: HttpContext) {
    const tones = await this.getAllTonesUseCase.execute()
    return response.ok(TonePresenter.toDTOs(tones))
  }

  async getLanguages({ response }: HttpContext) {
    const languages = await this.getAllLanguagesUseCase.execute()
    return response.ok(LanguagePresenter.toDTOs(languages))
  }

  async getStoryBySlug({ request, response }: HttpContext) {
    const payload = await getStoryBySlugValidator.validate(request.params())
    const story = await this.getStoryBySlugUseCase.execute(payload.slug)

    if (!story) {
      return response.notFound({ error: 'Story not found' })
    }

    const storyDTO = await StoryDetailPresenter.toDTO(story, this.storageService)
    return response.ok(storyDTO)
  }

  async searchStories({ request, response }: HttpContext) {
    const payload = await searchStoriesValidator.validate(request.qs())
    const stories = await this.searchStoriesUseCase.execute({
      query: payload.query,
      limit: payload.limit,
    })
    const storiesDTO = await StoryListItemPresenter.toDTOs(stories, this.storageService)
    return response.ok({ stories: storiesDTO })
  }
}
