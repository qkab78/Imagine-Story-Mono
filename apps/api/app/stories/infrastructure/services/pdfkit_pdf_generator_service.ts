import PDFDocument from 'pdfkit'
import type { Story } from '#stories/domain/entities/story.entity'
import { IPdfGeneratorService } from '#stories/domain/services/i_pdf_generator_service'

/**
 * PDFKit-based PDF Generator Service
 *
 * Generates a styled PDF from a Story entity with:
 * - Cover page with title and cover image
 * - One page per chapter with title and content
 */
export class PdfkitPdfGeneratorService extends IPdfGeneratorService {
  private static readonly COLORS = {
    textPrimary: '#1F3D2B',
    primary: '#2F6B4F',
    accent: '#F6C177',
    muted: '#8BA598',
    background: '#FFF8F0',
  }

  private static readonly MARGIN = 60
  private static readonly PAGE_WIDTH = 612 // US Letter
  private static readonly PAGE_HEIGHT = 792

  async generatePdf(
    story: Story,
    coverImageBuffer?: Buffer | null,
    chapterImages?: Map<number, Buffer>
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: {
          top: PdfkitPdfGeneratorService.MARGIN,
          bottom: PdfkitPdfGeneratorService.MARGIN,
          left: PdfkitPdfGeneratorService.MARGIN,
          right: PdfkitPdfGeneratorService.MARGIN,
        },
        info: {
          Title: story.title,
          Author: 'Imagine Story',
        },
      })

      const chunks: Buffer[] = []
      doc.on('data', (chunk: Buffer) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Cover page
      this.renderCoverPage(doc, story, coverImageBuffer)

      // Chapters
      const chapters = story.getAllChapters()
      for (const chapter of chapters) {
        doc.addPage()
        this.renderChapterPage(
          doc,
          chapter.title,
          chapter.content,
          chapter.getPosition(),
          chapterImages?.get(chapter.getPosition())
        )
      }

      // Conclusion page (if present)
      if (story.conclusion) {
        doc.addPage()
        this.renderConclusionPage(doc, story.conclusion)
      }

      doc.end()
    })
  }

  private renderCoverPage(
    doc: PDFKit.PDFDocument,
    story: Story,
    coverImageBuffer?: Buffer | null
  ): void {
    const { MARGIN, PAGE_WIDTH, PAGE_HEIGHT } = PdfkitPdfGeneratorService
    const { textPrimary, primary, accent } = PdfkitPdfGeneratorService.COLORS
    const contentWidth = PAGE_WIDTH - 2 * MARGIN

    // Cover image
    let coverImageBottom = 0
    if (coverImageBuffer) {
      try {
        const imageMaxWidth = contentWidth * 0.7
        const maxHeight = 300
        const pdfImage = doc.openImage(coverImageBuffer)
        const scale = Math.min(imageMaxWidth / pdfImage.width, maxHeight / pdfImage.height, 1)
        const displayWidth = pdfImage.width * scale
        const displayHeight = pdfImage.height * scale
        const imageX = MARGIN + (contentWidth - displayWidth) / 2
        const imageY = MARGIN + 40
        doc.image(pdfImage, imageX, imageY, {
          width: displayWidth,
          height: displayHeight,
        })
        coverImageBottom = imageY + displayHeight
      } catch {
        // Skip image if it can't be rendered
      }
    }

    // Title
    const titleY = coverImageBottom > 0 ? coverImageBottom + 30 : PAGE_HEIGHT / 2 - 60
    doc
      .font('Helvetica-Bold')
      .fontSize(32)
      .fillColor(textPrimary)
      .text(story.title, MARGIN, titleY, {
        align: 'center',
        width: contentWidth,
      })

    // Decorative line
    const lineY = titleY + 60
    const lineWidth = 80
    const lineX = PAGE_WIDTH / 2 - lineWidth / 2
    doc
      .moveTo(lineX, lineY)
      .lineTo(lineX + lineWidth, lineY)
      .strokeColor(accent)
      .lineWidth(3)
      .stroke()

    // Synopsis
    if (story.synopsis) {
      doc
        .font('Helvetica')
        .fontSize(14)
        .fillColor(primary)
        .text(story.synopsis, MARGIN, lineY + 30, {
          align: 'center',
          width: contentWidth,
        })
    }

    // Footer
    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor(PdfkitPdfGeneratorService.COLORS.muted)
      .text('Imagine Story', MARGIN, PAGE_HEIGHT - MARGIN - 20, {
        align: 'center',
        width: contentWidth,
      })
  }

  private renderChapterPage(
    doc: PDFKit.PDFDocument,
    title: string,
    content: string,
    position: number,
    imageBuffer?: Buffer | null
  ): void {
    const { MARGIN, PAGE_WIDTH } = PdfkitPdfGeneratorService
    const { textPrimary, primary, muted } = PdfkitPdfGeneratorService.COLORS
    const contentWidth = PAGE_WIDTH - 2 * MARGIN

    // Chapter number
    doc
      .font('Helvetica')
      .fontSize(12)
      .fillColor(muted)
      .text(`Chapter ${position}`, MARGIN, MARGIN, {
        align: 'center',
        width: contentWidth,
      })

    // Chapter title
    doc
      .font('Helvetica-Bold')
      .fontSize(22)
      .fillColor(primary)
      .text(title, MARGIN, MARGIN + 25, {
        align: 'center',
        width: contentWidth,
      })

    let currentY = doc.y + 20

    // Chapter image
    if (imageBuffer) {
      try {
        const imageMaxWidth = contentWidth * 0.6
        const maxHeight = 250
        const pdfImage = doc.openImage(imageBuffer)
        const scale = Math.min(imageMaxWidth / pdfImage.width, maxHeight / pdfImage.height, 1)
        const displayWidth = pdfImage.width * scale
        const displayHeight = pdfImage.height * scale
        const imageX = MARGIN + (contentWidth - displayWidth) / 2
        doc.image(pdfImage, imageX, currentY, {
          width: displayWidth,
          height: displayHeight,
        })
        currentY += displayHeight + 20
      } catch {
        // Skip image if it can't be rendered
      }
    }

    // Content
    const paragraphs = content.split('\n\n').filter((p) => p.trim())
    currentY += 10

    doc.font('Helvetica').fontSize(12).fillColor(textPrimary)

    for (const paragraph of paragraphs) {
      doc.text(paragraph.trim(), MARGIN, currentY, {
        width: contentWidth,
        lineGap: 6,
        align: 'justify',
      })
      currentY = doc.y + 12
    }
  }

  private renderConclusionPage(doc: PDFKit.PDFDocument, conclusion: string): void {
    const { MARGIN, PAGE_WIDTH } = PdfkitPdfGeneratorService
    const { textPrimary, primary, accent } = PdfkitPdfGeneratorService.COLORS
    const contentWidth = PAGE_WIDTH - 2 * MARGIN

    // Decorative line
    const lineWidth = 60
    const lineX = PAGE_WIDTH / 2 - lineWidth / 2
    doc
      .moveTo(lineX, MARGIN + 20)
      .lineTo(lineX + lineWidth, MARGIN + 20)
      .strokeColor(accent)
      .lineWidth(3)
      .stroke()

    // "The End" title
    doc
      .font('Helvetica-Bold')
      .fontSize(24)
      .fillColor(primary)
      .text('The End', MARGIN, MARGIN + 40, {
        align: 'center',
        width: contentWidth,
      })

    // Conclusion text
    doc
      .font('Helvetica')
      .fontSize(13)
      .fillColor(textPrimary)
      .text(conclusion, MARGIN, doc.y + 30, {
        width: contentWidth,
        lineGap: 6,
        align: 'center',
      })
  }
}
