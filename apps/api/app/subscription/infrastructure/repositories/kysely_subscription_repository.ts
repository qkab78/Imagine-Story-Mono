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

  async trackWebhookEvent(eventId: string, eventType: string, appUserId: string, processed: boolean, payload?: any, errorMessage?: string): Promise<void> {
    console.log(`[KyselySubscriptionRepository] Tracking webhook event ${eventId} for user ${appUserId}`)

    const status = processed ? 'processed' : 'failed'
    const processedAt = processed ? new Date() : null

    await db
      .insertInto('webhook_events')
      .values({
        event_id: eventId,
        event_type: eventType,
        app_user_id: appUserId,
        status,
        payload: JSON.stringify(payload || {}),
        error_message: errorMessage || null,
        retry_count: 0,
        processed_at: processedAt,
      })
      .onConflict((oc) => oc.column('event_id').doUpdateSet({
        status,
        error_message: errorMessage || null,
        processed_at: processedAt,
        updated_at: new Date(),
      }))
      .execute()

    console.log(`[KyselySubscriptionRepository] Webhook event ${eventId} tracked with status: ${status}`)
  }

  async isWebhookEventProcessed(eventId: string): Promise<boolean> {
    console.log(`[KyselySubscriptionRepository] Checking if webhook event ${eventId} was already processed`)
    
    const existingEvent = await db
      .selectFrom('webhook_events')
      .select('status')
      .where('event_id', '=', eventId)
      .where('status', '=', 'processed')
      .executeTakeFirst()

    const isProcessed = !!existingEvent
    console.log(`[KyselySubscriptionRepository] Event ${eventId} processed status: ${isProcessed}`)
    return isProcessed
  }
}
