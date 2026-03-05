import env from '#start/env'
import { defineConfig } from '@adonisjs/redis'

const redisPassword = env.get('QUEUE_REDIS_PASSWORD')

export default defineConfig({
  connection: 'main',
  connections: {
    main: {
      host: env.get('QUEUE_REDIS_HOST'),
      port: env.get('QUEUE_REDIS_PORT'),
      ...(redisPassword && { password: redisPassword }),
    },
  },
})
