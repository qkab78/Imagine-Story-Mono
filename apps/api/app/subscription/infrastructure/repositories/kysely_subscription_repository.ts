import { db } from '#services/db'
import logger from '@adonisjs/core/services/logger'
import { ISubscriptionRepository } from '#subscription/domain/repositories/i_subscription_repository'
import type { Subscription } from '#subscription/domain/entities/subscription.entity'
import { SubscriptionMapper } from '../mappers/subscription_mapper.js'

export class KyselySubscriptionRepository extends ISubscriptionRepository {
  async findByUserId(userId: string): Promise<Subscription | null> {
    const row = await db
      .selectFrom('subscriptions')
      .selectAll()
      .where('user_id', '=', userId)
      .executeTakeFirst()

    if (!row) return null
    return SubscriptionMapper.toDomain(row as any)
  }

  async findByRevenuecatAppUserId(appUserId: string): Promise<Subscription | null> {
    const row = await db
      .selectFrom('subscriptions')
      .selectAll()
      .where('revenuecat_app_user_id', '=', appUserId)
      .executeTakeFirst()

    if (!row) return null
    return SubscriptionMapper.toDomain(row as any)
  }

  async upsert(subscription: Subscription): Promise<void> {
    const data = SubscriptionMapper.toPersistence(subscription)

    await db
      .insertInto('subscriptions')
      .values(data)
      .onConflict((oc) =>
        oc.column('user_id').doUpdateSet({
          status: data.status,
          revenuecat_app_user_id: data.revenuecat_app_user_id,
          product_id: data.product_id,
          entitlement_id: data.entitlement_id,
          store: data.store,
          expiration_date: data.expiration_date,
          will_renew: data.will_renew,
          grace_period_expires_date: data.grace_period_expires_date,
          management_url: data.management_url,
          last_verified_at: data.last_verified_at,
          last_webhook_event_id: data.last_webhook_event_id,
          updated_at: new Date(),
        })
      )
      .execute()
  }

  async updateUserRole(userEmail: string, role: number): Promise<void> {
    logger.debug(`[KyselySubscriptionRepository] Updating user ${userEmail} role to ${role}`)

    // Optimized: only update if role is actually different
    const result = await db
      .updateTable('users')
      .set({ role })
      .where('email', '=', userEmail)
      .where('role', '!=', role)  // Only update if role is different
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      logger.debug(`[KyselySubscriptionRepository] No update needed - user ${userEmail} already has role ${role}`)
    } else {
      logger.debug(`[KyselySubscriptionRepository] Successfully updated user ${userEmail} to role ${role}`)
    }
  }

  async trackWebhookEvent(eventId: string, eventType: string, appUserId: string, processed: boolean, payload?: any, errorMessage?: string): Promise<void> {
    logger.debug(`[KyselySubscriptionRepository] Tracking webhook event ${eventId} for user ${appUserId}`)

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

    logger.debug(`[KyselySubscriptionRepository] Webhook event ${eventId} tracked with status: ${status}`)
  }

  async isWebhookEventProcessed(eventId: string): Promise<boolean> {
    logger.debug(`[KyselySubscriptionRepository] Checking if webhook event ${eventId} was already processed`)
    
    const existingEvent = await db
      .selectFrom('webhook_events')
      .select('status')
      .where('event_id', '=', eventId)
      .where('status', '=', 'processed')
      .executeTakeFirst()

    const isProcessed = !!existingEvent
    logger.debug(`[KyselySubscriptionRepository] Event ${eventId} processed status: ${isProcessed}`)
    return isProcessed
  }
}
