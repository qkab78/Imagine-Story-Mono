import { inject } from '@adonisjs/core'
import {
  ISocialAuthService,
  SocialUserInfo,
  SocialAuthContext,
} from '../services/i_social_auth_service.js'
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

export interface GoogleAuthResult {
  user: {
    id: string
    email: string
    firstname: string
    lastname: string
    role: number
    createdAt: Date
  }
  isNewUser: boolean
}

@inject()
export class GoogleAuthUseCase {
  constructor(
    private readonly socialAuthService: ISocialAuthService,
    private readonly socialAccountRepository: ISocialAccountRepository,
    private readonly authUserRepository: IAuthUserRepository,
    private readonly randomService: IRandomService,
    private readonly dateService: IDateService
  ) {}

  async getRedirectUrl(ctx: SocialAuthContext, mobileCallbackUrl?: string): Promise<string> {
    return this.socialAuthService.getRedirectUrl('google', ctx, mobileCallbackUrl)
  }

  async handleCallback(ctx: SocialAuthContext): Promise<SocialUserInfo> {
    return this.socialAuthService.handleCallback('google', ctx)
  }

  async execute(socialUser: SocialUserInfo): Promise<GoogleAuthResult> {
    const provider = Provider.google()
    const providerUserId = ProviderUserId.create(socialUser.id)

    // 1. Check if social account already exists
    const existingSocialAccount = await this.socialAccountRepository.findByProviderAndUserId(
      provider,
      providerUserId
    )

    if (existingSocialAccount) {
      return this.handleExistingSocialAccount(existingSocialAccount)
    }

    // 2. Check if user with this email already exists
    const existingUser = await this.authUserRepository.findByEmail(socialUser.email.toLowerCase())

    if (existingUser) {
      await this.linkSocialAccountToUser(existingUser.id, socialUser, provider, providerUserId)
      return this.formatUserResult(existingUser, false)
    }

    // 3. Create new user
    return this.createNewUser(socialUser, provider, providerUserId)
  }

  private async handleExistingSocialAccount(
    socialAccount: SocialAccount
  ): Promise<GoogleAuthResult> {
    const user = await this.authUserRepository.findById(socialAccount.userId)

    if (!user) {
      throw OAuthException.userInfoFailed('google')
    }

    return this.formatUserResult(user, false)
  }

  private async createNewUser(
    socialUser: SocialUserInfo,
    provider: Provider,
    providerUserId: ProviderUserId
  ): Promise<GoogleAuthResult> {
    const userId = this.randomService.generateRandomUuid()
    const now = new Date(this.dateService.now())

    // Create user entity
    const newUser = AuthUser.create({
      id: userId,
      email: socialUser.email.toLowerCase(),
      password: null,
      firstname: socialUser.firstName ?? '',
      lastname: socialUser.lastName ?? '',
      role: Role.CUSTOMER,
      createdAt: now,
      updatedAt: now,
    })

    // Persist user via repository
    const createdUser = await this.authUserRepository.create(newUser)

    // Link social account
    await this.linkSocialAccountToUser(createdUser.id, socialUser, provider, providerUserId)

    return this.formatUserResult(createdUser, true)
  }

  private async linkSocialAccountToUser(
    userId: string,
    socialUser: SocialUserInfo,
    provider: Provider,
    providerUserId: ProviderUserId
  ): Promise<void> {
    const now = new Date(this.dateService.now())

    const socialAccount = SocialAccount.create({
      id: this.randomService.generateRandomUuid(),
      userId,
      provider,
      providerUserId,
      email: socialUser.email,
      name: socialUser.name,
      avatarUrl: socialUser.avatarUrl,
      accessToken: socialUser.accessToken,
      refreshToken: socialUser.refreshToken,
      tokenExpiresAt: socialUser.tokenExpiresAt,
      createdAt: now,
      updatedAt: now,
    })

    await this.socialAccountRepository.create(socialAccount)
  }

  private formatUserResult(user: AuthUser, isNewUser: boolean): GoogleAuthResult {
    return {
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        createdAt: user.createdAt,
      },
      isNewUser,
    }
  }
}
