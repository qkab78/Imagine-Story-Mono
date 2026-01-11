import { ValueObject } from '../base/ValueObject'
import { InvalidValueObjectException } from '../../exceptions/InvalidValueObjectException'

type GenerationStatusValue = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * Generation Status Value Object
 *
 * Represents the status of a story generation process.
 * Validates status transitions and ensures valid states.
 *
 * Valid states:
 * - pending: Story created, waiting for generation to start
 * - processing: Generation in progress
 * - completed: Generation finished successfully
 * - failed: Generation failed after all retries
 */
export class GenerationStatus extends ValueObject<GenerationStatusValue> {
  protected value: GenerationStatusValue

  private constructor(value: GenerationStatusValue) {
    super()
    this.value = value
  }

  /**
   * Create a GenerationStatus from a string value
   */
  static create(value: GenerationStatusValue): GenerationStatus {
    if (!this.isValid(value)) {
      throw new InvalidValueObjectException(
        `Invalid generation status: ${value}. Must be: pending, processing, completed, or failed`
      )
    }
    return new GenerationStatus(value)
  }

  /**
   * Create a pending status
   */
  static pending(): GenerationStatus {
    return new GenerationStatus('pending')
  }

  /**
   * Create a processing status
   */
  static processing(): GenerationStatus {
    return new GenerationStatus('processing')
  }

  /**
   * Create a completed status
   */
  static completed(): GenerationStatus {
    return new GenerationStatus('completed')
  }

  /**
   * Create a failed status
   */
  static failed(): GenerationStatus {
    return new GenerationStatus('failed')
  }

  /**
   * Get the status value
   */
  getValue(): GenerationStatusValue {
    return this.value
  }

  /**
   * Check if status is pending
   */
  isPending(): boolean {
    return this.value === 'pending'
  }

  /**
   * Check if status is processing
   */
  isProcessing(): boolean {
    return this.value === 'processing'
  }

  /**
   * Check if status is completed
   */
  isCompleted(): boolean {
    return this.value === 'completed'
  }

  /**
   * Check if status is failed
   */
  isFailed(): boolean {
    return this.value === 'failed'
  }

  /**
   * Check if can transition to a new status
   */
  canTransitionTo(newStatus: GenerationStatus): boolean {
    const transitions: Record<GenerationStatusValue, GenerationStatusValue[]> = {
      pending: ['processing', 'failed'],
      processing: ['completed', 'failed'],
      completed: [],
      failed: ['pending'], // Permet retry
    }
    return transitions[this.value].includes(newStatus.getValue())
  }

  /**
   * Validate status value
   */
  private static isValid(value: string): value is GenerationStatusValue {
    return ['pending', 'processing', 'completed', 'failed'].includes(value)
  }

  /**
   * Check equality with another GenerationStatus
   */
  equals(other: GenerationStatus): boolean {
    return this.value === other.value
  }
}
