import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'

@inject()
export class GetStoryGenerationStatusUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(storyId: string) {
    const story = await this.storyRepository.findById(storyId)
    if (!story) {
      throw new Error('Story not found')
    }

    return {
      id: story.id.getValue(),
      status: story.generationStatus.getValue(),
      jobId: story.jobId,
      startedAt: story.generationStartedAt,
      completedAt: story.generationCompletedAt,
      error: story.generationError,
      isCompleted: story.generationStatus.isCompleted(),
      isFailed: story.generationStatus.isFailed(),
      isPending: story.generationStatus.isPending(),
      isProcessing: story.generationStatus.isProcessing(),
    }
  }
}
