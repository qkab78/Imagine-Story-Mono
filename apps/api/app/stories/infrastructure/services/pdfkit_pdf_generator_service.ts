import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import PDFDocument from 'pdfkit'
import type { Story } from '#stories/domain/entities/story.entity'
import { IPdfGeneratorService } from '#stories/domain/services/i_pdf_generator_service'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FONTS_DIR = join(__dirname, '../../../../resources/fonts')

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
  }

  private static readonly RTL_LANGUAGES = ['ar']

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

      // Register Noto Sans fonts for multi-script support
      doc.registerFont('NotoSans', join(FONTS_DIR, 'NotoSans-Regular.ttf'))
      doc.registerFont('NotoSans-Bold', join(FONTS_DIR, 'NotoSans-Bold.ttf'))
      doc.registerFont('NotoSansArabic', join(FONTS_DIR, 'NotoSansArabic-Regular.ttf'))
      doc.registerFont('NotoSansArabic-Bold', join(FONTS_DIR, 'NotoSansArabic-Bold.ttf'))
      doc.registerFont('NotoSansJP', join(FONTS_DIR, 'NotoSansJP-Regular.ttf'))
      doc.registerFont('NotoSansJP-Bold', join(FONTS_DIR, 'NotoSansJP-Bold.ttf'))

      // Cover page
      this.renderCoverPage(doc, story, coverImageBuffer)

      // Chapters
      const chapters = story.getAllChapters()
      for (const chapter of chapters) {
        doc.addPage()
        this.renderChapterPage(
          doc,
          story,
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

  private isRtl(story: Story): boolean {
    return PdfkitPdfGeneratorService.RTL_LANGUAGES.includes(story.language.code.toLowerCase())
  }

  private getContentFont(text: string, bold: boolean): string {
    const hasArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)
    if (hasArabic) return bold ? 'NotoSansArabic-Bold' : 'NotoSansArabic'
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text)
    if (hasJapanese) return bold ? 'NotoSansJP-Bold' : 'NotoSansJP'
    return bold ? 'NotoSans-Bold' : 'NotoSans'
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
        const imgSize = this.getImageSize(doc, coverImageBuffer)
        const scale = Math.min(imageMaxWidth / imgSize.width, maxHeight / imgSize.height, 1)
        const displayWidth = imgSize.width * scale
        const displayHeight = imgSize.height * scale
        const imageX = MARGIN + (contentWidth - displayWidth) / 2
        const imageY = MARGIN + 40
        doc.image(coverImageBuffer, imageX, imageY, {
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
      .font(this.getContentFont(story.title, true))
      .fontSize(32)
      .fillColor(textPrimary)
      .text(story.title, MARGIN, titleY, {
        align: 'center',
        width: contentWidth,
      })

    // Decorative line (positioned after title, accounting for multi-line wrapping)
    const lineY = doc.y + 20
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
      const synopsisAlign = this.isRtl(story) ? 'right' : 'center'
      doc
        .font(this.getContentFont(story.synopsis, false))
        .fontSize(14)
        .fillColor(primary)
        .text(story.synopsis, MARGIN, lineY + 30, {
          align: synopsisAlign,
          width: contentWidth,
        })
    }

    // Footer — always Latin
    doc
      .font('NotoSans')
      .fontSize(10)
      .fillColor(PdfkitPdfGeneratorService.COLORS.muted)
      .text('Imagine Story', MARGIN, PAGE_HEIGHT - MARGIN - 20, {
        align: 'center',
        width: contentWidth,
      })
  }

  private renderChapterPage(
    doc: PDFKit.PDFDocument,
    story: Story,
    title: string,
    content: string,
    position: number,
    imageBuffer?: Buffer | null
  ): void {
    const { MARGIN, PAGE_WIDTH } = PdfkitPdfGeneratorService
    const { textPrimary, primary, muted } = PdfkitPdfGeneratorService.COLORS
    const contentWidth = PAGE_WIDTH - 2 * MARGIN

    // Chapter number — always Latin
    doc
      .font('NotoSans')
      .fontSize(12)
      .fillColor(muted)
      .text(`Chapter ${position}`, MARGIN, MARGIN, {
        align: 'center',
        width: contentWidth,
      })

    // Chapter title
    doc
      .font(this.getContentFont(title, true))
      .fontSize(22)
      .fillColor(primary)
      .text(title, MARGIN, MARGIN + 25, {
        align: 'center',
        width: contentWidth,
      })

    let currentY = doc.y + 20

    // Chapter image in rounded rectangle
    if (imageBuffer) {
      try {
        const imgSize = this.getImageSize(doc, imageBuffer)
        const displayWidth = contentWidth
        const displayHeight = (imgSize.height / imgSize.width) * displayWidth
        const imageX = MARGIN
        const radius = 8

        // Draw rounded clipping rectangle
        doc.save()
        doc.roundedRect(imageX, currentY, displayWidth, displayHeight, radius).clip()
        doc.image(imageBuffer, imageX, currentY, {
          width: displayWidth,
          height: displayHeight,
        })
        doc.restore()

        currentY += displayHeight + 20
      } catch {
        // Skip image if it can't be rendered
      }
    }

    // Content
    const paragraphs = content.split('\n\n').filter((p) => p.trim())
    currentY += 10
    const textAlign = this.isRtl(story) ? 'right' : 'justify'

    doc.font(this.getContentFont(content, false)).fontSize(12).fillColor(textPrimary)

    for (const paragraph of paragraphs) {
      doc.text(paragraph.trim(), MARGIN, currentY, {
        width: contentWidth,
        lineGap: 6,
        align: textAlign,
      })
      currentY = doc.y + 12
    }
  }

  private getImageSize(
    doc: PDFKit.PDFDocument,
    imageBuffer: Buffer
  ): { width: number; height: number } {
    const pdfImage = (doc as any).openImage(imageBuffer)
    return { width: pdfImage.width, height: pdfImage.height }
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

    // "The End" title — always Latin
    doc
      .font('NotoSans-Bold')
      .fontSize(24)
      .fillColor(primary)
      .text('The End', MARGIN, MARGIN + 40, {
        align: 'center',
        width: contentWidth,
      })

    // Conclusion text
    doc
      .font(this.getContentFont(conclusion, false))
      .fontSize(13)
      .fillColor(textPrimary)
      .text(conclusion, MARGIN, doc.y + 30, {
        width: contentWidth,
        lineGap: 6,
        align: 'center',
      })
  }
}
