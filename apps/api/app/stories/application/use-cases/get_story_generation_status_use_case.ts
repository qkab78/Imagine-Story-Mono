import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { Queue } from 'bullmq'
import env from '#start/env'

@inject()
export class GetStoryGenerationStatusUseCase {
  private queue: Queue

  constructor(private readonly storyRepository: IStoryRepository) {
    const redisPassword = env.get('QUEUE_REDIS_PASSWORD')
    this.queue = new Queue('default', {
      connection: {
        host: env.get('QUEUE_REDIS_HOST'),
        port: env.get('QUEUE_REDIS_PORT'),
        ...(redisPassword && { password: redisPassword }),
      },
    })
  }

  async execute(storyId: string) {
    const story = await this.storyRepository.findById(storyId)
    if (!story) {
      throw new Error('Story not found')
    }

    // Read progress from BullMQ job if processing
    let progressPercentage = 0
    if (story.generationStatus.isProcessing() && story.jobId) {
      try {
        const job = await this.queue.getJob(story.jobId)
        if (job) {
          progressPercentage = typeof job.progress === 'number' ? job.progress : 0
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
