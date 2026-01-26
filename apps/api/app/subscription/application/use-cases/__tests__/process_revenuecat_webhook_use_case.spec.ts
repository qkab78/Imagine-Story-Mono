import { test } from '@japa/runner'
import { ProcessRevenueCatWebhookUseCase } from '#subscription/application/use-cases/process_revenuecat_webhook_use_case'
import { ISubscriptionRepository } from '#subscription/domain/repositories/i_subscription_repository'
import { RevenueCatEventType, type RevenueCatWebhookPayload } from '#subscription/types/revenuecat_webhook'
import { Role } from '#users/models/role'

// Mock repository implementation
class MockSubscriptionRepository extends ISubscriptionRepository {
  public updateUserRoleCalled = false
  public trackWebhookEventCalled = false
  public isProcessedReturn = false

  async updateUserRole(_userEmail: string, _role: number): Promise<void> {
    this.updateUserRoleCalled = true
  }

  async trackWebhookEvent(_eventId: string, _eventType: string, _appUserId: string, _processed: boolean, _payload?: any, _errorMessage?: string): Promise<void> {
    this.trackWebhookEventCalled = true
  }

  async isWebhookEventProcessed(_eventId: string): Promise<boolean> {
    return this.isProcessedReturn
  }

  // Reset for each test
  reset() {
    this.updateUserRoleCalled = false
    this.trackWebhookEventCalled = false
    this.isProcessedReturn = false
  }
}

const createMockPayload = (overrides: Partial<RevenueCatWebhookPayload> = {}): RevenueCatWebhookPayload => ({
  api_version: '1.0',
  event: {
    id: 'test-event-123',
    type: RevenueCatEventType.INITIAL_PURCHASE,
    event_timestamp_ms: Date.now(),
    app_id: 'test-app',
    app_user_id: 'user@example.com',
    original_app_user_id: 'user@example.com',
    environment: 'SANDBOX',
    entitlement_ids: ['premium'],
    ...overrides.event,
  },
  ...overrides,
})

test.group(ProcessRevenueCatWebhookUseCase.name, (group) => {
  let useCase: ProcessRevenueCatWebhookUseCase
  let mockRepository: MockSubscriptionRepository

  group.each.setup(() => {
    mockRepository = new MockSubscriptionRepository()
    useCase = new ProcessRevenueCatWebhookUseCase(mockRepository)
    mockRepository.reset()
  })

  test('should process INITIAL_PURCHASE and make user premium', async ({ assert }) => {
    // Arrange
    const payload = createMockPayload()

    // Act
    const result = await useCase.execute({ payload })

    // Assert
    assert.isTrue(result.success)
    assert.equal(result.eventId, 'test-event-123')
    assert.isTrue(result.processed)
    assert.isTrue(mockRepository.updateUserRoleCalled)
    assert.isTrue(mockRepository.trackWebhookEventCalled)
  })

  test('should process EXPIRATION and remove premium', async ({ assert }) => {
    // Arrange  
    const payload = createMockPayload()
    payload.event.type = RevenueCatEventType.EXPIRATION
    payload.event.entitlement_ids = []

    // Act
    const result = await useCase.execute({ payload })

    // Assert
    assert.isTrue(result.success)
    assert.isTrue(mockRepository.updateUserRoleCalled)
  })

  test('should skip processing if event already processed', async ({ assert }) => {
    // Arrange
    mockRepository.isProcessedReturn = true
    const payload = createMockPayload()

    // Act
    const result = await useCase.execute({ payload })

    // Assert
    assert.isTrue(result.success)
    assert.isFalse(result.processed)
    assert.include(result.message, 'already processed')
    assert.isFalse(mockRepository.updateUserRoleCalled)
  })

  test('should handle errors and track failed events', async ({ assert }) => {
    // Arrange
    const payload = createMockPayload()
    mockRepository.updateUserRole = async () => {
      throw new Error('Database connection failed')
    }

    // Act
    const result = await useCase.execute({ payload })

    // Assert
    assert.isFalse(result.success)
    assert.include(result.message, 'Database connection failed')
    assert.isFalse(result.processed)
    // trackWebhookEvent should still be called to log the failure
    assert.isTrue(mockRepository.trackWebhookEventCalled)
  })

  test('should determine premium status correctly for different event types', async ({ assert }) => {
    const testCases = [
      { eventType: RevenueCatEventType.INITIAL_PURCHASE, entitlements: ['premium'] },
      { eventType: RevenueCatEventType.RENEWAL, entitlements: ['premium'] },
      { eventType: RevenueCatEventType.EXPIRATION, entitlements: [] },
      { eventType: RevenueCatEventType.CANCELLATION, entitlements: ['premium'] },
      { eventType: RevenueCatEventType.INITIAL_PURCHASE, entitlements: [] },
    ]

    for (const testCase of testCases) {
      // Arrange
      mockRepository.reset()
      const payload = createMockPayload()
      payload.event.type = testCase.eventType
      payload.event.entitlement_ids = testCase.entitlements

      // Act
      const result = await useCase.execute({ payload })

      // Assert
      assert.isTrue(result.success, `Failed for ${testCase.eventType}`)
      assert.isTrue(mockRepository.updateUserRoleCalled, `updateUserRole not called for ${testCase.eventType}`)
    }
  })

  test('should handle unknown event types gracefully', async ({ assert }) => {
    // Arrange
    const payload = createMockPayload()
    payload.event.type = 'UNKNOWN_EVENT_TYPE' as any

    // Act
    const result = await useCase.execute({ payload })

    // Assert
    assert.isTrue(result.success)
    assert.isTrue(mockRepository.updateUserRoleCalled)
  })
})