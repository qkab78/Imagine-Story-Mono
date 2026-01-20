import { test } from '@japa/runner'
import { GoogleAuthUseCase } from './GoogleAuthUseCase.js'
import {
  ISocialAuthService,
  SocialUserInfo,
  SocialAuthContext,
} from '../services/ISocialAuthService.js'
import { ISocialAccountRepository } from '../../domain/repositories/ISocialAccountRepository.js'
import { IAuthUserRepository } from '../../domain/repositories/IAuthUserRepository.js'
import { IRandomService } from '#stories/domain/services/IRandomService'
import { IDateService } from '#stories/domain/services/IDateService'
import { SocialAccount } from '../../domain/entities/SocialAccount.entity.js'
import { AuthUser } from '../../domain/entities/AuthUser.entity.js'
import { Provider } from '../../domain/value-objects/Provider.vo.js'
import { ProviderUserId } from '../../domain/value-objects/ProviderUserId.vo.js'
import { Role } from '#users/models/role'

test.group(GoogleAuthUseCase.name, () => {
  class TestDateService implements IDateService {
    now(): string {
      return '2025-01-01T00:00:00.000Z'
    }
  }

  class TestRandomService implements IRandomService {
    private callCount = 0
    private uuids = ['user-uuid-1234', 'social-account-uuid-5678']

    generateRandomUuid(): string {
      return this.uuids[this.callCount++ % this.uuids.length]
    }
  }

  class TestSocialAuthService implements ISocialAuthService {
    private redirectUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

    getRedirectUrl(
      _provider: string,
      _ctx: SocialAuthContext,
      _mobileCallbackUrl?: string
    ): Promise<string> {
      return Promise.resolve(this.redirectUrl)
    }

    handleCallback(_provider: string, _ctx: SocialAuthContext): Promise<SocialUserInfo> {
      throw new Error('Method not implemented.')
    }
  }

  // Mock context for tests
  const mockContext = {} as SocialAuthContext

  class TestSocialAccountRepository implements ISocialAccountRepository {
    public readonly accounts: Map<string, SocialAccount> = new Map()

    findByProviderAndUserId(
      provider: Provider,
      providerUserId: ProviderUserId
    ): Promise<SocialAccount | null> {
      const account = Array.from(this.accounts.values()).find(
        (a) =>
          a.provider.getValue() === provider.getValue() &&
          a.providerUserId.getValue() === providerUserId.getValue()
      )
      return Promise.resolve(account || null)
    }

    findByUserIdAndProvider(userId: string, provider: Provider): Promise<SocialAccount | null> {
      const account = Array.from(this.accounts.values()).find(
        (a) => a.userId === userId && a.provider.getValue() === provider.getValue()
      )
      return Promise.resolve(account || null)
    }

    create(account: SocialAccount): Promise<SocialAccount> {
      this.accounts.set(account.id, account)
      return Promise.resolve(account)
    }

    update(_account: SocialAccount): Promise<void> {
      throw new Error('Method not implemented.')
    }

    delete(_id: string): Promise<void> {
      throw new Error('Method not implemented.')
    }
  }

  class TestAuthUserRepository implements IAuthUserRepository {
    public readonly users: Map<string, AuthUser> = new Map()

    findById(id: string): Promise<AuthUser | null> {
      return Promise.resolve(this.users.get(id) || null)
    }

    findByEmail(email: string): Promise<AuthUser | null> {
      const user = Array.from(this.users.values()).find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      )
      return Promise.resolve(user || null)
    }

    create(user: AuthUser): Promise<AuthUser> {
      this.users.set(user.id, user)
      return Promise.resolve(user)
    }
  }

  const createSocialUserInfo = (overrides: Partial<SocialUserInfo> = {}): SocialUserInfo => ({
    id: 'google-user-123',
    email: 'john.doe@gmail.com',
    emailVerified: true,
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    avatarUrl: 'https://lh3.googleusercontent.com/avatar',
    accessToken: 'ya29.access-token',
    refreshToken: 'refresh-token',
    tokenExpiresAt: new Date('2025-01-02T00:00:00.000Z'),
    ...overrides,
  })

  test('should return redirect URL', async ({ assert }) => {
    const socialAuthService = new TestSocialAuthService()
    const socialAccountRepository = new TestSocialAccountRepository()
    const authUserRepository = new TestAuthUserRepository()
    const randomService = new TestRandomService()
    const dateService = new TestDateService()

    const useCase = new GoogleAuthUseCase(
      socialAuthService,
      socialAccountRepository,
      authUserRepository,
      randomService,
      dateService
    )

    const redirectUrl = await useCase.getRedirectUrl(mockContext)

    assert.equal(redirectUrl, 'https://accounts.google.com/o/oauth2/v2/auth')
  })

  test('should create new user when social account does not exist and email is new', async ({
    assert,
  }) => {
    const socialAuthService = new TestSocialAuthService()
    const socialAccountRepository = new TestSocialAccountRepository()
    const authUserRepository = new TestAuthUserRepository()
    const randomService = new TestRandomService()
    const dateService = new TestDateService()

    const useCase = new GoogleAuthUseCase(
      socialAuthService,
      socialAccountRepository,
      authUserRepository,
      randomService,
      dateService
    )

    const socialUserInfo = createSocialUserInfo()
    const result = await useCase.execute(socialUserInfo)

    // Verify result
    assert.isTrue(result.isNewUser)
    assert.equal(result.user.email, 'john.doe@gmail.com')
    assert.equal(result.user.firstname, 'John')
    assert.equal(result.user.lastname, 'Doe')
    assert.equal(result.user.role, Role.CUSTOMER)

    // Verify user was created
    const createdUser = await authUserRepository.findByEmail('john.doe@gmail.com')
    assert.isDefined(createdUser)
    assert.isNull(createdUser?.password)

    // Verify social account was created
    assert.equal(socialAccountRepository.accounts.size, 1)
  })

  test('should link social account when user with email already exists', async ({ assert }) => {
    const socialAuthService = new TestSocialAuthService()
    const socialAccountRepository = new TestSocialAccountRepository()
    const authUserRepository = new TestAuthUserRepository()
    const randomService = new TestRandomService()
    const dateService = new TestDateService()

    // Create existing user
    const existingUser = AuthUser.create({
      id: 'existing-user-id',
      email: 'john.doe@gmail.com',
      password: 'hashed-password',
      firstname: 'John',
      lastname: 'Doe',
      role: Role.CUSTOMER,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    })
    authUserRepository.users.set(existingUser.id, existingUser)

    const useCase = new GoogleAuthUseCase(
      socialAuthService,
      socialAccountRepository,
      authUserRepository,
      randomService,
      dateService
    )

    const socialUserInfo = createSocialUserInfo()
    const result = await useCase.execute(socialUserInfo)

    // Verify result
    assert.isFalse(result.isNewUser)
    assert.equal(result.user.id, 'existing-user-id')
    assert.equal(result.user.email, 'john.doe@gmail.com')

    // Verify no new user was created
    assert.equal(authUserRepository.users.size, 1)

    // Verify social account was linked
    assert.equal(socialAccountRepository.accounts.size, 1)
    const linkedAccount = Array.from(socialAccountRepository.accounts.values())[0]
    assert.equal(linkedAccount.userId, 'existing-user-id')
  })

  test('should return existing user when social account already exists', async ({ assert }) => {
    const socialAuthService = new TestSocialAuthService()
    const socialAccountRepository = new TestSocialAccountRepository()
    const authUserRepository = new TestAuthUserRepository()
    const randomService = new TestRandomService()
    const dateService = new TestDateService()

    // Create existing user
    const existingUser = AuthUser.create({
      id: 'existing-user-id',
      email: 'john.doe@gmail.com',
      password: null,
      firstname: 'John',
      lastname: 'Doe',
      role: Role.CUSTOMER,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    })
    authUserRepository.users.set(existingUser.id, existingUser)

    // Create existing social account
    const existingSocialAccount = SocialAccount.create({
      id: 'social-account-id',
      userId: 'existing-user-id',
      provider: Provider.google(),
      providerUserId: ProviderUserId.create('google-user-123'),
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      avatarUrl: 'https://lh3.googleusercontent.com/avatar',
      accessToken: 'old-access-token',
      refreshToken: 'old-refresh-token',
      tokenExpiresAt: new Date('2024-12-31'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    })
    socialAccountRepository.accounts.set(existingSocialAccount.id, existingSocialAccount)

    const useCase = new GoogleAuthUseCase(
      socialAuthService,
      socialAccountRepository,
      authUserRepository,
      randomService,
      dateService
    )

    const socialUserInfo = createSocialUserInfo()
    const result = await useCase.execute(socialUserInfo)

    // Verify result
    assert.isFalse(result.isNewUser)
    assert.equal(result.user.id, 'existing-user-id')
    assert.equal(result.user.email, 'john.doe@gmail.com')

    // Verify no new user or social account was created
    assert.equal(authUserRepository.users.size, 1)
    assert.equal(socialAccountRepository.accounts.size, 1)
  })

  test('should throw OAuthException when social account exists but user not found', async ({
    assert,
  }) => {
    const socialAuthService = new TestSocialAuthService()
    const socialAccountRepository = new TestSocialAccountRepository()
    const authUserRepository = new TestAuthUserRepository()
    const randomService = new TestRandomService()
    const dateService = new TestDateService()

    // Create orphan social account (user doesn't exist)
    const orphanSocialAccount = SocialAccount.create({
      id: 'social-account-id',
      userId: 'non-existent-user-id',
      provider: Provider.google(),
      providerUserId: ProviderUserId.create('google-user-123'),
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      avatarUrl: null,
      accessToken: 'access-token',
      refreshToken: null,
      tokenExpiresAt: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    })
    socialAccountRepository.accounts.set(orphanSocialAccount.id, orphanSocialAccount)

    const useCase = new GoogleAuthUseCase(
      socialAuthService,
      socialAccountRepository,
      authUserRepository,
      randomService,
      dateService
    )

    const socialUserInfo = createSocialUserInfo()

    await assert.rejects(
      async () => await useCase.execute(socialUserInfo),
      'Impossible de récupérer les informations utilisateur'
    )
  })

  test('should normalize email to lowercase', async ({ assert }) => {
    const socialAuthService = new TestSocialAuthService()
    const socialAccountRepository = new TestSocialAccountRepository()
    const authUserRepository = new TestAuthUserRepository()
    const randomService = new TestRandomService()
    const dateService = new TestDateService()

    const useCase = new GoogleAuthUseCase(
      socialAuthService,
      socialAccountRepository,
      authUserRepository,
      randomService,
      dateService
    )

    const socialUserInfo = createSocialUserInfo({ email: 'John.Doe@GMAIL.COM' })
    const result = await useCase.execute(socialUserInfo)

    assert.equal(result.user.email, 'john.doe@gmail.com')
  })

  test('should handle missing firstName and lastName gracefully', async ({ assert }) => {
    const socialAuthService = new TestSocialAuthService()
    const socialAccountRepository = new TestSocialAccountRepository()
    const authUserRepository = new TestAuthUserRepository()
    const randomService = new TestRandomService()
    const dateService = new TestDateService()

    const useCase = new GoogleAuthUseCase(
      socialAuthService,
      socialAccountRepository,
      authUserRepository,
      randomService,
      dateService
    )

    const socialUserInfo = createSocialUserInfo({
      firstName: null,
      lastName: null,
    })
    const result = await useCase.execute(socialUserInfo)

    assert.equal(result.user.firstname, '')
    assert.equal(result.user.lastname, '')
  })
})
