import { IDateService } from '#stories/domain/services/IDateService'

export class DateService implements IDateService {
  public now(): string {
    return new Date().toISOString()
  }
}
