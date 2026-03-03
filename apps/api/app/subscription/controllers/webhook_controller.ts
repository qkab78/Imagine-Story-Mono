import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { ProcessRevenueCatWebhookUseCase } from '#subscription/application/use-cases/process_revenuecat_webhook_use_case'
import { revenuecatWebhookValidator } from './validators/revenuecat_webhook_validator.js'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

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
    logger.debug('RevenueCat webhook received')

    try {
      // Verify authorization header (always required)
      const authHeader = request.header('authorization')
      const expectedAuth = env.get('REVENUECAT_WEBHOOK_AUTH_HEADER')

      if (!expectedAuth || authHeader !== expectedAuth) {
        logger.warn('Invalid or missing authorization header for RevenueCat webhook')
        return response.status(401).json({
          success: false,
          error: 'Unauthorized'
        })
      }

      // Validate webhook payload structure
      const payload = await request.validateUsing(revenuecatWebhookValidator)
      logger.debug({ eventId: payload.event.id, eventType: payload.event.type }, 'Processing RevenueCat event')

      // Process the webhook event
      const result = await this.processRevenueCatWebhookUseCase.execute({
        payload,
        authHeader,
      })

      const processingTime = Date.now() - startTime
      logger.debug({ processingTime }, 'RevenueCat webhook processed')

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
      logger.error({ err: error }, 'Error processing RevenueCat webhook')
      throw error
    }
  }
}