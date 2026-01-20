import { InvalidValueObjectException } from '#stories/domain/exceptions/invalid_value_object_exception'

export class ProviderUserId {
  private constructor(private readonly value: string) {}

  static create(value: string): ProviderUserId {
    if (!value || value.trim().length === 0) {
      throw new InvalidValueObjectException("L'identifiant du provider ne peut pas être vide")
    }
    return new ProviderUserId(value.trim())
  }

  getValue(): string {
    return this.value
  }

  toString(): string {
    return this.value
  }

  equals(other: ProviderUserId): boolean {
    return this.value === other.value
  }
}
