import { Provider } from '../value-objects/Provider.vo.js'
import { ProviderUserId } from '../value-objects/ProviderUserId.vo.js'

export interface SocialAccountProps {
  id: string
  userId: string
  provider: Provider
  providerUserId: ProviderUserId
  email: string
  name: string | null
  avatarUrl: string | null
  accessToken: string
  refreshToken: string | null
  tokenExpiresAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export class SocialAccount {
  private constructor(private readonly props: SocialAccountProps) {}

  static create(props: SocialAccountProps): SocialAccount {
    return new SocialAccount(props)
  }

  get id(): string {
    return this.props.id
  }
  get userId(): string {
    return this.props.userId
  }
  get provider(): Provider {
    return this.props.provider
  }
  get providerUserId(): ProviderUserId {
    return this.props.providerUserId
  }
  get email(): string {
    return this.props.email
  }
  get name(): string | null {
    return this.props.name
  }
  get avatarUrl(): string | null {
    return this.props.avatarUrl
  }
  get accessToken(): string {
    return this.props.accessToken
  }
  get refreshToken(): string | null {
    return this.props.refreshToken
  }
  get tokenExpiresAt(): Date | null {
    return this.props.tokenExpiresAt
  }
  get createdAt(): Date {
    return this.props.createdAt
  }
  get updatedAt(): Date {
    return this.props.updatedAt
  }

  isTokenExpired(): boolean {
    if (!this.props.tokenExpiresAt) return false
    return new Date() > this.props.tokenExpiresAt
  }
}
