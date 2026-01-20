import { ValueObject } from '../base/ValueObject.js'
import { InvalidValueObjectException } from '#stories/domain/exceptions/InvalidValueObjectException'
import { IRandomService } from '#stories/domain/services/IRandomService'

/**
 * Story unique identifier value object
 *
 * Represents a unique identifier for a Story aggregate.
 * Uses UUID v4 format for uniqueness guarantees.
 */
export class StoryId extends ValueObject<string> {
  protected readonly value: string

  private constructor(id: string) {
    super()
    if (!this.isValidUUID(id)) {
      throw new InvalidValueObjectException(`Invalid Story ID format: ${id}. Must be a valid UUID.`)
    }
    this.value = id
  }

  /**
   * Create a StoryId from an existing UUID string
   * @param id UUID string
   * @returns StoryId instance
   */
  public static create(id: string): StoryId {
    return new StoryId(id)
  }

  /**
   * Generate a new StoryId with a random UUID
   * @returns StoryId instance with new UUID
   */
  public static generate(randomService: IRandomService): StoryId {
    return new StoryId(randomService.generateRandomUuid())
  }

  /**
   * Validate UUID format
   * @param uuid String to validate
   * @returns true if valid UUID, false otherwise
   */
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }
}
