import { test } from '@japa/runner'
import { VerifySubscriptionUseCase } from '#subscription/application/use-cases/verify_subscription_use_case'
import { ISubscriptionRepository } from '#subscription/domain/repositories/i_subscription_repository'
import { IRevenueCatService, type RevenueCatCustomerInfoResult } from '#subscription/domain/services/i_revenuecat_service'
import type { Subscription } from '#subscription/domain/entities/subscription.entity'

class MockSubscriptionRepository extends ISubscriptionRepository {
  public upsertedSubscription: Subscription | null = null
  public updatedRole: { email: string; role: number } | null = null

  async findByUserId(_userId: string): Promise<Subscription | null> {
    return null
  }

  async findByRevenuecatAppUserId(_appUserId: string): Promise<Subscription | null> {
    return null
  }

  async upsert(subscription: Subscription): Promise<void> {
    this.upsertedSubscription = subscription
  }

  async updateUserRole(userEmail: string, role: number): Promise<void> {
    this.updatedRole = { email: userEmail, role }
  }

  async trackWebhookEvent(): Promise<void> {}
  async isWebhookEventProcessed(_eventId: string): Promise<boolean> {
    return false
  }
}

class MockRevenueCatService extends IRevenueCatService {
  public customerInfoResult: RevenueCatCustomerInfoResult | null = null

  async getCustomerInfo(_appUserId: string): Promise<RevenueCatCustomerInfoResult> {
    if (!this.customerInfoResult) {
      throw new Error('Mock not configured')
    }
    return this.customerInfoResult
  }
}

test.group('VerifySubscriptionUseCase', () => {
  let useCase: VerifySubscriptionUseCase
  let mockRepo: MockSubscriptionRepository
  let mockRevenueCat: MockRevenueCatService

  test('should verify active subscription and set premium', async ({ assert }) => {
    mockRepo = new MockSubscriptionRepository()
    mockRevenueCat = new MockRevenueCatService()
    useCase = new VerifySubscriptionUseCase(mockRepo, mockRevenueCat)

    mockRevenueCat.customerInfoResult = {
      appUserId: 'user@test.com',
      entitlements: [
        {
          id: 'premium',
          isActive: true,
          expirationDate: '2030-01-01T00:00:00Z',
          willRenew: true,
          productIdentifier: 'mpc_monthly',
          purchaseDate: '2025-01-01T00:00:00Z',
        },
      ],
      managementUrl: 'https://apps.apple.com/account/subscriptions',
      activeSubscriptions: ['mpc_monthly'],
      firstSeen: '2025-01-01T00:00:00Z',
    }

    const result = await useCase.execute({
      userId: 'user-1',
      revenuecatAppUserId: 'user@test.com',
    })

    assert.equal(result.status, 'premium')
    assert.isTrue(result.hasAccess)
    assert.isTrue(result.willRenew)
    assert.equal(result.managementUrl, 'https://apps.apple.com/account/subscriptions')
    assert.isNotNull(mockRepo.upsertedSubscription)
    assert.isTrue(mockRepo.upsertedSubscription!.status.isPremium())
  })

  test('should verify expired subscription and set expired', async ({ assert }) => {
    mockRepo = new MockSubscriptionRepository()
    mockRevenueCat = new MockRevenueCatService()
    useCase = new VerifySubscriptionUseCase(mockRepo, mockRevenueCat)

    mockRevenueCat.customerInfoResult = {
      appUserId: 'user@test.com',
      entitlements: [
        {
          id: 'premium',
          isActive: false,
          expirationDate: '2024-01-01T00:00:00Z',
          willRenew: false,
          productIdentifier: 'mpc_monthly',
          purchaseDate: '2023-01-01T00:00:00Z',
        },
      ],
      managementUrl: null,
      activeSubscriptions: [],
      firstSeen: '2023-01-01T00:00:00Z',
    }

    const result = await useCase.execute({
      userId: 'user-2',
      revenuecatAppUserId: 'user@test.com',
    })

    assert.equal(result.status, 'expired')
    assert.isFalse(result.hasAccess)
    assert.isFalse(result.willRenew)
  })

  test('should verify no entitlements and set free', async ({ assert }) => {
    mockRepo = new MockSubscriptionRepository()
    mockRevenueCat = new MockRevenueCatService()
    useCase = new VerifySubscriptionUseCase(mockRepo, mockRevenueCat)

    mockRevenueCat.customerInfoResult = {
      appUserId: 'user@test.com',
      entitlements: [],
      managementUrl: null,
      activeSubscriptions: [],
      firstSeen: '2025-01-01T00:00:00Z',
    }

    const result = await useCase.execute({
      userId: 'user-3',
      revenuecatAppUserId: 'user@test.com',
    })

    assert.equal(result.status, 'free')
    assert.isFalse(result.hasAccess)
  })

  test('should update user role after verification', async ({ assert }) => {
    mockRepo = new MockSubscriptionRepository()
    mockRevenueCat = new MockRevenueCatService()
    useCase = new VerifySubscriptionUseCase(mockRepo, mockRevenueCat)

    mockRevenueCat.customerInfoResult = {
      appUserId: 'user@test.com',
      entitlements: [
        {
          id: 'premium',
          isActive: true,
          expirationDate: '2030-01-01T00:00:00Z',
          willRenew: true,
          productIdentifier: 'mpc_monthly',
          purchaseDate: '2025-01-01T00:00:00Z',
        },
      ],
      managementUrl: null,
      activeSubscriptions: ['mpc_monthly'],
      firstSeen: '2025-01-01T00:00:00Z',
    }

    await useCase.execute({
      userId: 'user-1',
      revenuecatAppUserId: 'user@test.com',
    })

    assert.isNotNull(mockRepo.updatedRole)
    assert.equal(mockRepo.updatedRole!.email, 'user@test.com')
    // Role.PREMIUM = 3
    assert.equal(mockRepo.updatedRole!.role, 3)
  })
})
