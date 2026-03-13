import { inject } from '@adonisjs/core'
import { ISocialAccountRepository } from '../../domain/repositories/i_social_account_repository.js'
import { IAuthUserRepository } from '../../domain/repositories/i_auth_user_repository.js'
import { IRandomService } from '#stories/domain/services/i_random_service'
import { IDateService } from '#stories/domain/services/i_date_service'
import { Provider } from '../../domain/value-objects/provider.vo.js'
import { ProviderUserId } from '../../domain/value-objects/provider_user_id.vo.js'
import { SocialAccount } from '../../domain/entities/social_account.entity.js'
import { AuthUser } from '../../domain/entities/auth_user.entity.js'
import { OAuthException } from '../../domain/exceptions/o_auth_exception.js'
import { Role } from '#users/models/role'

export interface AppleAuthInput {
  appleUserId: string
  email: string | null
  firstName: string | null
  lastName: string | null
}

export interface AppleAuthResult {
  user: {
    id: string
    email: string
    firstname: string
    lastname: string
    role: number
    emailVerifiedAt: Date | null
    createdAt: Date
  }
  isNewUser: boolean
}

@inject()
export class AppleAuthUseCase {
  constructor(
    private readonly socialAccountRepository: ISocialAccountRepository,
    private readonly authUserRepository: IAuthUserRepository,
    private readonly randomService: IRandomService,
    private readonly dateService: IDateService
  ) {}

  async execute(input: AppleAuthInput): Promise<AppleAuthResult> {
    const provider = Provider.apple()
    const providerUserId = ProviderUserId.create(input.appleUserId)

    // 1. Check if social account already exists
    const existingSocialAccount = await this.socialAccountRepository.findByProviderAndUserId(
      provider,
      providerUserId
    )

    if (existingSocialAccount) {
      return this.handleExistingSocialAccount(existingSocialAccount)
    }

    // 2. Check if user with this email already exists
    if (input.email) {
      const existingUser = await this.authUserRepository.findByEmail(input.email.toLowerCase())

      if (existingUser) {
        await this.linkSocialAccountToUser(existingUser.id, input, provider, providerUserId)
        return this.formatUserResult(existingUser, false)
      }
    }

    // 3. Create new user
    return this.createNewUser(input, provider, providerUserId)
  }

  private async handleExistingSocialAccount(
    socialAccount: SocialAccount
  ): Promise<AppleAuthResult> {
    const user = await this.authUserRepository.findById(socialAccount.userId)

    if (!user) {
      throw OAuthException.userInfoFailed('apple')
    }

    return this.formatUserResult(user, false)
  }

  private async createNewUser(
    input: AppleAuthInput,
    provider: Provider,
    providerUserId: ProviderUserId
  ): Promise<AppleAuthResult> {
    const userId = this.randomService.generateRandomUuid()
    const now = new Date(this.dateService.now())

    // Apple OAuth users are auto-verified since Apple already verified their email
    const newUser = AuthUser.create({
      id: userId,
      email: (input.email ?? `apple_${input.appleUserId}@private.appleid.com`).toLowerCase(),
      password: null,
      firstname: input.firstName ?? '',
      lastname: input.lastName ?? '',
      role: Role.CUSTOMER,
      emailVerifiedAt: now,
      createdAt: now,
      updatedAt: now,
    })

    const createdUser = await this.authUserRepository.create(newUser)
    await this.linkSocialAccountToUser(createdUser.id, input, provider, providerUserId)

    return this.formatUserResult(createdUser, true)
  }

  private async linkSocialAccountToUser(
    userId: string,
    input: AppleAuthInput,
    provider: Provider,
    providerUserId: ProviderUserId
  ): Promise<void> {
    const now = new Date(this.dateService.now())

    const socialAccount = SocialAccount.create({
      id: this.randomService.generateRandomUuid(),
      userId,
      provider,
      providerUserId,
      email: input.email ?? '',
      name: [input.firstName, input.lastName].filter(Boolean).join(' ') || null,
      avatarUrl: null,
      accessToken: '',
      refreshToken: null,
      tokenExpiresAt: null,
      createdAt: now,
      updatedAt: now,
    })

    await this.socialAccountRepository.create(socialAccount)
  }

  private formatUserResult(user: AuthUser, isNewUser: boolean): AppleAuthResult {
    return {
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt,
      },
      isNewUser,
    }
  }
}
