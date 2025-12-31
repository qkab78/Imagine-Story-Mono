import {
  IStorageService,
  type UploadOptions,
  type UploadResult,
  type ListOptions,
  type ListResult,
  type StorageMetadata,
} from '#stories/domain/services/IStorageService'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs/promises'
import path from 'node:path'
import { existsSync, createWriteStream } from 'node:fs'
import axios from 'axios'
import { pipeline } from 'node:stream/promises'

/**
 * Local Storage Service
 *
 * Implementation of IStorageService using local filesystem.
 * Maintains backward compatibility with existing file structure and URLs.
 */
export class LocalStorageService extends IStorageService {
  private baseDir: string
  private baseUrl: string

  constructor() {
    super()
    this.baseDir = app.makePath('uploads/stories')
    this.baseUrl = '/images' // Matches existing routes
  }

  async upload(filePath: string, data: Buffer, _options?: UploadOptions): Promise<UploadResult> {
    const fullPath = path.join(this.baseDir, filePath)
    const dir = path.dirname(fullPath)

    // Ensure directory exists
    if (!existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true })
    }

    // Write file
    await fs.writeFile(fullPath, data)

    const url = this.pathToUrl(filePath)

    return {
      path: filePath,
      url,
    }
  }

  async uploadFromUrl(
    sourceUrl: string,
    destinationPath: string,
    _options?: UploadOptions
  ): Promise<UploadResult> {
    const fullPath = path.join(this.baseDir, destinationPath)
    const dir = path.dirname(fullPath)

    // Ensure directory exists
    if (!existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true })
    }

    // Download and save using streams
    const response = await axios.get(sourceUrl, {
      responseType: 'stream',
      timeout: 30000,
    })

    const fileStream = createWriteStream(fullPath)
    await pipeline(response.data, fileStream)

    const url = this.pathToUrl(destinationPath)

    return {
      path: destinationPath,
      url,
    }
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.baseDir, filePath)
    if (existsSync(fullPath)) {
      await fs.unlink(fullPath)
    }
  }

  async exists(filePath: string): Promise<boolean> {
    const fullPath = path.join(this.baseDir, filePath)
    return existsSync(fullPath)
  }

  async getUrl(filePath: string, _expiresInSeconds?: number): Promise<string> {
    // Local URLs don't expire
    return this.pathToUrl(filePath)
  }

  async list(options?: ListOptions): Promise<ListResult> {
    const prefix = options?.prefix || ''
    const searchDir = path.join(this.baseDir, prefix)

    if (!existsSync(searchDir)) {
      return {
        objects: [],
        isTruncated: false,
      }
    }

    const objects: ListResult['objects'] = []
    const files = await this.walkDirectory(searchDir, this.baseDir)

    const limit = options?.limit || 1000
    for (let i = 0; i < Math.min(files.length, limit); i++) {
      const file = files[i]
      const stat = await fs.stat(file.fullPath)
      objects.push({
        path: file.relativePath,
        size: stat.size,
        lastModified: stat.mtime,
      })
    }

    return {
      objects,
      isTruncated: files.length > limit,
      nextMarker: objects.length > 0 ? objects[objects.length - 1].path : undefined,
    }
  }

  async getMetadata(filePath: string): Promise<StorageMetadata | null> {
    const fullPath = path.join(this.baseDir, filePath)

    if (!existsSync(fullPath)) {
      return null
    }

    const stat = await fs.stat(fullPath)
    const ext = path.extname(filePath).toLowerCase()

    const contentTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
    }

    return {
      contentType: contentTypes[ext] || 'application/octet-stream',
      size: stat.size,
      uploadedAt: stat.mtime.toISOString(),
    }
  }

  private pathToUrl(filePath: string): string {
    // Convert "covers/story.webp" to "/images/covers/story.webp"
    // Convert "chapters/story_chapter_1.png" to "/images/chapters/story_chapter_1.png"
    return `${this.baseUrl}/${filePath}`
  }

  private async walkDirectory(
    dir: string,
    baseDir: string
  ): Promise<Array<{ fullPath: string; relativePath: string }>> {
    const files: Array<{ fullPath: string; relativePath: string }> = []
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...(await this.walkDirectory(fullPath, baseDir)))
      } else {
        const relativePath = path.relative(baseDir, fullPath)
        files.push({ fullPath, relativePath })
      }
    }

    return files
  }
}
