import type { Story } from '#stories/domain/entities/story.entity'

/**
 * PDF Generator Service Interface
 *
 * Generates PDF documents from story entities.
 * Following Clean Architecture - domain defines the contract, infrastructure implements it.
 */
export abstract class IPdfGeneratorService {
  /**
   * Generate a PDF buffer from a story entity
   */
  abstract generatePdf(
    story: Story,
    coverImageBuffer?: Buffer | null,
    chapterImages?: Map<number, Buffer>
  ): Promise<Buffer>
}
