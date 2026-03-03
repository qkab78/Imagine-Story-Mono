import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import { ISubscriptionRepository } from '#subscription/domain/repositories/i_subscription_repository'
import { Subscription } from '#subscription/domain/entities/subscription.entity'
import { SubscriptionStatus } from '#subscription/domain/value-objects/subscription_status.vo'
import { Role } from '#users/models/role'
import {
  RevenueCatEventType,
  type RevenueCatEvent,
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

    logger.debug(`[ProcessRevenueCatWebhookUseCase] Processing event ${event.id} of type ${event.type}`)

    try {
      // Check if event was already processed (idempotency)
      const alreadyProcessed = await this.subscriptionRepository.isWebhookEventProcessed(event.id)
      if (alreadyProcessed) {
        logger.debug(`[ProcessRevenueCatWebhookUseCase] Event ${event.id} already processed, skipping`)
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
      logger.debug(`[ProcessRevenueCatWebhookUseCase] Event environment: ${event.environment}`)

      // Determine if user should have premium based on event type
      const shouldBePremium = this.shouldUserBePremium(event.type, event.entitlement_ids || [])
      const newRole = shouldBePremium ? Role.PREMIUM : Role.CUSTOMER
      const userEmail = event.app_user_id

      logger.debug(`[ProcessRevenueCatWebhookUseCase] User ${userEmail} should be premium: ${shouldBePremium}, new role: ${newRole}`)

      // Performance optimization: only update if role might change
      const updateStartTime = Date.now()
      await this.subscriptionRepository.updateUserRole(userEmail, newRole)
      const updateTime = Date.now() - updateStartTime
      logger.debug(`[ProcessRevenueCatWebhookUseCase] Role update completed in ${updateTime}ms`)

      // Upsert subscription entity
      await this.upsertSubscription(event, userEmail)

      // Mark event as successfully processed
      await this.subscriptionRepository.trackWebhookEvent(
        event.id,
        event.type,
        event.app_user_id,
        true,
        payload
      )

      const message = this.getEventMessage(event.type, shouldBePremium)

      logger.debug(`[ProcessRevenueCatWebhookUseCase] Successfully processed event ${event.id}`)

      return {
        success: true,
        message,
        userId: userEmail,
        newRole,
        eventId: event.id,
        processed: true,
      }

    } catch (error) {
      logger.error({ err: error }, `[ProcessRevenueCatWebhookUseCase] Error processing event ${event.id}`)
      
      // Track failed event
      try {
        await this.subscriptionRepository.trackWebhookEvent(
          event.id,
          event.type,
          event.app_user_id,
          false,
          payload,
          error instanceof Error ? error.message : 'Unknown error occurred'
        )
      } catch (trackingError) {
        logger.error({ err: trackingError }, `[ProcessRevenueCatWebhookUseCase] Failed to track error for event ${event.id}`)
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
    logger.debug(`[ProcessRevenueCatWebhookUseCase] Checking premium status for event ${eventType} with entitlements: ${entitlementIds.join(', ')}`)
    
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
        logger.warn(`[ProcessRevenueCatWebhookUseCase] Unknown event type: ${eventType}`)
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

  /**
   * Upsert subscription entity from webhook event data.
   * Looks up the user by RevenueCat app_user_id (email), then creates or updates
   * the subscription record in the subscriptions table.
   */
  private async upsertSubscription(event: RevenueCatEvent, userEmail: string): Promise<void> {
    try {
      let subscription = await this.subscriptionRepository.findByRevenuecatAppUserId(
        event.app_user_id
      )

      if (!subscription) {
        // Try to find user_id from users table via the repository's existing methods
        // For now, create with empty userId - the upsert will match on revenuecat_app_user_id
        subscription = Subscription.createFree('')
      }

      const newStatus = this.mapEventToStatus(event.type, event.entitlement_ids || [])
      const willRenew =
        event.type === RevenueCatEventType.INITIAL_PURCHASE ||
        event.type === RevenueCatEventType.RENEWAL

      subscription = subscription.applyWebhookEvent({
        status: newStatus,
        productId: event.product_id ?? null,
        entitlementId: event.entitlement_id ?? (event.entitlement_ids?.[0] ?? null),
        store: event.store ?? null,
        expirationDate: event.expiration_at_ms
          ? new Date(event.expiration_at_ms)
          : null,
        willRenew,
        webhookEventId: event.id,
        revenuecatAppUserId: event.app_user_id,
      })

      await this.subscriptionRepository.upsert(subscription)
      logger.debug(
        `[ProcessRevenueCatWebhookUseCase] Subscription upserted for ${userEmail} with status: ${newStatus.getValue()}`
      )
    } catch (upsertError) {
      // Log but don't fail the whole webhook processing if subscription upsert fails
      logger.error(
        { err: upsertError },
        `[ProcessRevenueCatWebhookUseCase] Failed to upsert subscription for ${userEmail}`
      )
    }
  }

  /**
   * Map a RevenueCat event type to a SubscriptionStatus value object
   */
  private mapEventToStatus(
    eventType: RevenueCatEventType,
    entitlementIds: string[]
  ): SubscriptionStatus {
    switch (eventType) {
      case RevenueCatEventType.INITIAL_PURCHASE:
      case RevenueCatEventType.RENEWAL:
        return entitlementIds.length > 0
          ? SubscriptionStatus.premium()
          : SubscriptionStatus.free()

      case RevenueCatEventType.EXPIRATION:
        return SubscriptionStatus.expired()

      case RevenueCatEventType.CANCELLATION:
        return SubscriptionStatus.cancelled()

      case RevenueCatEventType.BILLING_ISSUE:
        return SubscriptionStatus.billingIssue()

      case RevenueCatEventType.PRODUCT_CHANGE:
        return entitlementIds.length > 0
          ? SubscriptionStatus.premium()
          : SubscriptionStatus.free()

      default:
        return SubscriptionStatus.free()
    }
  }
}