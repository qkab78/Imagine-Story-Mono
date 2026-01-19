import { GetStoryByIdUseCase } from "#stories/application/use-cases/GetStoryByIdUseCase"
import { QueueStoryCreationUseCase } from "#stories/application/use-cases/QueueStoryCreationUseCase"
import { GetStoryGenerationStatusUseCase } from "#stories/application/use-cases/GetStoryGenerationStatusUseCase"
import { GetStoryQuotaUseCase } from "#stories/application/use-cases/GetStoryQuotaUseCase"
import { ListPublicStoriesUseCase } from "#stories/application/use-cases/story/ListPublicStoriesUseCase"
import { GetLatestPublicStoriesUseCase } from "#stories/application/use-cases/story/GetLatestPublicStoriesUseCase"
import { ListUserStoriesUseCase } from "#stories/application/use-cases/story/ListUserStoriesUseCase"
import { GetStoryBySlugUseCase } from "#stories/application/use-cases/story/GetStoryBySlugUseCase"
import { SearchStoriesUseCase } from "#stories/application/use-cases/story/SearchStoriesUseCase"
import { GetAllThemesUseCase } from "#stories/application/use-cases/metadata/GetAllThemesUseCase"
import { GetAllTonesUseCase } from "#stories/application/use-cases/metadata/GetAllTonesUseCase"
import { GetAllLanguagesUseCase } from "#stories/application/use-cases/metadata/GetAllLanguagesUseCase"
import { StoryListItemPresenter } from "#stories/application/presenters/StoryListItemPresenter"
import { StoryDetailPresenter } from "#stories/application/presenters/StoryDetailPresenter"
import { ThemePresenter } from "#stories/application/presenters/ThemePresenter"
import { TonePresenter } from "#stories/application/presenters/TonePresenter"
import { LanguagePresenter } from "#stories/application/presenters/LanguagePresenter"
import { IStorageService } from "#stories/domain/services/IStorageService"
import { getStoryByIdValidator } from "#stories/controllers/validators/get_story_by_id_validator"
import { createStoryValidator } from "#stories/controllers/validators/create_story_validator"
import { getStoryBySlugValidator } from "#stories/application/validators/get_story_by_slug_validator"
import { searchStoriesValidator } from "#stories/application/validators/search_stories_validator"
import { inject } from "@adonisjs/core"
import { HttpContext } from "@adonisjs/core/http"

@inject()
export default class StoriesController {
    constructor(
        private readonly getStoryByIdUseCase: GetStoryByIdUseCase,
        private readonly queueStoryCreationUseCase: QueueStoryCreationUseCase,
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
        })

        return response.accepted({
            message: 'Story generation queued successfully',
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