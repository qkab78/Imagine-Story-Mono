import { IDateService } from '#stories/domain/services/i_date_service'

export class DateService implements IDateService {
  public now(): string {
    return new Date().toISOString()
  }
}
