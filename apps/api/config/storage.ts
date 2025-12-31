import env from '#start/env'

const storageConfig = {
  /*
  |--------------------------------------------------------------------------
  | Default Storage Provider
  |--------------------------------------------------------------------------
  |
  | Supported: "local", "minio"
  */
  default: env.get('STORAGE_PROVIDER'),

  /*
  |--------------------------------------------------------------------------
  | Local Filesystem Storage
  |--------------------------------------------------------------------------
  */
  local: {
    basePath: 'uploads/stories',
    baseUrl: '/images',
  },

  /*
  |--------------------------------------------------------------------------
  | MinIO Object Storage
  |--------------------------------------------------------------------------
  */
  minio: {
    endpoint: env.get('MINIO_ENDPOINT', 'localhost'),
    port: env.get('MINIO_PORT', 9000),
    useSSL: env.get('MINIO_USE_SSL', false),
    accessKey: env.get('MINIO_ROOT_USER', ''),
    secretKey: env.get('MINIO_ROOT_PASSWORD', ''),
    bucket: env.get('MINIO_BUCKET', 'imagine-story'),
    presignedUrlExpiry: env.get('MINIO_PRESIGNED_URL_EXPIRY', 3600), // 1 hour
  },
}

export default storageConfig
