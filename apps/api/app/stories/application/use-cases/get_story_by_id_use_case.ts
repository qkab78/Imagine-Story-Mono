import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { IStorageService } from '#stories/domain/services/i_storage_service'
import { StoryDetailPresenter } from '#stories/application/presenters/story_detail_presenter'
import type { StoryDetailDTO } from '#stories/application/dtos/story_d_t_o'
import { inject } from '@adonisjs/core'

@inject()
export class GetStoryByIdUseCase {
  constructor(
    private readonly storyRepository: IStoryRepository,
    private readonly storageService: IStorageService
  ) {}

  async execute(id: string): Promise<StoryDetailDTO> {
    const story = await this.storyRepository.findById(id)

    if (!story) {
      throw new Error('Story not found')
    }

    return StoryDetailPresenter.toDTO(story, this.storageService)
  }
}
