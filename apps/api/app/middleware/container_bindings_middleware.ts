import { Logger } from '@adonisjs/core/logger'
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
    console.log(`[Middleware] Request: ${ctx.request.method()} ${ctx.request.url()}`)
    ctx.containerResolver.bindValue(HttpContext, ctx)
    ctx.containerResolver.bindValue(Logger, ctx.logger)

    try {
      const result = await next()
      console.log(`[Middleware] Request processed: ${ctx.request.method()} ${ctx.request.url()}, response status: ${ctx.response.response.statusCode || 'pending'}`)
      return result
    } catch (error) {
      console.error(`[Middleware] Error in request ${ctx.request.method()} ${ctx.request.url()}:`, error)
      throw error
    }
  }
}
