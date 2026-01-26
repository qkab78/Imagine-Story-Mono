import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { ProcessRevenueCatWebhookUseCase } from '#subscription/application/use-cases/process_revenuecat_webhook_use_case'
import { revenuecatWebhookValidator } from './validators/revenuecat_webhook_validator.js'
import env from '#start/env'

/**
 * Webhook Controller
 * 
 * Handles incoming webhook events from external services like RevenueCat.
 * Implements security best practices including authorization header verification.
 */
@inject()
export default class WebhookController {
  constructor(
    private readonly processRevenueCatWebhookUseCase: ProcessRevenueCatWebhookUseCase
  ) {}

  /**
   * Handle RevenueCat webhook events
   * 
   * This endpoint processes subscription events from RevenueCat and updates
   * user subscription status accordingly. It implements idempotency to prevent
   * duplicate event processing.
   */
  public async revenueCat({ request, response }: HttpContext) {
    const startTime = Date.now()
    console.log('[WebhookController] RevenueCat webhook received')

    try {
      // Log raw payload for debugging validation issues
      const rawPayload = request.body()
      console.log('[WebhookController] Raw payload received:', JSON.stringify(rawPayload, null, 2))

      // Verify authorization header for security (optional but recommended)
      const authHeader = request.header('authorization')
      const expectedAuth = env.get('REVENUECAT_WEBHOOK_AUTH_HEADER')
      
      if (expectedAuth && authHeader !== expectedAuth) {
        console.warn('[WebhookController] Invalid authorization header for RevenueCat webhook')
        return response.status(401).json({ 
          success: false, 
          error: 'Unauthorized' 
        })
      }

      // Validate webhook payload structure
      const payload = await request.validateUsing(revenuecatWebhookValidator)
      console.log(`[WebhookController] Processing RevenueCat event ${payload.event.id} of type ${payload.event.type}`)

      // Process the webhook event
      const result = await this.processRevenueCatWebhookUseCase.execute({
        payload,
        authHeader,
      })

      const processingTime = Date.now() - startTime
      console.log(`[WebhookController] RevenueCat webhook processed in ${processingTime}ms`)

      // RevenueCat expects a 200 response to consider the webhook delivered
      const statusCode = result.success ? 200 : 500

      return response.status(statusCode).json({
        success: result.success,
        message: result.message,
        event_id: result.eventId,
        processed: result.processed,
        processing_time_ms: processingTime,
      })

    } catch (error) {
      const processingTime = Date.now() - startTime
      console.error('[WebhookController] Error processing RevenueCat webhook:', error)

      // Return 500 so RevenueCat will retry the webhook
      return response.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        processing_time_ms: processingTime,
      })
    }
  }
}