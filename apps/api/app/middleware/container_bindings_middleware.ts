import { Logger } from '@adonisjs/core/logger'
import logger from '@adonisjs/core/services/logger'
import { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * The container bindings middleware binds classes to their request
 * specific value using the container resolver.
 *
 * - We bind "HttpContext" class to the "ctx" object
 * - And bind "Logger" class to the "ctx.logger" object
 */
export default class ContainerBindingsMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    logger.debug(`[Middleware] Request: ${ctx.request.method()} ${ctx.request.url()}`)
    ctx.containerResolver.bindValue(HttpContext, ctx)
    ctx.containerResolver.bindValue(Logger, ctx.logger)

    try {
      const result = await next()
      logger.debug(
        `[Middleware] Request processed: ${ctx.request.method()} ${ctx.request.url()}, response status: ${ctx.response.response.statusCode || 'pending'}`
      )
      return result
    } catch (error) {
      logger.error(
        { err: error },
        `[Middleware] Error in request ${ctx.request.method()} ${ctx.request.url()}`
      )
      throw error
    }
  }
}
