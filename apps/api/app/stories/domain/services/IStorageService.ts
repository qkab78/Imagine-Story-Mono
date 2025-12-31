/**
 * Storage Service Interface
 *
 * Abstract storage layer supporting multiple backends (local filesystem, MinIO, S3, etc.)
 * Following Clean Architecture - domain defines the contract, infrastructure implements it.
 */

export type StorageMetadata = {
  contentType?: string
  size?: number
  uploadedAt?: string
  customMetadata?: Record<string, string>
}

export type UploadOptions = {
  contentType?: string
  metadata?: Record<string, string>
  isPublic?: boolean
}

export type UploadResult = {
  path: string // Storage path/key (e.g., "covers/story-slug.webp")
  url: string // Accessible URL (pre-signed for MinIO, local route for filesystem)
  expiresAt?: Date // For pre-signed URLs
}

export type ListOptions = {
  prefix?: string
  limit?: number
  marker?: string
}

export type ListResult = {
  objects: Array<{
    path: string
    size: number
    lastModified: Date
  }>
  isTruncated: boolean
  nextMarker?: string
}

/**
 * Storage Service Interface
 *
 * Provides abstract storage operations for file management.
 * Implementations can use local filesystem, MinIO, S3, or any other storage backend.
 */
export abstract class IStorageService {
  /**
   * Upload a file from buffer
   */
  abstract upload(path: string, data: Buffer, options?: UploadOptions): Promise<UploadResult>

  /**
   * Upload a file from URL (download and upload)
   */
  abstract uploadFromUrl(
    sourceUrl: string,
    destinationPath: string,
    options?: UploadOptions
  ): Promise<UploadResult>

  /**
   * Delete a file
   */
  abstract delete(path: string): Promise<void>

  /**
   * Check if file exists
   */
  abstract exists(path: string): Promise<boolean>

  /**
   * Get accessible URL (pre-signed for MinIO, local route for filesystem)
   */
  abstract getUrl(path: string, expiresInSeconds?: number): Promise<string>

  /**
   * List files with optional prefix
   */
  abstract list(options?: ListOptions): Promise<ListResult>

  /**
   * Get file metadata
   */
  abstract getMetadata(path: string): Promise<StorageMetadata | null>
}
