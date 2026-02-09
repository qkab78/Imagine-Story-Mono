import queue from '@rlanz/bull-queue/services/main'
import { IJobDispatcher } from '#stories/domain/services/i_job_dispatcher'
import type { DispatchedJob } from '#stories/domain/services/i_job_dispatcher'

export class BullJobDispatcher extends IJobDispatcher {
  async dispatch<T>(jobClass: any, payload: T): Promise<DispatchedJob> {
    const job = await queue.dispatch(jobClass, payload)
    return { id: job.id }
  }
}
