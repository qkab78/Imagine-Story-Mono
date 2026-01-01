import { inject } from '@adonisjs/core'
import { Leonardo } from '@leonardo-ai/sdk'
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
 * Service de génération d'images utilisant Leonardo AI
 *
 * Implémente IStoryImageGenerationService avec support des fonctionnalités avancées:
 * - Init images pour cohérence des personnages
 * - Character reference sheets
 * - Génération parallèle des images de chapitres
 * - Seeds déterministes pour reproductibilité
 */
@inject()
export class LeonardoAiImageGenerationService extends IStoryImageGenerationService {
  private readonly leonardo: Leonardo

  // Configuration Leonardo AI
  private readonly MODEL_ID = 'aa77f04e-3eec-4034-9c07-d0f619684628'
  private readonly PRESET_STYLE = 'ANIME' as any
  private readonly COVER_GUIDANCE_SCALE = 8
  private readonly CHAPTER_GUIDANCE_SCALE = 7
  private readonly COVER_INIT_STRENGTH = 0.3
  private readonly CHAPTER_INIT_STRENGTH = 0.4
  private readonly IMAGE_SIZE = 1024
  private readonly MAX_WAIT_TIME_MS = 120000 // 2 minutes
  private readonly POLL_INTERVAL_MS = 2000

  constructor(private readonly storageService: IStorageService) {
    super()
    this.leonardo = new Leonardo({
      bearerAuth: env.get('LEONARDO_AI_API_KEY'),
    })
  }

  /**
   * Génère l'image de couverture avec Leonardo AI
   */
  async generateCoverImage(
    context: ImageGenerationContext,
    characterReference?: CharacterReferenceResult
  ): Promise<string> {
    try {
      console.log('🖼️ Génération image de couverture avec Leonardo AI...')

      const characterSeed = characterReference?.seed ?? this.generateCharacterSeed(context)
      const initImageId = characterReference?.referenceId

      if (initImageId) {
        console.log(`🎨 Utilisation init image ID pour cohérence: ${initImageId}`)
      }

      const coverPrompt = this.buildCoverPrompt(context)

      console.log(`🎭 Génération couverture avec seed: ${characterSeed}`)

      const generationParams: any = {
        prompt: coverPrompt,
        modelId: this.MODEL_ID,
        width: this.IMAGE_SIZE,
        height: this.IMAGE_SIZE,
        numImages: 1,
        guidanceScale: this.COVER_GUIDANCE_SCALE,
        seed: characterSeed,
        presetStyle: this.PRESET_STYLE,
      }

      // Mode image-to-image si init image fournie
      if (initImageId) {
        generationParams.initImageId = initImageId
        generationParams.initStrength = this.COVER_INIT_STRENGTH
        console.log(`🔄 Mode image-to-image activé (strength: ${this.COVER_INIT_STRENGTH})`)
      }

      const response = await this.leonardo.image.createGeneration(generationParams)
      const generationId = (response as any).object?.sdGenerationJob?.generationId

      if (!generationId) {
        throw new Error("Pas d'ID de génération pour l'image de couverture")
      }

      console.log(`⏳ Attente génération couverture: ${generationId}`)
      const generatedImages = await this.waitForGeneration(generationId)

      if (!generatedImages || generatedImages.length === 0) {
        throw new Error('Aucune image de couverture générée')
      }

      const coverImageUrl = generatedImages[0].url
      if (!coverImageUrl) {
        throw new Error('URL manquante pour image de couverture')
      }

      // Sauvegarder l'image de couverture
      const coverFileName = `${context.slug}.webp`
      const coverPath = await this.downloadAndSaveImage(
        coverImageUrl,
        `covers/${coverFileName}`,
        'image/webp'
      )

      console.log('✅ Image de couverture Leonardo AI créée')
      return coverPath
    } catch (error: any) {
      console.error('❌ Erreur génération couverture Leonardo AI:', error)
      throw new Error(`Cover image generation failed: ${error.message}`)
    }
  }

  /**
   * Génère toutes les images des chapitres en parallèle
   */
  async generateChapterImages(
    context: ImageGenerationContext,
    chapters: ChapterContent[],
    characterReference?: CharacterReferenceResult
  ): Promise<ChapterImagesGenerationResponse> {
    const chapterImages: ChapterImageResult[] = []
    const errors: string[] = []
    let successfulGeneration = 0

    console.log('🎨 Génération avec Leonardo AI - Stratégie de cohérence des personnages')

    const characterSeed = characterReference?.seed ?? this.generateCharacterSeed(context)
    const initImageId = characterReference?.referenceId

    if (initImageId) {
      console.log(`🎨 Utilisation init image ID pour tous les chapitres: ${initImageId}`)
    }

    // Génération parallèle pour réduire le temps de traitement
    const parallelStartTime = Date.now()
    console.log(`🚀 Génération parallèle de ${chapters.length} images de chapitres...`)

    const generationPromises = chapters.map((chapter) =>
      this.generateSingleChapterImage(context, chapter, characterSeed, initImageId)
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
          console.error(`❌ Erreur génération chapitre ${chapter.index + 1}:`, error.message)
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

    console.log(`✅ ${successfulGeneration}/${chapters.length} images de chapitres générées`)

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
   * Crée une référence de personnage pour cohérence visuelle
   */
  async createCharacterReference(
    context: ImageGenerationContext
  ): Promise<CharacterReferenceResult> {
    try {
      console.log('🎨 Création character reference sheet avec Leonardo AI...')

      const characterSeed = this.generateCharacterSeed(context)
      const referencePrompt = this.buildCharacterReferencePrompt(context)

      console.log(`🎭 Génération personnage de référence avec seed: ${characterSeed}`)

      const response = await this.leonardo.image.createGeneration({
        prompt: referencePrompt,
        modelId: this.MODEL_ID,
        width: this.IMAGE_SIZE,
        height: this.IMAGE_SIZE,
        numImages: 1,
        guidanceScale: this.COVER_GUIDANCE_SCALE,
        seed: characterSeed,
        presetStyle: this.PRESET_STYLE,
      })

      const generationId = (response as any).object?.sdGenerationJob?.generationId
      if (!generationId) {
        throw new Error("Pas d'ID pour l'image de référence")
      }

      console.log(`⏳ Attente génération référence: ${generationId}`)
      const generatedImages = await this.waitForGeneration(generationId)

      if (!generatedImages || generatedImages.length === 0) {
        throw new Error('Aucune image de référence générée')
      }

      const referenceImageUrl = generatedImages[0].url
      if (!referenceImageUrl) {
        throw new Error('URL manquante pour image de référence')
      }

      // Sauvegarder l'image de référence
      const referenceFileName = `${context.slug}_character_reference.png`
      const referenceImagePath = await this.downloadAndSaveImage(
        referenceImageUrl,
        `references/${referenceFileName}`,
        'image/png'
      )

      // Upload vers Leonardo AI pour obtenir l'init image ID
      const referenceImageStorageUrl = await this.storageService.getUrl(referenceImagePath)
      const initImageId = await this.uploadCharacterReference(
        referenceImageStorageUrl,
        context.protagonist
      )

      console.log(`✅ Character reference créée avec init image ID: ${initImageId}`)

      return {
        referenceImagePath,
        referenceId: initImageId,
        seed: characterSeed,
      }
    } catch (error: any) {
      console.error('❌ Erreur création character reference:', error)
      throw new Error(`Character reference creation failed: ${error.message}`)
    }
  }

  /**
   * Teste la connexion à Leonardo AI
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.leonardo.user.getUserSelf()
      console.log(
        '✅ Connexion Leonardo AI réussie:',
        (response as any).user_details?.[0]?.user?.username || 'Utilisateur'
      )
      return true
    } catch (error) {
      console.error('❌ Erreur connexion Leonardo AI:', error)
      return false
    }
  }

  /**
   * Retourne le nom du provider
   */
  getProviderName(): string {
    return 'Leonardo AI'
  }

  /**
   * Génère une image pour un seul chapitre
   * @private
   */
  private async generateSingleChapterImage(
    context: ImageGenerationContext,
    chapter: ChapterContent,
    characterSeed: number,
    initImageId?: string
  ): Promise<ChapterImageResult | null> {
    try {
      console.log(`📋 Génération image chapitre ${chapter.index + 1}: ${chapter.title}`)

      const chapterPrompt = this.buildChapterPrompt(context, chapter)

      const generationParams: any = {
        prompt: chapterPrompt,
        modelId: this.MODEL_ID,
        width: this.IMAGE_SIZE,
        height: this.IMAGE_SIZE,
        numImages: 1,
        guidanceScale: this.CHAPTER_GUIDANCE_SCALE,
        seed: characterSeed,
        presetStyle: this.PRESET_STYLE,
      }

      // Mode image-to-image si init image fournie
      if (initImageId) {
        generationParams.initImageId = initImageId
        generationParams.initStrength = this.CHAPTER_INIT_STRENGTH
      }

      const response = await this.leonardo.image.createGeneration(generationParams)
      const generationId = (response as any).object?.sdGenerationJob?.generationId

      if (!generationId) {
        console.error(`❌ Pas d'ID pour chapitre ${chapter.index + 1}`)
        return null
      }

      const generatedImages = await this.waitForGeneration(generationId)

      if (!generatedImages || generatedImages.length === 0) {
        console.error(`❌ Aucune image générée pour chapitre ${chapter.index + 1}`)
        return null
      }

      const chapterImageUrl = generatedImages[0].url
      if (!chapterImageUrl) {
        console.error(`❌ URL manquante pour chapitre ${chapter.index + 1}`)
        return null
      }

      // Sauvegarder l'image du chapitre
      const chapterFileName = `${context.slug}_chapter_${chapter.index + 1}.webp`
      const chapterImagePath = await this.downloadAndSaveImage(
        chapterImageUrl,
        `chapters/${chapterFileName}`,
        'image/webp'
      )

      console.log(`✅ Image chapitre ${chapter.index + 1} générée`)

      return {
        chapterIndex: chapter.index,
        imagePath: chapterImagePath,
        chapterTitle: chapter.title,
      }
    } catch (error: any) {
      console.error(`❌ Erreur génération chapitre ${chapter.index + 1}:`, error.message)
      throw error
    }
  }

  /**
   * Upload une image de référence vers Leonardo AI
   * @private
   */
  private async uploadCharacterReference(
    characterImageUrl: string,
    characterName: string
  ): Promise<string> {
    try {
      console.log(`📤 Upload character reference vers Leonardo AI: ${characterName}`)

      // Télécharger l'image depuis l'URL
      const axios = (await import('axios')).default
      const response = await axios.get(characterImageUrl, {
        responseType: 'arraybuffer',
      })

      if (!response.data || response.data.length === 0) {
        throw new Error(`Failed to download image from ${characterImageUrl}`)
      }

      const imageBuffer = Buffer.from(response.data)

      // Upload vers Leonardo AI pour obtenir l'init image ID
      const uploadResult = await this.leonardo.initImages.uploadInitImage({
        extension: 'png',
        // @ts-ignore - Le SDK Leonardo AI accepte Buffer
        file: imageBuffer,
      })

      const initImageId = (uploadResult as any)?.uploadInitImage?.id

      if (!initImageId) {
        console.error('Leonardo AI upload response:', uploadResult)
        throw new Error('Failed to get init image ID from Leonardo AI')
      }

      console.log(`✅ Character reference uploaded, init image ID: ${initImageId}`)
      return initImageId
    } catch (error: any) {
      console.error('❌ Failed to upload character reference:', error.message)
      throw new Error(`Character reference upload failed: ${error.message}`)
    }
  }

  /**
   * Attend que Leonardo AI génère l'image
   * @private
   */
  private async waitForGeneration(generationId: string): Promise<any[]> {
    const startTime = Date.now()

    while (Date.now() - startTime < this.MAX_WAIT_TIME_MS) {
      try {
        const result = await this.leonardo.image.getGenerationById(generationId)
        const generation = (result as any).generations_by_pk

        if (generation?.status === 'COMPLETE') {
          return generation.generated_images || []
        }

        if (generation?.status === 'FAILED') {
          throw new Error('Leonardo AI generation failed')
        }

        // Attendre avant le prochain poll
        await new Promise((resolve) => setTimeout(resolve, this.POLL_INTERVAL_MS))
      } catch (error: any) {
        console.error('❌ Erreur polling Leonardo AI:', error.message)
        throw error
      }
    }

    throw new Error(`Timeout waiting for generation ${generationId}`)
  }

  /**
   * Télécharge et sauvegarde une image via le storage service
   * @private
   */
  private async downloadAndSaveImage(
    imageUrl: string,
    destinationPath: string,
    contentType: string
  ): Promise<string> {
    try {
      console.log(`📥 Téléchargement image: ${destinationPath}`)

      const result = await this.storageService.uploadFromUrl(imageUrl, destinationPath, {
        contentType,
      })

      console.log(`✅ Image sauvegardée: ${result.path}`)
      return result.path
    } catch (error: any) {
      console.error(`❌ Erreur téléchargement image ${destinationPath}:`, error)
      throw new Error(`Image download failed: ${error.message}`)
    }
  }

  /**
   * Génère un seed unique basé sur le contexte de l'histoire
   * @private
   */
  private generateCharacterSeed(context: ImageGenerationContext): number {
    const seedString = `${context.protagonist}-${context.species}-${context.theme}`
    let hash = 0
    for (let i = 0; i < seedString.length; i++) {
      const char = seedString.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convertir en 32bit integer
    }
    // Retourner un nombre positif entre 1 et 4294967295
    return Math.abs(hash) || 1
  }

  /**
   * Construit le prompt pour l'image de couverture
   * @private
   */
  private buildCoverPrompt(context: ImageGenerationContext): string {
    const characterDescription = this.getCharacterDescription(context)
    const sanitizedTitle = this.sanitizeContent(context.title)
    const sanitizedTheme = this.sanitizeContent(context.theme)
    const sanitizedSynopsis = this.sanitizeContent(context.synopsis)

    return this.sanitizeContent(`
Book cover illustration for children's story: "${sanitizedTitle}"

${characterDescription} as the main character, prominently featured in the center of the composition.
Setting: Beautiful ${sanitizedTheme} environment as background.
Story synopsis: ${sanitizedSynopsis}

Style: Professional children's book cover, vibrant colors, magical atmosphere, high quality illustration.
Composition: Main character in foreground, thematic background, title space at top.
Age-appropriate for ${context.childAge} years old, inviting and warm feeling.
Art style: Modern children's book illustration, detailed but clean, professional cover quality.

No text or titles in the image, just the visual cover scene.
    `.trim())
  }

  /**
   * Construit le prompt pour une image de chapitre
   * @private
   */
  private buildChapterPrompt(context: ImageGenerationContext, chapter: ChapterContent): string {
    const characterDescription = this.getCharacterDescription(context)
    const sanitizedChapterTitle = this.sanitizeContent(chapter.title)
    const sanitizedContent = this.sanitizeContent(chapter.content.substring(0, 500))

    return this.sanitizeContent(`
Illustration for children's story chapter: "${sanitizedChapterTitle}"

${characterDescription} in this scene.
Chapter content: ${sanitizedContent}

Style: Children's book illustration, vibrant colors, whimsical atmosphere.
Age-appropriate for ${context.childAge} years old.
Art style: Modern children's book illustration, detailed but clean.

No text in the image, just the visual scene from the chapter.
    `.trim())
  }

  /**
   * Construit le prompt pour la character reference
   * @private
   */
  private buildCharacterReferencePrompt(context: ImageGenerationContext): string {
    const characterDescription = this.getCharacterDescription(context)

    return this.sanitizeContent(`
Character reference sheet: ${characterDescription}

Full body character design, front view, clean white background, children's book illustration style.
Standing pose, friendly expression, detailed character design for consistency across multiple illustrations.
Bright colors, professional quality, detailed but clean art style.
Reference sheet for maintaining visual consistency.
    `.trim())
  }

  /**
   * Retourne la description cohérente du personnage
   * @private
   */
  private getCharacterDescription(context: ImageGenerationContext): string {
    return `${context.protagonist}, a ${context.childAge}-year-old ${context.species}`
  }

  /**
   * Nettoie le contenu pour éviter les problèmes de modération
   * @private
   */
  private sanitizeContent(content: string): string {
    return content.replace(/[^\w\s.,!?'-]/g, '').trim()
  }
}
