import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { IStorageService } from '#stories/domain/services/i_storage_service'
import { IPdfGeneratorService } from '#stories/domain/services/i_pdf_generator_service'
import { StoryNotFoundException } from '#stories/application/exceptions/story_not_found_exception'
import { PremiumRequiredException } from '#stories/application/exceptions/premium_required_exception'
import { Role } from '#users/models/role'

export interface ExportStoryPdfPayload {
  storyId: string
  userId: string
  userRole: number
}

export interface ExportStoryPdfResult {
  buffer: Buffer
  fileName: string
}

/**
 * Export Story PDF Use Case
 *
 * Generates a PDF of a story. Restricted to premium users.
 * The story must be accessible (public or owned by the user).
 */
@inject()
export class ExportStoryPdfUseCase {
  constructor(
    private readonly storyRepository: IStoryRepository,
    private readonly storageService: IStorageService,
    private readonly pdfGeneratorService: IPdfGeneratorService
  ) {}

  async execute(payload: ExportStoryPdfPayload): Promise<ExportStoryPdfResult> {
    // Check premium access
    if (payload.userRole < Role.PREMIUM) {
      throw new PremiumRequiredException('PDF export')
    }

    // Fetch story
    const story = await this.storyRepository.findById(payload.storyId)

    if (!story) {
      throw StoryNotFoundException.byId(payload.storyId)
    }

    // Check access: must be public or owned by the user
    if (!story.isPublic() && story.ownerId !== payload.userId) {
      throw StoryNotFoundException.byId(payload.storyId)
    }

    // Download cover image if available
    let coverImageBuffer: Buffer | null = null
    if (story.coverImageUrl) {
      try {
        const coverUrl = story.coverImageUrl.getValue()
        // Get accessible URL (handles pre-signed URLs for MinIO)
        const accessibleUrl = coverUrl.startsWith('http')
          ? coverUrl
          : await this.storageService.getUrl(coverUrl)

        const response = await fetch(accessibleUrl)
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer()
          coverImageBuffer = Buffer.from(arrayBuffer)
        }
      } catch {
        // Continue without cover image if download fails
      }
    }

    // Generate PDF
    const buffer = await this.pdfGeneratorService.generatePdf(story, coverImageBuffer)

    // Build filename from story title
    const sanitizedTitle = story.title
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 50)
    const fileName = `${sanitizedTitle || 'story'}.pdf`

    return { buffer, fileName }
  }
}
