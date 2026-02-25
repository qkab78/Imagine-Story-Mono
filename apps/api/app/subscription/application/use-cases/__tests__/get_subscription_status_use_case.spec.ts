import { test } from '@japa/runner'
import { GetSubscriptionStatusUseCase } from '#subscription/application/use-cases/get_subscription_status_use_case'
import { ISubscriptionRepository } from '#subscription/domain/repositories/i_subscription_repository'
import { Subscription } from '#subscription/domain/entities/subscription.entity'
import { SubscriptionStatus } from '#subscription/domain/value-objects/subscription_status.vo'
import { ExpirationDate } from '#subscription/domain/value-objects/expiration_date.vo'

class MockSubscriptionRepository extends ISubscriptionRepository {
  public subscriptionsByUserId: Map<string, Subscription> = new Map()

  async findByUserId(userId: string): Promise<Subscription | null> {
    return this.subscriptionsByUserId.get(userId) ?? null
  }

  async findByRevenuecatAppUserId(_appUserId: string): Promise<Subscription | null> {
    return null
  }

  async upsert(_subscription: Subscription): Promise<void> {}
  async updateUserRole(_userEmail: string, _role: number): Promise<void> {}
  async trackWebhookEvent(): Promise<void> {}
  async isWebhookEventProcessed(_eventId: string): Promise<boolean> {
    return false
  }
}

test.group('GetSubscriptionStatusUseCase', () => {
  let useCase: GetSubscriptionStatusUseCase
  let mockRepository: MockSubscriptionRepository

  test('should return freeDTO when no subscription found', async ({ assert }) => {
    mockRepository = new MockSubscriptionRepository()
    useCase = new GetSubscriptionStatusUseCase(mockRepository)

    const result = await useCase.execute('non-existent-user')

    assert.equal(result.status, 'free')
    assert.isFalse(result.isSubscribed)
    assert.isFalse(result.hasAccess)
    assert.isNull(result.expirationDate)
    assert.isNull(result.daysUntilExpiration)
    assert.equal(result.expirationWarningLevel, 'none')
    assert.isFalse(result.willRenew)
  })

  test('should return premium status for premium subscription', async ({ assert }) => {
    mockRepository = new MockSubscriptionRepository()
    useCase = new GetSubscriptionStatusUseCase(mockRepository)

    const now = new Date()
    const sub = Subscription.create({
      id: 'sub-1',
      userId: 'user-1',
      status: SubscriptionStatus.premium(),
      revenuecatAppUserId: 'user@test.com',
      productId: 'monthly',
      entitlementId: 'premium',
      store: 'APP_STORE',
      expirationDate: ExpirationDate.create(new Date(Date.now() + 30 * 86400000)),
      originalPurchaseDate: now,
      willRenew: true,
      gracePeriodExpiresDate: null,
      managementUrl: null,
      lastVerifiedAt: now,
      lastWebhookEventId: null,
      createdAt: now,
      updatedAt: now,
    })
    mockRepository.subscriptionsByUserId.set('user-1', sub)

    const result = await useCase.execute('user-1')

    assert.equal(result.status, 'premium')
    assert.isTrue(result.isSubscribed)
    assert.isTrue(result.hasAccess)
    assert.isTrue(result.willRenew)
    assert.equal(result.store, 'APP_STORE')
    assert.equal(result.productId, 'monthly')
  })

  test('should return expired status for expired subscription', async ({ assert }) => {
    mockRepository = new MockSubscriptionRepository()
    useCase = new GetSubscriptionStatusUseCase(mockRepository)

    const now = new Date()
    const sub = Subscription.create({
      id: 'sub-2',
      userId: 'user-2',
      status: SubscriptionStatus.expired(),
      revenuecatAppUserId: 'user2@test.com',
      productId: 'monthly',
      entitlementId: 'premium',
      store: 'PLAY_STORE',
      expirationDate: ExpirationDate.create(new Date(Date.now() - 86400000)),
      originalPurchaseDate: now,
      willRenew: false,
      gracePeriodExpiresDate: null,
      managementUrl: null,
      lastVerifiedAt: null,
      lastWebhookEventId: null,
      createdAt: now,
      updatedAt: now,
    })
    mockRepository.subscriptionsByUserId.set('user-2', sub)

    const result = await useCase.execute('user-2')

    assert.equal(result.status, 'expired')
    assert.isFalse(result.isSubscribed)
    assert.isFalse(result.hasAccess)
    assert.isFalse(result.willRenew)
  })
})
