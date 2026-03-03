import {
  IStorageService,
  type UploadOptions,
  type UploadResult,
  type ListOptions,
  type ListResult,
  type StorageMetadata,
} from '#stories/domain/services/i_storage_service'
import * as Minio from 'minio'
import logger from '@adonisjs/core/services/logger'
import axios from 'axios'
import env from '#start/env'

/**
 * MinIO Storage Service
 *
 * Implementation of IStorageService using MinIO object storage.
 * Provides pre-signed URLs for secure, temporary access to files.
 */
export class MinioStorageService extends IStorageService {
  private client: Minio.Client
  private bucket: string
  private defaultExpirySeconds: number

  constructor() {
    super()

    this.bucket = env.get('MINIO_BUCKET', 'imagine-story')
    this.defaultExpirySeconds = env.get('MINIO_PRESIGNED_URL_EXPIRY', 3600) // 1 hour default

    this.client = new Minio.Client({
      endPoint: env.get('MINIO_ENDPOINT', 'localhost'),
      port: env.get('MINIO_PORT', 9000),
      useSSL: env.get('MINIO_USE_SSL', false),
      accessKey: env.get('MINIO_ROOT_USER', ''),
      secretKey: env.get('MINIO_ROOT_PASSWORD', ''),
    })
  }

  /**
   * Ensure bucket exists (called during initialization)
   */
  async ensureBucketExists(): Promise<void> {
    const exists = await this.client.bucketExists(this.bucket)
    if (!exists) {
      await this.client.makeBucket(this.bucket, 'us-east-1')
      logger.info(`MinIO bucket created: ${this.bucket}`)
    }
  }

  async upload(path: string, data: Buffer, options?: UploadOptions): Promise<UploadResult> {
    const contentType = options?.contentType || this.guessContentType(path)
    const metadata: Record<string, string> = {
      'Content-Type': contentType,
      ...options?.metadata,
    }

    await this.client.putObject(this.bucket, path, data, data.length, metadata)

    const url = await this.getUrl(path, this.defaultExpirySeconds)
    const expiresAt = new Date(Date.now() + this.defaultExpirySeconds * 1000)

    return {
      path,
      url,
      expiresAt,
    }
  }

  async uploadFromUrl(
    sourceUrl: string,
    destinationPath: string,
    options?: UploadOptions
  ): Promise<UploadResult> {
    // Download the file from source URL
    const response = await axios.get(sourceUrl, {
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
    })

    if (!response.data || response.data.length === 0) {
      throw new Error(`Failed to download image from ${sourceUrl}`)
    }

    const buffer = Buffer.from(response.data)

    // Determine content type from response headers or guess from path
    const contentType =
      options?.contentType ||
      response.headers['content-type'] ||
      this.guessContentType(destinationPath)

    return this.upload(destinationPath, buffer, { ...options, contentType })
  }

  async delete(path: string): Promise<void> {
    await this.client.removeObject(this.bucket, path)
  }

  async exists(path: string): Promise<boolean> {
    try {
      await this.client.statObject(this.bucket, path)
      return true
    } catch (error: any) {
      if (error.code === 'NotFound') {
        return false
      }
      throw error
    }
  }

  async getUrl(path: string, expiresInSeconds?: number): Promise<string> {
    const expiry = expiresInSeconds || this.defaultExpirySeconds
    return this.client.presignedGetObject(this.bucket, path, expiry)
  }

  async list(options?: ListOptions): Promise<ListResult> {
    const prefix = options?.prefix || ''
    const stream = this.client.listObjectsV2(this.bucket, prefix, true)

    const objects: ListResult['objects'] = []
    let count = 0
    const limit = options?.limit || 1000

    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => {
        if (count >= limit) {
          stream.destroy()
          return
        }

        objects.push({
          path: obj.name || '',
          size: obj.size,
          lastModified: obj.lastModified || new Date(),
        })
        count++
      })

      stream.on('end', () => {
        resolve({
          objects,
          isTruncated: count >= limit,
          nextMarker: objects.length > 0 ? objects[objects.length - 1].path : undefined,
        })
      })

      stream.on('error', reject)
    })
  }

  async getMetadata(path: string): Promise<StorageMetadata | null> {
    try {
      const stat = await this.client.statObject(this.bucket, path)
      return {
        contentType: stat.metaData['content-type'],
        size: stat.size,
        uploadedAt: stat.lastModified.toISOString(),
        customMetadata: stat.metaData,
      }
    } catch (error: any) {
      if (error.code === 'NotFound') {
        return null
      }
      throw error
    }
  }

  private guessContentType(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase()
    const types: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      gif: 'image/gif',
    }
    return types[ext || ''] || 'application/octet-stream'
  }
}
