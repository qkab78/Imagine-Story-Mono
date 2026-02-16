import type { Subscription } from '../entities/subscription.entity.js'

export abstract class ISubscriptionRepository {
  abstract findByUserId(userId: string): Promise<Subscription | null>
  abstract findByRevenuecatAppUserId(appUserId: string): Promise<Subscription | null>
  abstract upsert(subscription: Subscription): Promise<void>

  abstract updateUserRole(userEmail: string, role: number): Promise<void>
  abstract trackWebhookEvent(
    eventId: string,
    eventType: string,
    appUserId: string,
    processed: boolean,
    payload?: any,
    errorMessage?: string
  ): Promise<void>
  abstract isWebhookEventProcessed(eventId: string): Promise<boolean>
}
