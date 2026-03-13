import { InvalidValueObjectException } from '#stories/domain/exceptions/invalid_value_object_exception'

export type ProviderType = 'google' | 'apple'

export class Provider {
  private static readonly VALID_PROVIDERS: ProviderType[] = ['google', 'apple']

  private constructor(private readonly value: ProviderType) {}

  static create(value: string): Provider {
    if (!this.VALID_PROVIDERS.includes(value as ProviderType)) {
      throw new InvalidValueObjectException(
        `Provider invalide: ${value}. Valeurs acceptées: ${this.VALID_PROVIDERS.join(', ')}`
      )
    }
    return new Provider(value as ProviderType)
  }

  static google(): Provider {
    return new Provider('google')
  }

  static apple(): Provider {
    return new Provider('apple')
  }

  getValue(): ProviderType {
    return this.value
  }

  toString(): string {
    return this.value
  }

  equals(other: Provider): boolean {
    return this.value === other.value
  }
}
