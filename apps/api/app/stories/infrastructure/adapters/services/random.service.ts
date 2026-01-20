import { IRandomService } from '#stories/domain/services/IRandomService'
import { randomUUID } from 'node:crypto'

export class RandomService implements IRandomService {
  public generateRandomUuid(): string {
    return randomUUID()
  }
}
