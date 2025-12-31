import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import app from '@adonisjs/core/services/app'
import { IStorageService } from '#stories/domain/services/IStorageService'
import storageConfig from '#config/storage'

export default class MigrateToMinio extends BaseCommand {
  static commandName = 'storage:migrate-to-minio'
  static description = 'Migrate local storage files to MinIO'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.boolean({ description: 'Run in dry-run mode without making changes' })
  declare dryRun: boolean

  async run() {
    this.logger.info('Starting MinIO migration...')

    // Verify MinIO is configured
    if (storageConfig.default !== 'minio') {
      this.logger.error(
        'STORAGE_PROVIDER must be set to "minio" in .env before running migration'
      )
      this.logger.info('Current provider: ' + storageConfig.default)
      return
    }

    if (this.dryRun) {
      this.logger.info('🔍 Running in DRY-RUN mode - no changes will be made')
    }

    const storageService = await app.container.make(IStorageService)

    // Migrate covers
    await this.migrateDirectory('uploads/stories/covers', 'covers/', storageService)

    // Migrate chapters
    await this.migrateDirectory('uploads/stories/chapters', 'chapters/', storageService)

    this.logger.success('✅ Migration completed!')
    this.logger.info(
      '⚠️  Local files have NOT been deleted. Please backup and remove manually after verification.'
    )
  }

  private async migrateDirectory(
    localDir: string,
    minioPrefix: string,
    storageService: IStorageService
  ): Promise<void> {
    const localPath = app.makePath(localDir)
    this.logger.info(`\n📁 Migrating directory: ${localDir}`)

    try {
      // Check if directory exists
      await stat(localPath)
    } catch (error) {
      this.logger.warning(`Directory ${localDir} does not exist, skipping...`)
      return
    }

    const files = await readdir(localPath)
    let uploaded = 0
    let skipped = 0
    let errors = 0

    for (const fileName of files) {
      const filePath = join(localPath, fileName)
      const minioPath = `${minioPrefix}${fileName}`

      try {
        // Check if file already exists in MinIO
        const exists = await storageService.exists(minioPath)

        if (exists) {
          this.logger.info(`  ⏭️  Skipped (already exists): ${fileName}`)
          skipped++
          continue
        }

        if (this.dryRun) {
          this.logger.info(`  📋 Would upload: ${fileName} -> ${minioPath}`)
          uploaded++
          continue
        }

        // Read file and upload to MinIO
        const fileBuffer = await readFile(filePath)
        const contentType = this.getContentType(fileName)

        await storageService.upload(minioPath, fileBuffer, {
          contentType,
        })

        this.logger.info(`  ✅ Uploaded: ${fileName}`)
        uploaded++
      } catch (error) {
        this.logger.error(`  ❌ Error uploading ${fileName}: ${error.message}`)
        errors++
      }
    }

    this.logger.info(`\n📊 Summary for ${localDir}:`)
    this.logger.info(`  - Uploaded: ${uploaded}`)
    this.logger.info(`  - Skipped: ${skipped}`)
    this.logger.info(`  - Errors: ${errors}`)
  }

  private getContentType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase()

    const mimeTypes: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      gif: 'image/gif',
      svg: 'image/svg+xml',
    }

    return mimeTypes[ext || ''] || 'application/octet-stream'
  }
}
