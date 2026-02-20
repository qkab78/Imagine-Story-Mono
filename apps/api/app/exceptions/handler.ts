import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import PaymentErrors from './payment_errors.js'
import { ApplicationException, TranslationException } from '#stories/application/exceptions/index'
import { DomainException } from '#stories/domain/exceptions/domain_exception'
import { InvalidValueObjectException } from '#stories/domain/exceptions/invalid_value_object_exception'
import { InvariantViolationException } from '#stories/domain/exceptions/invariant_violation_exception'
import { OAuthException } from '#auth/domain/exceptions/o_auth_exception'
import { SubscriptionDomainException } from '#subscription/domain/exceptions/subscription_domain_exception'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    console.error('[ExceptionHandler] Error caught:', error)
    if (error instanceof Error) {
      console.error('[ExceptionHandler] Error stack:', error.stack)
    }

    // Handle TranslationException (translation service errors)
    if (error instanceof TranslationException) {
      return ctx.response.status(error.statusCode).json({
        error: {
          code: error.code,
          message: error.message,
          provider: error.provider,
          sourceLanguage: error.sourceLanguage,
          targetLanguage: error.targetLanguage,
        },
      })
    }

    // Handle ApplicationException (story quota exceeded, not found, etc.)
    if (error instanceof ApplicationException) {
      return ctx.response.status(error.statusCode).json({
        error: {
          code: error.code,
          message: error.message,
        },
      })
    }

    // Handle InvalidValueObjectException (invalid input data)
    if (error instanceof InvalidValueObjectException) {
      return ctx.response.status(400).json({
        error: {
          code: 'INVALID_VALUE',
          message: error.message,
        },
      })
    }

    // Handle InvariantViolationException (business rule violation)
    if (error instanceof InvariantViolationException) {
      return ctx.response.status(422).json({
        error: {
          code: error.code,
          message: error.message,
        },
      })
    }

    // Handle DomainException (generic domain errors)
    if (error instanceof DomainException) {
      return ctx.response.status(400).json({
        error: {
          code: error.code,
          message: error.message,
        },
      })
    }

    // Handle OAuthException (OAuth errors)
    if (error instanceof OAuthException) {
      return ctx.response.status(401).json({
        error: {
          code: error.code,
          message: error.message,
          provider: error.provider,
        },
      })
    }

    // Handle SubscriptionDomainException (subscription errors)
    if (error instanceof SubscriptionDomainException) {
      return ctx.response.status(400).json({
        error: {
          code: error.code,
          message: error.message,
        },
      })
    }

    if (error instanceof PaymentErrors) {
      return ctx.response.badRequest(error.errors)
    }
    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
