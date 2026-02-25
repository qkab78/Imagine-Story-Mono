import { GetStoryOfTheDayUseCase } from '#stories/application/use-cases/widget/get_story_of_the_day_use_case'
import { StoryListItemPresenter } from '#stories/application/presenters/story_list_item_presenter'
import { IStorageService } from '#stories/domain/services/i_storage_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WidgetController {
  constructor(
    private readonly getStoryOfTheDayUseCase: GetStoryOfTheDayUseCase,
    private readonly storageService: IStorageService
  ) {}

  async getStoryOfTheDay({ response }: HttpContext) {
    const story = await this.getStoryOfTheDayUseCase.execute()

    if (!story) {
      return response.notFound({ error: 'No story of the day available' })
    }

    const storyDTO = await StoryListItemPresenter.toDTO(story, this.storageService)
    return response.ok({ story: storyDTO })
  }
}
