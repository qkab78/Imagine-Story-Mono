import { inject } from '@adonisjs/core'
import { ISubscriptionRepository } from '#subscription/domain/repositories/i_subscription_repository'
import { Role } from '#users/models/role'
import {
  RevenueCatEventType,
  type RevenueCatWebhookPayload,
  type ProcessedWebhookResult,
} from '#subscription/types/revenuecat_webhook'

export interface ProcessRevenueCatWebhookInputDTO {
  payload: RevenueCatWebhookPayload
  authHeader?: string
}

/**
 * Process RevenueCat Webhook Use Case
 * 
 * Processes incoming RevenueCat webhook events and updates user subscription status.
 * Implements idempotency to prevent duplicate processing.
 */
@inject()
export class ProcessRevenueCatWebhookUseCase {
  constructor(private readonly subscriptionRepository: ISubscriptionRepository) {}

  async execute(input: ProcessRevenueCatWebhookInputDTO): Promise<ProcessedWebhookResult> {
    const { payload } = input
    const { event } = payload

    console.log(`[ProcessRevenueCatWebhookUseCase] Processing event ${event.id} of type ${event.type}`)

    try {
      // Check if event was already processed (idempotency)
      const alreadyProcessed = await this.subscriptionRepository.isWebhookEventProcessed(event.id)
      if (alreadyProcessed) {
        console.log(`[ProcessRevenueCatWebhookUseCase] Event ${event.id} already processed, skipping`)
        return {
          success: true,
          message: 'Event already processed',
          eventId: event.id,
          processed: true,
        }
      }

      // Track the event as being processed
      await this.subscriptionRepository.trackWebhookEvent(
        event.id,
        event.type,
        event.app_user_id,
        false
      )

      // Log environment for debugging
      console.log(`[ProcessRevenueCatWebhookUseCase] Event environment: ${event.environment}`)

      // Determine if user should have premium based on event type
      const shouldBePremium = this.shouldUserBePremium(event.type, event.entitlement_ids || [])
      const newRole = shouldBePremium ? Role.PREMIUM : Role.CUSTOMER
      const userEmail = event.app_user_id

      console.log(`[ProcessRevenueCatWebhookUseCase] User ${userEmail} should be premium: ${shouldBePremium}, new role: ${newRole}`)

      // Performance optimization: only update if role might change
      const updateStartTime = Date.now()
      await this.subscriptionRepository.updateUserRole(userEmail, newRole)
      const updateTime = Date.now() - updateStartTime
      console.log(`[ProcessRevenueCatWebhookUseCase] Role update completed in ${updateTime}ms`)

      // Mark event as successfully processed
      await this.subscriptionRepository.trackWebhookEvent(
        event.id,
        event.type,
        event.app_user_id,
        true
      )

      const message = this.getEventMessage(event.type, shouldBePremium)

      console.log(`[ProcessRevenueCatWebhookUseCase] Successfully processed event ${event.id}`)

      return {
        success: true,
        message,
        userId: userEmail,
        newRole,
        eventId: event.id,
        processed: true,
      }

    } catch (error) {
      console.error(`[ProcessRevenueCatWebhookUseCase] Error processing event ${event.id}:`, error)
      
      // Try to track the failed event
      try {
        await this.subscriptionRepository.trackWebhookEvent(
          event.id,
          event.type,
          event.app_user_id,
          false
        )
      } catch (trackingError) {
        console.error(`[ProcessRevenueCatWebhookUseCase] Failed to track error for event ${event.id}:`, trackingError)
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        eventId: event.id,
        processed: false,
      }
    }
  }

  /**
   * Determine if user should have premium access based on event type and entitlements
   */
  private shouldUserBePremium(eventType: RevenueCatEventType, entitlementIds: string[]): boolean {
    console.log(`[ProcessRevenueCatWebhookUseCase] Checking premium status for event ${eventType} with entitlements:`, entitlementIds)
    
    switch (eventType) {
      case RevenueCatEventType.INITIAL_PURCHASE:
      case RevenueCatEventType.RENEWAL:
        // User should be premium if they have active entitlements
        return entitlementIds.length > 0
      
      case RevenueCatEventType.EXPIRATION:
      case RevenueCatEventType.CANCELLATION:
        // User should not be premium after expiration/cancellation
        return false
      
      case RevenueCatEventType.BILLING_ISSUE:
        // Keep current status for billing issues (grace period)
        // You might want to handle this differently based on your business logic
        return entitlementIds.length > 0
      
      case RevenueCatEventType.PRODUCT_CHANGE:
        // Check if new product provides premium access
        return entitlementIds.length > 0
      
      default:
        console.warn(`[ProcessRevenueCatWebhookUseCase] Unknown event type: ${eventType}`)
        return false
    }
  }

  /**
   * Get human-readable message for the event
   */
  private getEventMessage(eventType: RevenueCatEventType, isPremium: boolean): string {
    switch (eventType) {
      case RevenueCatEventType.INITIAL_PURCHASE:
        return isPremium ? 'User upgraded to premium' : 'Purchase processed'
      
      case RevenueCatEventType.RENEWAL:
        return 'Subscription renewed'
      
      case RevenueCatEventType.EXPIRATION:
        return 'Subscription expired - user downgraded to free'
      
      case RevenueCatEventType.CANCELLATION:
        return 'Subscription cancelled - user downgraded to free'
      
      case RevenueCatEventType.BILLING_ISSUE:
        return 'Billing issue detected'
      
      case RevenueCatEventType.PRODUCT_CHANGE:
        return isPremium ? 'Product changed - premium maintained' : 'Product changed - downgraded to free'
      
      default:
        return `Event ${eventType} processed`
    }
  }
}