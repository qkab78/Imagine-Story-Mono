export abstract class ISubscriptionRepository {
  abstract updateUserRole(userEmail: string, role: number): Promise<void>
  abstract trackWebhookEvent(eventId: string, eventType: string, appUserId: string, processed: boolean, payload?: any, errorMessage?: string): Promise<void>
  abstract isWebhookEventProcessed(eventId: string): Promise<boolean>
}
