import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'
import logger from '@adonisjs/core/services/logger'

export default class StoryEventsController {
  async stream({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const userId = user.id as string

    logger.info(`[SSE] Client connected: ${userId}`)

    response.response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    })

    // Send initial connection event
    response.response.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)

    // Keepalive every 30s
    const keepalive = setInterval(() => {
      response.response.write(':keepalive\n\n')
    }, 30000)

    // Subscribe to story events via Redis pub/sub
    const channel = `story:events:${userId}`
    redis.subscribe(channel, (message: string) => {
      try {
        response.response.write(`data: ${message}\n\n`)
      } catch (error) {
        logger.error(`[SSE] Error writing to stream for ${userId}:`, error)
      }
    })

    // Cleanup on disconnect
    response.response.on('close', () => {
      clearInterval(keepalive)
      redis.unsubscribe(channel)
      logger.info(`[SSE] Client disconnected: ${userId}`)
    })
  }
}
