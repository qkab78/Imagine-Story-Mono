import { test } from '@japa/runner'
import { Subscription } from '#subscription/domain/entities/subscription.entity'
import { SubscriptionStatus } from '#subscription/domain/value-objects/subscription_status.vo'
import { ExpirationDate } from '#subscription/domain/value-objects/expiration_date.vo'

test.group('Subscription Entity', () => {
  test('createFree() should create a free subscription', ({ assert }) => {
    const sub = Subscription.createFree('user-123')
    assert.equal(sub.userId, 'user-123')
    assert.isTrue(sub.status.isFree())
    assert.isFalse(sub.hasAccess())
    assert.isFalse(sub.willRenew)
    assert.isNull(sub.productId)
    assert.isNull(sub.revenuecatAppUserId)
  })

  test('create() should build from full props', ({ assert }) => {
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
      managementUrl: 'https://apps.apple.com/account/subscriptions',
      lastVerifiedAt: now,
      lastWebhookEventId: 'evt-1',
      createdAt: now,
      updatedAt: now,
    })

    assert.equal(sub.id, 'sub-1')
    assert.isTrue(sub.status.isPremium())
    assert.isTrue(sub.hasAccess())
    assert.isTrue(sub.willRenew)
    assert.equal(sub.store, 'APP_STORE')
  })

  test('hasAccess() should return true for premium', ({ assert }) => {
    const sub = Subscription.create({
      id: '',
      userId: 'u',
      status: SubscriptionStatus.premium(),
      revenuecatAppUserId: null,
      productId: null,
      entitlementId: null,
      store: null,
      expirationDate: ExpirationDate.none(),
      originalPurchaseDate: null,
      willRenew: false,
      gracePeriodExpiresDate: null,
      managementUrl: null,
      lastVerifiedAt: null,
      lastWebhookEventId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    assert.isTrue(sub.hasAccess())
  })

  test('hasAccess() should return true for billing_issue (grace period)', ({ assert }) => {
    const sub = Subscription.create({
      id: '',
      userId: 'u',
      status: SubscriptionStatus.billingIssue(),
      revenuecatAppUserId: null,
      productId: null,
      entitlementId: null,
      store: null,
      expirationDate: ExpirationDate.none(),
      originalPurchaseDate: null,
      willRenew: false,
      gracePeriodExpiresDate: null,
      managementUrl: null,
      lastVerifiedAt: null,
      lastWebhookEventId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    assert.isTrue(sub.hasAccess())
  })

  test('hasAccess() should return false for free, expired, cancelled', ({ assert }) => {
    for (const status of [SubscriptionStatus.free(), SubscriptionStatus.expired(), SubscriptionStatus.cancelled()]) {
      const sub = Subscription.create({
        id: '',
        userId: 'u',
        status,
        revenuecatAppUserId: null,
        productId: null,
        entitlementId: null,
        store: null,
        expirationDate: ExpirationDate.none(),
        originalPurchaseDate: null,
        willRenew: false,
        gracePeriodExpiresDate: null,
        managementUrl: null,
        lastVerifiedAt: null,
        lastWebhookEventId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      assert.isFalse(sub.hasAccess(), `hasAccess should be false for ${status.getValue()}`)
    }
  })

  test('applyWebhookEvent() should return a new subscription with updated status', ({ assert }) => {
    const sub = Subscription.createFree('user-1')

    const updated = sub.applyWebhookEvent({
      status: SubscriptionStatus.premium(),
      productId: 'monthly_premium',
      entitlementId: 'premium',
      store: 'PLAY_STORE',
      expirationDate: new Date('2030-01-01'),
      willRenew: true,
      webhookEventId: 'evt-123',
      revenuecatAppUserId: 'user@test.com',
    })

    // Original unchanged
    assert.isTrue(sub.status.isFree())

    // Updated subscription
    assert.isTrue(updated.status.isPremium())
    assert.equal(updated.productId, 'monthly_premium')
    assert.equal(updated.store, 'PLAY_STORE')
    assert.isTrue(updated.willRenew)
    assert.equal(updated.lastWebhookEventId, 'evt-123')
    assert.equal(updated.revenuecatAppUserId, 'user@test.com')
  })

  test('applyVerification() should return a new subscription with verified data', ({ assert }) => {
    const sub = Subscription.createFree('user-1')

    const verified = sub.applyVerification({
      status: SubscriptionStatus.premium(),
      expirationDate: '2030-06-15T00:00:00Z',
      willRenew: true,
      managementUrl: 'https://apps.apple.com/account/subscriptions',
    })

    assert.isTrue(verified.status.isPremium())
    assert.isTrue(verified.willRenew)
    assert.equal(verified.managementUrl, 'https://apps.apple.com/account/subscriptions')
    assert.isNotNull(verified.lastVerifiedAt)
  })

  test('getDaysRemaining() should return null for no expiration', ({ assert }) => {
    const sub = Subscription.createFree('user-1')
    assert.isNull(sub.getDaysRemaining())
  })

  test('getWarningLevel() should return none for free user', ({ assert }) => {
    const sub = Subscription.createFree('user-1')
    assert.equal(sub.getWarningLevel(), 'none')
  })
})
