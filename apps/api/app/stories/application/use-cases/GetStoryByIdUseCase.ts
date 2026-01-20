import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import { IStorageService } from '#stories/domain/services/IStorageService'
import { StoryDetailPresenter } from '#stories/application/presenters/StoryDetailPresenter'
import type { StoryDetailDTO } from '#stories/application/dtos/StoryDTO'
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
