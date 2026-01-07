import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import { GoogleGenAI } from '@google/genai'
import env from '#start/env'
import { IStoryImageGenerationService } from '#stories/domain/services/IStoryImageGenerationService'
import type {
  ImageGenerationContext,
  ChapterContent,
  ChapterImagesGenerationResponse,
  CharacterReferenceResult,
  ChapterImageResult,
} from '#stories/domain/services/types/ImageGenerationTypes'
import { IStorageService } from '#stories/domain/services/IStorageService'

/**
 * Service de génération d'images utilisant Google Gemini Imagen 3 (Nano Banana)
 *
 * Implémente IStoryImageGenerationService avec:
 * - Gemini 2.5 Flash Image (Nano Banana) pour génération rapide
 * - Génération parallèle des images de chapitres
 * - Pas de support character reference (Gemini ne supporte pas les init images comme Leonardo AI)
 * - Images haute qualité avec SynthID watermark
 */
@inject()
export class GeminiImageGenerationService extends IStoryImageGenerationService {
  private readonly client: GoogleGenAI

  // Configuration Gemini Imagen
  private readonly MODEL_NAME = 'gemini-3-pro-image-preview' // Nano Banana
  private readonly ASPECT_RATIO = '1:1'
  private readonly IMAGE_SIZE = '1K' // 1024x1024 pour qualité optimale
  private readonly MAX_RETRIES = 3
  private readonly RETRY_DELAY_MS = 2000

  constructor(private readonly storageService: IStorageService) {
    super()
    this.client = new GoogleGenAI({
      apiKey: env.get('GEMINI_API_KEY'),
    })
  }

  /**
   * Génère l'image de couverture avec Gemini Imagen 3
   */
  async generateCoverImage(
    context: ImageGenerationContext,
    _characterReference?: CharacterReferenceResult
  ): Promise<string> {
    try {
      logger.info('🖼️ Génération image de couverture avec Gemini Imagen 3 (Nano Banana)...')

      const coverPrompt = this.buildCoverPrompt(context)
      logger.info(`🎨 Génération couverture pour: ${context.title}`)

      // Générer l'image avec Gemini
      const imageData = await this.generateImageWithRetry(coverPrompt)

      // Sauvegarder l'image
      const coverFileName = `${context.slug}.png`
      const coverPath = await this.saveImageFromBase64(
        imageData,
        `covers/${coverFileName}`,
        'image/png'
      )

      logger.info('✅ Image de couverture Gemini Imagen créée')
      return coverPath
    } catch (error: any) {
      logger.error('❌ Erreur génération couverture Gemini:', error)
      throw new Error(`Cover image generation failed: ${error.message}`)
    }
  }

  /**
   * Génère toutes les images des chapitres en parallèle
   */
  async generateChapterImages(
    context: ImageGenerationContext,
    chapters: ChapterContent[],
    _characterReference?: CharacterReferenceResult
  ): Promise<ChapterImagesGenerationResponse> {
    const chapterImages: ChapterImageResult[] = []
    const errors: string[] = []
    let successfulGeneration = 0

    logger.info('🎨 Génération avec Gemini Imagen 3 - Génération parallèle')

    const parallelStartTime = Date.now()
    logger.info(`🚀 Génération parallèle de ${chapters.length} images de chapitres...`)

    const generationPromises = chapters.map((chapter) =>
      this.generateSingleChapterImage(context, chapter)
        .then((result) => {
          if (result) {
            return { success: true, result, index: chapter.index }
          }
          return {
            success: false,
            result: null,
            index: chapter.index,
            error: 'Aucune image générée',
          }
        })
        .catch((error: any) => {
          logger.error(`❌ Erreur génération chapitre ${chapter.index + 1}:`, error.message)
          errors.push(`Chapitre ${chapter.index + 1}: ${error.message}`)
          return { success: false, result: null, index: chapter.index, error: error.message }
        })
    )

    // Attendre que toutes les générations se terminent
    const results = await Promise.all(generationPromises)

    // Traiter les résultats
    results.forEach((result) => {
      if (result.success && result.result) {
        chapterImages.push(result.result)
        successfulGeneration++
      }
    })

    const parallelEndTime = Date.now()
    const generationTimeMs = parallelEndTime - parallelStartTime

    logger.info(`✅ ${successfulGeneration}/${chapters.length} images de chapitres générées`)

    return {
      images: chapterImages,
      metadata: {
        successfulGeneration,
        totalChapters: chapters.length,
        errors,
        generationTimeMs,
      },
    }
  }

  /**
   * Gemini ne supporte pas les character references (init images)
   * Retourne undefined pour indiquer que cette fonctionnalité n'est pas disponible
   */
  async createCharacterReference(
    _context: ImageGenerationContext
  ): Promise<CharacterReferenceResult | undefined> {
    logger.info(
      'ℹ️ Gemini Imagen ne supporte pas les character references - mode text-to-image uniquement'
    )
    return undefined
  }

  /**
   * Teste la connexion à Gemini
   */
  async testConnection(): Promise<boolean> {
    try {
      // Test simple: générer une petite image test
      const testPrompt = 'A simple test image: a small blue circle on white background'
      await this.generateImageWithRetry(testPrompt)
      logger.info('✅ Connexion Gemini Imagen réussie')
      return true
    } catch (error) {
      logger.error('❌ Erreur connexion Gemini Imagen:', error)
      return false
    }
  }

  /**
   * Retourne le nom du provider
   */
  getProviderName(): string {
    return 'Gemini Imagen 3 (Nano Banana)'
  }

  /**
   * Génère une image pour un seul chapitre
   * @private
   */
  private async generateSingleChapterImage(
    context: ImageGenerationContext,
    chapter: ChapterContent
  ): Promise<ChapterImageResult | null> {
    try {
      logger.info(`📋 Génération image chapitre ${chapter.index + 1}: ${chapter.title}`)

      const chapterPrompt = this.buildChapterPrompt(context, chapter)

      // Générer l'image
      const imageData = await this.generateImageWithRetry(chapterPrompt)

      // Sauvegarder l'image
      const chapterFileName = `${context.slug}_chapter_${chapter.index + 1}.png`
      const chapterImagePath = await this.saveImageFromBase64(
        imageData,
        `chapters/${chapterFileName}`,
        'image/png'
      )

      logger.info(`✅ Image chapitre ${chapter.index + 1} générée`)

      return {
        chapterIndex: chapter.index,
        imagePath: chapterImagePath,
        chapterTitle: chapter.title,
      }
    } catch (error: any) {
      logger.error(`❌ Erreur génération chapitre ${chapter.index + 1}:`, error.message)
      throw error
    }
  }

  /**
   * Génère une image avec Gemini et retry logic
   * @private
   */
  private async generateImageWithRetry(
    prompt: string,
    retries = this.MAX_RETRIES
  ): Promise<string> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.client.models.generateContent({
          model: this.MODEL_NAME,
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          config: {
            responseModalities: ['IMAGE'],
            imageConfig: {
              aspectRatio: this.ASPECT_RATIO,
              imageSize: this.IMAGE_SIZE,
            },
          },
        })

        // Extraire l'image base64 de la réponse
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData?.data) {
              // Retourner les données base64 directement
              return part.inlineData.data
            }
          }
        }

        throw new Error('Aucune image trouvée dans la réponse Gemini')
      } catch (error: any) {
        lastError = error
        logger.warn(`⚠️ Tentative ${attempt}/${retries} échouée:`, error.message)

        if (attempt < retries) {
          logger.info(`🔄 Nouvelle tentative dans ${this.RETRY_DELAY_MS}ms...`)
          await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY_MS))
        }
      }
    }

    throw new Error(
      `Gemini image generation failed after ${retries} attempts: ${lastError?.message}`
    )
  }

  /**
   * Sauvegarde une image base64 via le storage service
   * @private
   */
  private async saveImageFromBase64(
    base64Data: string,
    destinationPath: string,
    contentType: string
  ): Promise<string> {
    try {
      logger.info(`📥 Sauvegarde image: ${destinationPath}`)

      // Convertir base64 en Buffer
      const imageBuffer = Buffer.from(base64Data, 'base64')

      // Upload via le storage service
      const result = await this.storageService.upload(destinationPath, imageBuffer, {
        contentType,
      })

      logger.info(`✅ Image sauvegardée: ${result.path}`)
      return result.path
    } catch (error: any) {
      logger.error(`❌ Erreur sauvegarde image ${destinationPath}:`, error)
      throw new Error(`Image save failed: ${error.message}`)
    }
  }

  /**
   * Construit le prompt pour l'image de couverture
   * @private
   */
  private buildCoverPrompt(context: ImageGenerationContext): string {
    const characterDescription = this.getCharacterDescription(context)

    return `Create a professional children's book cover illustration with the following details:

MAIN CHARACTER (CRITICAL - MEMORIZE THESE EXACT DETAILS):
${characterDescription}

This character design is ICONIC and must be INSTANTLY RECOGNIZABLE. Every visual detail described above is essential and must appear EXACTLY as specified in all future illustrations.

Main Scene:
- The character is prominently featured in the center of the composition, taking up 60-70% of the image
- Full-body view showing all distinctive features, clothing, and accessories
- The character should have a welcoming, engaging expression directly facing the viewer
- Background: Beautiful ${context.theme} environment that sets the story's atmosphere

Story Context:
- Title theme: "${context.title}"
- Synopsis: ${context.synopsis}
- Tone: ${context.tone}

Visual Style & Technical Specifications:
- Art style: Modern children's book illustration with soft painted textures
- Rendering: Slightly stylized but with realistic proportions and lighting
- Color palette: Warm, vibrant colors with high saturation - avoid muted or pastel tones
- Lighting: Soft, even front lighting (like golden hour sunlight) that illuminates the character clearly
- Perspective: Straight-on view at eye level with the character
- Texture: Smooth digital painting style with subtle brushwork visible
- Line quality: Clean outlines with consistent thickness
- Shadow style: Soft, natural shadows that enhance depth without darkening the mood
- Age-appropriate: Designed specifically for ${context.childAge}-year-old children

Composition Guidelines:
- Main character in foreground (sharp focus, maximum detail)
- Background elements slightly softer but still detailed
- Leave space at the top 20% for title text overlay
- Ensure character's distinctive features (clothing, colors, accessories) are clearly visible
- Frame the character to show personality and approachability

Consistency Requirements:
This is the REFERENCE IMAGE for the entire story series. The character's appearance, clothing, colors, and distinctive features established in this image MUST remain identical in all subsequent chapter illustrations.

Important: Generate only the visual cover scene without any text, titles, or words in the image. Focus on creating an engaging, memorable character design that will be instantly recognizable throughout the story.`
  }

  /**
   * Construit le prompt pour une image de chapitre
   * @private
   */
  private buildChapterPrompt(context: ImageGenerationContext, chapter: ChapterContent): string {
    const characterDescription = this.getCharacterDescription(context)
    const contentPreview = chapter.content.substring(0, 500)

    return `Create a children's book illustration for chapter ${chapter.index + 1} of ${context.numberOfChapters}:

Chapter Title: "${chapter.title}"

CRITICAL CHARACTER CONSISTENCY - USE EXACT SAME APPEARANCE:
${characterDescription}

⚠️ MANDATORY: The character MUST have EXACTLY the same appearance as in the previous illustrations:
- IDENTICAL facial features, eye color, and expression style
- EXACT SAME clothing, colors, and accessories (no variations or changes)
- SAME proportions, height, and body shape
- SAME distinctive features and characteristics
- The character should be INSTANTLY recognizable as the same character from the cover

Chapter Scene:
${contentPreview}

Scene Composition:
- The main character is clearly visible and central to the action (minimum 40% of image)
- Show the character actively participating in this chapter's key moment
- Background: ${context.theme} environment matching the chapter's setting
- Camera angle: Eye-level perspective with the character
- Ensure the character's distinctive clothing and features are clearly visible

Visual Style & Technical Specifications (MUST MATCH COVER):
- Art style: Modern children's book illustration with soft painted textures
- Rendering: Slightly stylized but with realistic proportions and lighting
- Color palette: Warm, vibrant colors with high saturation - consistent with cover image
- Lighting: Soft, even lighting that keeps the scene bright and inviting
- Texture: Smooth digital painting style with subtle brushwork
- Line quality: Clean outlines with consistent thickness
- Shadow style: Soft, natural shadows
- Tone: ${context.tone}
- Age-appropriate: Designed specifically for ${context.childAge}-year-old children

Story Continuity Requirements:
- This is chapter ${chapter.index + 1} of "${context.title}"
- Visual style MUST be identical to the cover illustration
- Character appearance MUST be identical to previous chapters
- Overall theme: ${context.theme}
- Maintain the same artistic technique and rendering quality

Character Appearance Checklist:
✓ Same face and facial features
✓ Same clothing and colors
✓ Same accessories and distinctive elements
✓ Same proportions and size
✓ Same art style and rendering technique

Important: Generate only the visual scene without any text in the image. The character must look EXACTLY the same as in previous illustrations - this is absolutely critical for story continuity. Focus on telling this chapter's story while maintaining perfect visual consistency with the established character design.`
  }

  /**
   * Construit une description détaillée du personnage pour garantir la cohérence visuelle
   * @private
   */
  private buildDetailedCharacterDescription(context: ImageGenerationContext): string {
    const { protagonist, species, childAge, theme, tone } = context

    // Templates de description détaillée par espèce
    const speciesTemplates: Record<string, string> = {
      human: `${protagonist}, a ${childAge}-year-old child with bright, expressive eyes, rosy cheeks, and a warm friendly smile. ${protagonist} has medium-length brown hair, fair skin, and wears a distinctive red and blue striped shirt with comfortable denim overalls. ${protagonist} is of average height for their age, with a curious and adventurous expression`,

      cat: `${protagonist}, a ${childAge}-year-old anthropomorphic cat with soft orange and white striped fur, large emerald green eyes, and distinctive white whiskers. ${protagonist} has a small pink nose, pointed triangular ears with white tufts, and wears a charming blue vest over a white shirt. ${protagonist} stands upright on two legs and has a long, expressive striped tail`,

      dog: `${protagonist}, a ${childAge}-year-old anthropomorphic dog with golden-brown floppy ears, warm brown eyes, and a friendly wagging tail. ${protagonist} has soft beige fur, a black button nose, and wears a distinctive red collar with a golden tag. ${protagonist} stands on two legs and wears a comfortable green jacket with brown patches on the elbows`,

      rabbit: `${protagonist}, a ${childAge}-year-old anthropomorphic rabbit with fluffy white fur, long upright ears with pink inner lining, and bright blue eyes. ${protagonist} has a small twitching pink nose, white whiskers, and wears a distinctive purple vest with golden buttons. ${protagonist} stands upright with small pink paws and a fluffy cotton-ball tail`,

      bear: `${protagonist}, a ${childAge}-year-old anthropomorphic bear with thick brown fur, small round ears, and gentle dark eyes. ${protagonist} has a distinctive cream-colored snout, a black nose, and wears a cozy red knitted sweater with a white collar. ${protagonist} is slightly chubby with a friendly, warm demeanor and stands on two legs`,

      mouse: `${protagonist}, a ${childAge}-year-old anthropomorphic mouse with soft gray fur, large round ears, and big expressive brown eyes. ${protagonist} has a small pink nose, delicate whiskers, and wears a distinctive yellow raincoat with red buttons. ${protagonist} is small and nimble, standing upright with a long thin tail`,
    }

    // Obtenir le template de base ou créer une description générique
    const baseDescription =
      speciesTemplates[species.toLowerCase()] ||
      `${protagonist}, a ${childAge}-year-old ${species} with distinctive features, expressive eyes, and a friendly demeanor. ${protagonist} wears characteristic clothing that makes them instantly recognizable`

    // Ajuster la description selon le ton et le thème
    let enhancedDescription = baseDescription

    // Ajout de détails basés sur le ton
    if (tone.toLowerCase().includes('adventurous') || tone.toLowerCase().includes('exciting')) {
      enhancedDescription += '. Their eyes sparkle with curiosity and determination'
    } else if (tone.toLowerCase().includes('calm') || tone.toLowerCase().includes('peaceful')) {
      enhancedDescription += '. They have a serene and gentle expression'
    } else if (tone.toLowerCase().includes('joyful') || tone.toLowerCase().includes('happy')) {
      enhancedDescription += '. They radiate warmth and infectious joy'
    }

    // Ajout de détails basés sur le thème
    if (theme.toLowerCase().includes('magic') || theme.toLowerCase().includes('fantasy')) {
      enhancedDescription += ', and carries a small mystical charm that glows softly'
    } else if (theme.toLowerCase().includes('nature') || theme.toLowerCase().includes('forest')) {
      enhancedDescription += ', and wears natural elements like a leaf crown or flower accessories'
    } else if (theme.toLowerCase().includes('space') || theme.toLowerCase().includes('cosmic')) {
      enhancedDescription += ', and wears a small star-shaped badge that shimmers'
    }

    return enhancedDescription
  }

  /**
   * Retourne la description cohérente du personnage
   * @private
   */
  private getCharacterDescription(context: ImageGenerationContext): string {
    return this.buildDetailedCharacterDescription(context)
  }
}
