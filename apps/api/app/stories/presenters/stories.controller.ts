import { GetStoryByIdUseCase } from "#stories/application/use-cases/GetStoryByIdUseCase"
import { CreateStoryUseCase } from "#stories/application/use-cases/CreateStoryUseCase"
import { getStoryByIdValidator } from "#stories/controllers/validators/get_story_by_id_validator"
import { createStoryValidator } from "#stories/controllers/validators/create_story_validator"
import { inject } from "@adonisjs/core"
import { HttpContext } from "@adonisjs/core/http"

@inject()
export default class StoriesController {
    constructor(
        private readonly getStoryByIdUseCase: GetStoryByIdUseCase,
        private readonly createStoryUseCase: CreateStoryUseCase
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

        // Execute use case with complete payload
        const story = await this.createStoryUseCase.execute({
            title: payload.title || 'Untitled Story',
            synopsis: payload.synopsis || '',
            theme: payload.theme || '',
            protagonist: payload.protagonist || '',
            childAge: payload.childAge || 5,
            numberOfChapters: payload.numberOfChapters || 1,
            language: payload.language || '',
            tone: payload.tone || '',
            species: payload.species || '',
            conclusion: '',
            coverImageUrl: '',
            ownerId: String(user.id),
            isPublic: !payload.isPrivate,
        })

        return response.created(story)
    }
}