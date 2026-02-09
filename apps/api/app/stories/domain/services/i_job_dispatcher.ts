export interface DispatchedJob {
  id: string | undefined
}

export abstract class IJobDispatcher {
  abstract dispatch<T>(jobClass: any, payload: T): Promise<DispatchedJob>
}
