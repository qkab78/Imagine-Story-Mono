import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import queue from '@rlanz/bull-queue/services/main'

@inject()
export class GetStoryGenerationStatusUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(storyId: string) {
    const story = await this.storyRepository.findById(storyId)
    if (!story) {
      throw new Error('Story not found')
    }

    // Read progress from BullMQ job if processing
    let progressPercentage = 0
    if (story.generationStatus.isProcessing() && story.jobId) {
      try {
        const bullQueue = queue.get('default')
        if (bullQueue) {
          const job = await bullQueue.getJob(story.jobId)
          if (job) {
            progressPercentage = typeof job.progress === 'number' ? job.progress : 0
          }
        }
      } catch {
        progressPercentage = 0
      }
    } else if (story.generationStatus.isCompleted()) {
      progressPercentage = 100
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
      progressPercentage,
    }
  }
}
