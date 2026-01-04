import { GetStoryByIdUseCase } from "#stories/application/use-cases/GetStoryByIdUseCase"
import { QueueStoryCreationUseCase } from "#stories/application/use-cases/QueueStoryCreationUseCase"
import { GetStoryGenerationStatusUseCase } from "#stories/application/use-cases/GetStoryGenerationStatusUseCase"
import { getStoryByIdValidator } from "#stories/controllers/validators/get_story_by_id_validator"
import { createStoryValidator } from "#stories/controllers/validators/create_story_validator"
import { inject } from "@adonisjs/core"
import { HttpContext } from "@adonisjs/core/http"

@inject()
export default class StoriesController {
    constructor(
        private readonly getStoryByIdUseCase: GetStoryByIdUseCase,
        private readonly queueStoryCreationUseCase: QueueStoryCreationUseCase,
        private readonly getStoryGenerationStatusUseCase: GetStoryGenerationStatusUseCase
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
}