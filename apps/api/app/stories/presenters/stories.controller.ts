import { GetStoryByIdUseCase } from "#stories/application/use-cases/GetStoryByIdUseCase"
import { getStoryByIdValidator } from "#stories/controllers/validators/get_story_by_id_validator"
import { inject } from "@adonisjs/core"
import { HttpContext } from "@adonisjs/core/http"

@inject()
export default class StoriesController {
    constructor(private readonly getStoryByIdUseCase: GetStoryByIdUseCase) {}

    async getStoryById({ request, response }: HttpContext) {
        const payload = await getStoryByIdValidator.validate(request.params())
        const story = await this.getStoryByIdUseCase.execute(payload.id)
        return response.json(story)
    }
}