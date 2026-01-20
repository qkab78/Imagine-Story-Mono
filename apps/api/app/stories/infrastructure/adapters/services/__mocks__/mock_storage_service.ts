import {
  IStorageService,
  type UploadOptions,
  type UploadResult,
  type ListOptions,
  type ListResult,
  type StorageMetadata,
} from '#stories/domain/services/i_storage_service'

/**
 * Mock Storage Service
 *
 * In-memory implementation of IStorageService for testing.
 * Stores files in a Map without actual I/O operations.
 */
export class MockStorageService extends IStorageService {
  private storage: Map<string, { data: Buffer; metadata: UploadOptions }> = new Map()

  async upload(path: string, data: Buffer, options?: UploadOptions): Promise<UploadResult> {
    this.storage.set(path, { data, metadata: options || {} })
    return {
      path,
      url: `http://mock-storage/${path}`,
      expiresAt: new Date(Date.now() + 3600 * 1000),
    }
  }

  async uploadFromUrl(
    sourceUrl: string,
    destinationPath: string,
    options?: UploadOptions
  ): Promise<UploadResult> {
    // Mock implementation - just store the source URL reference
    const mockData = Buffer.from(`Mock data from ${sourceUrl}`)
    return this.upload(destinationPath, mockData, options)
  }

  async delete(path: string): Promise<void> {
    this.storage.delete(path)
  }

  async exists(path: string): Promise<boolean> {
    return this.storage.has(path)
  }

  async getUrl(path: string, _expiresInSeconds?: number): Promise<string> {
    if (!this.storage.has(path)) {
      throw new Error(`File not found: ${path}`)
    }
    return `http://mock-storage/${path}`
  }

  async list(_options?: ListOptions): Promise<ListResult> {
    const objects = Array.from(this.storage.keys()).map((path) => ({
      path,
      size: this.storage.get(path)!.data.length,
      lastModified: new Date(),
    }))

    return {
      objects,
      isTruncated: false,
    }
  }

  async getMetadata(path: string): Promise<StorageMetadata | null> {
    const item = this.storage.get(path)
    if (!item) {
      return null
    }

    return {
      contentType: item.metadata.contentType || 'application/octet-stream',
      size: item.data.length,
      uploadedAt: new Date().toISOString(),
    }
  }

  // Test helper methods

  /**
   * Clear all stored files (useful for test cleanup)
   */
  clear(): void {
    this.storage.clear()
  }

  /**
   * Get stored data for a path (useful for test assertions)
   */
  getStoredData(path: string): Buffer | undefined {
    return this.storage.get(path)?.data
  }

  /**
   * Get all stored paths (useful for test assertions)
   */
  getAllPaths(): string[] {
    return Array.from(this.storage.keys())
  }
}
