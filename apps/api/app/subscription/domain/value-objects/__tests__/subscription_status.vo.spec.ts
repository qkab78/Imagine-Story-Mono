import { test } from '@japa/runner'
import { SubscriptionStatus } from '#subscription/domain/value-objects/subscription_status.vo'
import { InvalidSubscriptionStateException } from '#subscription/domain/exceptions/invalid_subscription_state_exception'

test.group('SubscriptionStatus', () => {
  test('should create a valid status from string', ({ assert }) => {
    const status = SubscriptionStatus.create('premium')
    assert.equal(status.getValue(), 'premium')
  })

  test('should throw on invalid status', ({ assert }) => {
    assert.throws(() => SubscriptionStatus.create('invalid'), InvalidSubscriptionStateException as any)
  })

  test('free() should create a free status', ({ assert }) => {
    const status = SubscriptionStatus.free()
    assert.isTrue(status.isFree())
    assert.isFalse(status.isPremium())
    assert.isFalse(status.hasAccess())
  })

  test('premium() should create a premium status with access', ({ assert }) => {
    const status = SubscriptionStatus.premium()
    assert.isTrue(status.isPremium())
    assert.isTrue(status.hasAccess())
    assert.isFalse(status.isFree())
  })

  test('expired() should create an expired status without access', ({ assert }) => {
    const status = SubscriptionStatus.expired()
    assert.isTrue(status.isExpired())
    assert.isFalse(status.hasAccess())
  })

  test('cancelled() should create a cancelled status without access', ({ assert }) => {
    const status = SubscriptionStatus.cancelled()
    assert.isTrue(status.isCancelled())
    assert.isFalse(status.hasAccess())
  })

  test('billingIssue() should create a billing_issue status with access (grace period)', ({ assert }) => {
    const status = SubscriptionStatus.billingIssue()
    assert.isTrue(status.hasBillingIssue())
    assert.isTrue(status.hasAccess())
  })

  test('equals() should compare two statuses', ({ assert }) => {
    const a = SubscriptionStatus.premium()
    const b = SubscriptionStatus.premium()
    const c = SubscriptionStatus.free()
    assert.isTrue(a.equals(b))
    assert.isFalse(a.equals(c))
  })
})
