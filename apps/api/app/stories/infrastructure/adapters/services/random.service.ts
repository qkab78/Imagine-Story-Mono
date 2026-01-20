import { IRandomService } from '#stories/domain/services/i_random_service'
import { randomUUID } from 'node:crypto'

export class RandomService implements IRandomService {
  public generateRandomUuid(): string {
    return randomUUID()
  }
}
