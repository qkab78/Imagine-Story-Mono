/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),
  SEED_USER_ID: Env.schema.string(),
  /*
  |----------------------------------------------------------
  | Variables for @rlanz/bull-queue
  |----------------------------------------------------------
  */
  QUEUE_REDIS_HOST: Env.schema.string({ format: 'host' }),
  QUEUE_REDIS_PORT: Env.schema.number(),
  QUEUE_REDIS_PASSWORD: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */
  SMTP_HOST: Env.schema.string(),
  SMTP_PORT: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the openai package
  |----------------------------------------------------------
  */
  OPENAI_API_KEY: Env.schema.string(),
  OPENAI_MODEL: Env.schema.string(),
  STORIES_QUERY_LIMIT: Env.schema.number(),

  /*
  |----------------------------------------------------------
  | Variables for configuring story quotas
  |----------------------------------------------------------
  */
  FREE_USER_MONTHLY_STORY_LIMIT: Env.schema.number(),

  /*
  |----------------------------------------------------------
  | Variables for configuring storage
  |----------------------------------------------------------
  */
  STORAGE_PROVIDER: Env.schema.enum(['local', 'minio'] as const),

  // MinIO Configuration (optional - only required when STORAGE_PROVIDER=minio)
  MINIO_ENDPOINT: Env.schema.string.optional(),
  MINIO_PORT: Env.schema.number.optional(),
  MINIO_USE_SSL: Env.schema.boolean.optional(),
  MINIO_ROOT_USER: Env.schema.string.optional(),
  MINIO_ROOT_PASSWORD: Env.schema.string.optional(),
  MINIO_BUCKET: Env.schema.string.optional(),
  MINIO_PRESIGNED_URL_EXPIRY: Env.schema.number.optional(), // seconds

  /*
  |----------------------------------------------------------
  | Variables for configuring frontend URL
  |----------------------------------------------------------
  */
  FRONTEND_URL: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring image provider
  |----------------------------------------------------------
  */
  IMAGE_PROVIDER: Env.schema.enum(['gemini', 'leonardo'] as const),
  GEMINI_API_KEY: Env.schema.string.optional(),
  LEONARDO_API_KEY: Env.schema.string.optional(),
  /*
  |----------------------------------------------------------
  | Variables for configuring Google authentication
  |----------------------------------------------------------
  */
  GOOGLE_CLIENT_ID: Env.schema.string(),
  GOOGLE_CLIENT_SECRET: Env.schema.string(),
  GOOGLE_CALLBACK_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring translation services
  |----------------------------------------------------------
  */
  DEEPL_API_KEY: Env.schema.string(),
  GOOGLE_TRANSLATE_API_KEY: Env.schema.string(),
  STORY_SOURCE_LANGUAGE: Env.schema.string(),
  STORY_SOURCE_LANGUAGE_CODE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring RevenueCat
  |----------------------------------------------------------
  */
  REVENUECAT_WEBHOOK_AUTH_HEADER: Env.schema.string(),
  REVENUECAT_API_KEY: Env.schema.string(),
})
