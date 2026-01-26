import { db } from '#services/db'
import { ISubscriptionRepository } from '#subscription/domain/repositories/i_subscription_repository'

export class KyselySubscriptionRepository extends ISubscriptionRepository {
  async updateUserRole(userEmail: string, role: number): Promise<void> {
    console.log(`[KyselySubscriptionRepository] Updating user ${userEmail} role to ${role}`)

    // Optimized: only update if role is actually different
    const result = await db
      .updateTable('users')
      .set({ role })
      .where('email', '=', userEmail)
      .where('role', '!=', role)  // Only update if role is different
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      console.log(`[KyselySubscriptionRepository] No update needed - user ${userEmail} already has role ${role}`)
    } else {
      console.log(`[KyselySubscriptionRepository] Successfully updated user ${userEmail} to role ${role}`)
    }
  }

  async trackWebhookEvent(eventId: string, eventType: string, appUserId: string, processed: boolean): Promise<void> {
    console.log(`[KyselySubscriptionRepository] Tracking webhook event ${eventId} for user ${appUserId}`)

    // For now, we'll use a simple approach - just track in logs
    // In production, you might want to create a webhook_events table
    const timestamp = new Date().toISOString()
    console.log(`[WebhookEvent] ${timestamp} - EventID: ${eventId}, Type: ${eventType}, User: ${appUserId}, Processed: ${processed}`)
  }

  async isWebhookEventProcessed(eventId: string): Promise<boolean> {
    console.log(`[KyselySubscriptionRepository] Checking if webhook event ${eventId} was already processed`)
    
    // For now, we'll assume events are not processed (simple implementation)
    // In production, you would check a webhook_events table
    // TODO: Implement proper event tracking with database table
    return false
  }
}
