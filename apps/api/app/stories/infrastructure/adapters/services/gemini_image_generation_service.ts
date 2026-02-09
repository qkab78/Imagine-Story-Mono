import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import { GoogleGenAI } from '@google/genai'
import env from '#start/env'
import { IStoryImageGenerationService } from '#stories/domain/services/i_story_image_generation_service'
import type {
  ImageGenerationContext,
  ChapterContent,
  ChapterImagesGenerationResponse,
  CharacterReferenceResult,
  ChapterImageResult,
  CoverImageResult,
} from '#stories/domain/services/types/image_generation_types'
import { IStorageService } from '#stories/domain/services/i_storage_service'
import { AppearancePresetService } from '#stories/domain/services/appearance_preset_service'
import { IllustrationStyleService } from '#stories/domain/services/illustration_style_service'

/**
 * Style-specific color descriptions for character visual locks.
 * Uses textual descriptions instead of hex codes to better match each illustration style.
 */
interface StyleColors {
  dress: string
  cardigan: string
  shoes: string
  hair: string
  eyes: string
  top?: string
  bottom?: string
  accessory?: string
}

/**
 * Costume variant for girls
 */
interface GirlOutfitVariant {
  dress: string
  cardigan: string
  shoes: string
  accessory: string
}

/**
 * Costume variant for boys
 */
interface BoyOutfitVariant {
  top: string
  bottom: string
  shoes: string
  accessory: string
}

/**
 * Superhero costume variant
 */
interface SuperheroCostumeVariant {
  primary: string
  cape: string
  emblem: string
  accentColor: string
}

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

  // Costume variants for variety - very specific descriptions to ensure consistency
  private readonly SUPERHERO_COSTUME_VARIANTS: SuperheroCostumeVariant[] = [
    {
      primary: 'royal blue spandex with subtle darker blue seams',
      cape: 'long crimson red flowing cape reaching mid-calf, attached at shoulders with gold clasps',
      emblem: 'golden yellow lightning bolt pointing downward, 15cm tall, centered on chest',
      accentColor: 'gold trim on gloves and boots',
    },
    {
      primary: 'emerald green metallic bodysuit with diamond pattern texture',
      cape: 'short silver cape to waist level, scalloped edges, attached at collar',
      emblem: 'white shield shape with green border, 12cm wide, on left chest',
      accentColor: 'white belt with silver buckle',
    },
    {
      primary: 'deep purple velvet-look suit with black side panels',
      cape: 'floor-length gold cape with purple lining, hood down, jeweled clasp',
      emblem: 'silver 5-pointed star, 10cm, glowing effect, centered on chest',
      accentColor: 'silver wrist cuffs and ankle bands',
    },
    {
      primary: 'midnight black matte bodysuit with subtle armor plates',
      cape: 'mid-back electric blue cape, torn edges style, no clasp',
      emblem: 'white crescent moon facing right, 8cm, on right chest',
      accentColor: 'electric blue glowing lines on arms and legs',
    },
    {
      primary: 'fiery orange gradient suit, darker at extremities',
      cape: 'short black cape to shoulders only, flame-shaped edges',
      emblem: 'yellow-orange flame with 3 tongues, 12cm tall, centered',
      accentColor: 'black gloves up to elbows, black boots to knees',
    },
    {
      primary: 'ruby red glossy suit with gold muscle lines',
      cape: 'asymmetric dark gray cape, long on left side only',
      emblem: 'orange phoenix with spread wings, 15cm wide, on chest',
      accentColor: 'gold belt and shoulder pads',
    },
    {
      primary: 'sky blue suit with white cloud pattern on torso',
      cape: 'long flowing white cape, transparent edges, angel-wing shape',
      emblem: 'fluffy white cloud with silver lining, 10cm, centered',
      accentColor: 'white boots with small wings at ankles',
    },
    {
      primary: 'forest green suit with bark texture on arms and legs',
      cape: 'brown hooded cloak, leaf-shaped clasp, earth tones',
      emblem: 'golden oak leaf, detailed veins, 8cm, on left chest',
      accentColor: 'brown leather belt with pouches',
    },
  ]

  private readonly GIRL_OUTFIT_VARIANTS: GirlOutfitVariant[] = [
    {
      dress: 'pink dress with white polka dots',
      cardigan: 'lavender',
      shoes: 'white Mary Jane',
      accessory: 'butterfly hair clip',
    },
    {
      dress: 'yellow sundress with daisies',
      cardigan: 'light blue',
      shoes: 'white sandals',
      accessory: 'flower crown',
    },
    {
      dress: 'mint green dress',
      cardigan: 'cream white',
      shoes: 'pink ballet flats',
      accessory: 'pearl headband',
    },
    {
      dress: 'coral dress with ruffles',
      cardigan: 'beige',
      shoes: 'tan sandals',
      accessory: 'seashell necklace',
    },
    {
      dress: 'sky blue dress with clouds',
      cardigan: 'white',
      shoes: 'silver shoes',
      accessory: 'star hair pins',
    },
    {
      dress: 'peach dress with lace',
      cardigan: 'dusty rose',
      shoes: 'cream ballet shoes',
      accessory: 'ribbon bow',
    },
  ]

  private readonly BOY_OUTFIT_VARIANTS: BoyOutfitVariant[] = [
    {
      top: 'red and white striped t-shirt',
      bottom: 'blue overalls',
      shoes: 'red sneakers',
      accessory: 'yellow star badge',
    },
    {
      top: 'green dinosaur t-shirt',
      bottom: 'khaki shorts',
      shoes: 'brown boots',
      accessory: 'explorer hat',
    },
    {
      top: 'navy blue polo',
      bottom: 'beige chinos',
      shoes: 'white sneakers',
      accessory: 'wristwatch',
    },
    {
      top: 'orange hoodie',
      bottom: 'dark jeans',
      shoes: 'gray sneakers',
      accessory: 'backpack',
    },
    {
      top: 'yellow t-shirt with rocket',
      bottom: 'blue shorts',
      shoes: 'blue sneakers',
      accessory: 'astronaut patch',
    },
    {
      top: 'light blue button shirt',
      bottom: 'navy pants',
      shoes: 'brown loafers',
      accessory: 'bow tie',
    },
  ]

  constructor(private readonly storageService: IStorageService) {
    super()
    this.client = new GoogleGenAI({
      apiKey: env.get('GEMINI_API_KEY'),
    })
  }

  /**
   * Génère l'image de couverture avec Gemini Imagen 3
   * Retourne également le Character Visual Lock pour assurer la cohérence avec les chapitres
   */
  async generateCoverImage(
    context: ImageGenerationContext,
    _characterReference?: CharacterReferenceResult
  ): Promise<CoverImageResult> {
    try {
      logger.info('🖼️ Génération image de couverture avec Gemini Imagen 3 (Nano Banana)...')

      // Générer le Character Visual Lock pour la cohérence entre images
      const characterVisualLock = this.buildCharacterVisualLock(context)

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
      logger.info('📌 Image de couverture retournée comme référence pour les chapitres')

      return {
        imagePath: coverPath,
        characterVisualLock,
        coverImageData: imageData, // Retourner pour utilisation dans les chapitres (thread-safe)
      }
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
   * Utilise l'image de couverture comme référence multimodale si disponible
   * @private
   */
  private async generateSingleChapterImage(
    context: ImageGenerationContext,
    chapter: ChapterContent
  ): Promise<ChapterImageResult | null> {
    try {
      logger.info(`📋 Génération image chapitre ${chapter.index + 1}: ${chapter.title}`)

      const chapterPrompt = this.buildChapterPrompt(context, chapter)
      let imageData: string

      // Utiliser l'image de couverture comme référence si disponible (passée via context pour thread-safety)
      if (context.coverImageData) {
        try {
          logger.info(`🔗 Utilisation de l'image de couverture comme référence multimodale`)
          imageData = await this.generateImageWithReference(chapterPrompt, context.coverImageData)
        } catch (error: any) {
          logger.warn(`⚠️ Génération avec référence échouée, fallback sur text-to-image: ${error.message}`)
          imageData = await this.generateImageWithRetry(chapterPrompt)
        }
      } else {
        imageData = await this.generateImageWithRetry(chapterPrompt)
      }

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
   * Génère une image en utilisant une image de référence pour le personnage
   * Utilise generateContent avec l'image de couverture comme référence multimodale
   * @private
   */
  private async generateImageWithReference(
    prompt: string,
    referenceImageBase64: string,
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
              parts: [
                // Image de référence du personnage
                {
                  inlineData: {
                    mimeType: 'image/png',
                    data: referenceImageBase64,
                  },
                },
                // Instruction de cohérence + prompt de la scène
                {
                  text: `REFERENCE IMAGE ABOVE: This is the main character. Generate a NEW image of this EXACT SAME character with identical costume, emblem, cape, colors, and all accessories.

${prompt}`,
                },
              ],
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
              return part.inlineData.data
            }
          }
        }

        throw new Error('Aucune image trouvée dans la réponse Gemini')
      } catch (error: any) {
        lastError = error
        logger.warn(`⚠️ generateImageWithReference tentative ${attempt}/${retries} échouée:`, error.message)

        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY_MS))
        }
      }
    }

    throw new Error(`generateImageWithReference failed after ${retries} attempts: ${lastError?.message}`)
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
   * Utilise des prompts courts et focalisés (~30 lignes) avec Character Visual Lock
   * @private
   */
  private buildCoverPrompt(context: ImageGenerationContext): string {
    const stylePrompt = IllustrationStyleService.getStylePrompt(context.illustrationStyle)
    const characterLock = this.buildCharacterVisualLock(context)
    const styleName = context.illustrationStyle || 'classic-book'

    return `${stylePrompt}

NO TEXT IN IMAGE - PURE VISUAL ILLUSTRATION ONLY

═══════════════════════════════════════
STYLE ARTISTIQUE: ${styleName.toUpperCase()}
═══════════════════════════════════════

═══════════════════════════════════════
CHARACTER VISUAL LOCK (IMAGE DE RÉFÉRENCE)
═══════════════════════════════════════
${characterLock}

═══════════════════════════════════════
COMPOSITION COUVERTURE
═══════════════════════════════════════
- Personnage au centre, 60-70% de l'image, corps entier visible
- Expression accueillante, regard vers le spectateur
- Décor: ${context.theme}, détaillé mais pas distrayant
- Laisser 20% en haut pour le titre (zone simple)
- Éclairage doux et chaleureux, ambiance ${context.tone}
- Public cible: enfants de ${context.childAge} ans

════════════════════════════════════════════════════════════════
IMAGE DE RÉFÉRENCE POUR TOUTE L'HISTOIRE
════════════════════════════════════════════════════════════════
Cette image définit le personnage pour TOUTE l'histoire.
Chaque détail du costume doit être clairement visible et identifiable:
- Emblème bien visible et détaillé
- Cape avec sa forme et longueur exactes
- Couleurs vives et distinctes
- Accessoires bien positionnés

Style ${styleName} appliqué uniformément sur toute l'image.`
  }

  /**
   * Construit le prompt pour une image de chapitre
   * Utilise des prompts courts et focalisés (~30 lignes) avec Character Visual Lock
   * @private
   */
  private buildChapterPrompt(context: ImageGenerationContext, chapter: ChapterContent): string {
    const stylePrompt = IllustrationStyleService.getStylePrompt(context.illustrationStyle)
    const characterLock = context.characterVisualLock || this.buildCharacterVisualLock(context)
    const scene = chapter.content.substring(0, 300)
    const styleName = context.illustrationStyle || 'classic-book'
    const isLastChapter = chapter.index + 1 === context.numberOfChapters

    // Extra emphasis for last chapter to prevent style drift
    const styleEmphasis = isLastChapter
      ? `\n⚠️ DERNIER CHAPITRE - MAINTENIR LE STYLE ${styleName.toUpperCase()} EXACTEMENT COMME LES CHAPITRES PRÉCÉDENTS`
      : ''

    return `${stylePrompt}

NO TEXT IN IMAGE - PURE VISUAL ILLUSTRATION ONLY

═══════════════════════════════════════
STYLE ARTISTIQUE: ${styleName.toUpperCase()}
═══════════════════════════════════════
${styleEmphasis}

═══════════════════════════════════════
CHARACTER VISUAL LOCK (COPIE EXACTE DE LA COUVERTURE)
═══════════════════════════════════════
${characterLock}

═══════════════════════════════════════
SCÈNE CHAPITRE ${chapter.index + 1}/${context.numberOfChapters}
═══════════════════════════════════════
Titre (ne pas écrire): "${chapter.title}"

Contexte de la scène:
${scene}

Composition:
- Personnage visible et reconnaissable (min 40% de l'image)
- Action ou émotion correspondant au contenu
- Décor: ${context.theme}
- Ton: ${context.tone}
- Public: ${context.childAge} ans

════════════════════════════════════════════════════════════════
RÈGLES DE COHÉRENCE ABSOLUES - NE JAMAIS DÉVIER
════════════════════════════════════════════════════════════════
✓ Personnage STRICTEMENT identique à la couverture
✓ Même costume avec TOUS les détails (emblème, cape, accessoires)
✓ Mêmes couleurs EXACTES sur chaque élément
✓ Même style artistique ${styleName} sur TOUTE l'image

✗ NE PAS changer la forme ou position de l'emblème
✗ NE PAS modifier la longueur ou forme de la cape
✗ NE PAS altérer les couleurs du costume
✗ NE PAS changer le style d'illustration`
  }

  /**
   * Construit le Character Visual Lock - description concise mais précise du personnage
   * Ce lock est utilisé pour maintenir la cohérence entre toutes les images
   * @private
   */
  private buildCharacterVisualLock(context: ImageGenerationContext): string {
    const { protagonist, species, childAge, appearancePreset, illustrationStyle } = context
    const skinTone = AppearancePresetService.getPreset(appearancePreset)
    const isHuman = ['human', 'girl', 'boy', 'superhero', 'superheroine'].includes(
      species.toLowerCase()
    )

    if (isHuman) {
      return this.buildHumanCharacterLock(context, species, protagonist, childAge, skinTone)
    }

    return this.getSpeciesCharacterLock(species, protagonist, childAge, illustrationStyle)
  }

  /**
   * Get style-specific color descriptions for clothing and features.
   * Uses textual descriptions that match each illustration style instead of hex codes.
   * @private
   */
  private getStyleColorDescriptions(style?: string): StyleColors {
    switch (style) {
      case 'watercolor':
        return {
          dress: 'soft pink watercolor wash',
          cardigan: 'pale lavender with visible brushstrokes',
          shoes: 'cream white with soft edges',
          hair: 'warm brown with watercolor texture',
          eyes: 'soft hazel with wet-on-wet effect',
          top: 'red and cream striped with watercolor bleeding',
          bottom: 'soft blue wash overalls',
          accessory: 'delicate pastel tones',
        }
      case 'japanese-soft':
        return {
          dress: 'pastel pink with delicate pattern',
          cardigan: 'soft lavender, kawaii style',
          shoes: 'white Mary Jane, rounded cute style',
          hair: 'rich brown, shiny anime style',
          eyes: 'large sparkling brown, manga style',
          top: 'soft pastel striped, rounded collar',
          bottom: 'light blue overalls, kawaii style',
          accessory: 'sparkly and cute',
        }
      case 'disney-pixar':
        return {
          dress: 'vibrant pink, 3D rendered look',
          cardigan: 'bright lavender, soft fabric texture',
          shoes: 'glossy white patent leather',
          hair: 'rich chocolate brown, volumetric',
          eyes: 'expressive brown, Pixar-style large pupils',
          top: 'saturated red and white, soft fabric folds',
          bottom: 'vibrant blue, 3D cloth simulation look',
          accessory: 'shiny and detailed',
        }
      default: // classic-book
        return {
          dress: 'rose pink, classic illustration style',
          cardigan: 'lavender, traditional book art',
          shoes: 'ivory white, vintage style',
          hair: 'chestnut brown, detailed strokes',
          eyes: 'warm brown, classic children book style',
          top: 'traditional red and white striped',
          bottom: 'classic blue overalls, vintage feel',
          accessory: 'timeless and detailed',
        }
    }
  }

  /**
   * Generate a deterministic hash from a string for variant selection
   * @private
   */
  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash
  }

  /**
   * Get a superhero costume variant based on context for variety
   * @private
   */
  private getSuperheroVariant(context: ImageGenerationContext): SuperheroCostumeVariant {
    const seed = `${context.protagonist}-${context.title}-${context.theme}`
    const hash = this.hashString(seed)
    const index = Math.abs(hash) % this.SUPERHERO_COSTUME_VARIANTS.length
    return this.SUPERHERO_COSTUME_VARIANTS[index]
  }

  /**
   * Get a girl outfit variant based on context for variety
   * @private
   */
  private getGirlOutfitVariant(context: ImageGenerationContext): GirlOutfitVariant {
    const seed = `${context.protagonist}-${context.title}-${context.theme}`
    const hash = this.hashString(seed)
    const index = Math.abs(hash) % this.GIRL_OUTFIT_VARIANTS.length
    return this.GIRL_OUTFIT_VARIANTS[index]
  }

  /**
   * Get a boy outfit variant based on context for variety
   * @private
   */
  private getBoyOutfitVariant(context: ImageGenerationContext): BoyOutfitVariant {
    const seed = `${context.protagonist}-${context.title}-${context.theme}`
    const hash = this.hashString(seed)
    const index = Math.abs(hash) % this.BOY_OUTFIT_VARIANTS.length
    return this.BOY_OUTFIT_VARIANTS[index]
  }

  /**
   * Construit le Character Visual Lock pour les personnages humains
   * Uses style-aware color descriptions and costume variants for variety
   * @private
   */
  private buildHumanCharacterLock(
    context: ImageGenerationContext,
    species: string,
    protagonist: string,
    childAge: number,
    skinTone: { description: string; color: string }
  ): string {
    const isFemale = species === 'girl' || species === 'superheroine'
    const isSuperHero = species === 'superhero' || species === 'superheroine'
    const styleColors = this.getStyleColorDescriptions(context.illustrationStyle)

    if (isSuperHero) {
      const costume = this.getSuperheroVariant(context)
      const hairDesc = isFemale
        ? 'Longs cheveux auburn en haute queue de cheval, mèches encadrant le visage'
        : 'Courts cheveux noirs hérissés vers le haut, style dynamique'
      return `Personnage: ${isFemale ? 'Super-héroïne' : 'Super-héros'} de ${childAge} ans, ${protagonist}

APPARENCE PHYSIQUE (NE JAMAIS CHANGER):
- Peau: ${skinTone.description}
- Cheveux: ${hairDesc}
- Yeux: Grands, ${isFemale ? 'violets' : 'verts'}, expressifs avec détermination
- Visage: Joues rondes enfantines, menton déterminé, petit nez

COSTUME EXACT (REPRODUIRE À L'IDENTIQUE):
- COMBINAISON: ${costume.primary}
- CAPE: ${costume.cape}
- EMBLÈME: ${costume.emblem}
- ACCENTS: ${costume.accentColor}
- MASQUE: Masque loup couvrant les yeux, même couleur que la combinaison principale
- GANTS: Gants montant aux poignets, même couleur que la combinaison
- BOTTES: Bottes montantes aux genoux, même couleur que la combinaison

⚠️ ATTENTION: Chaque détail ci-dessus doit être EXACTEMENT identique sur TOUTES les images.
L'emblème, la cape, les couleurs ne doivent JAMAIS varier.`
    }

    if (isFemale) {
      const outfit = this.getGirlOutfitVariant(context)
      return `Personnage: Fille de ${childAge} ans, ${protagonist}
Peau: ${skinTone.description}
Cheveux: Longs ondulés mi-dos, ${styleColors.hair}
Yeux: Grands, ${styleColors.eyes}
Visage: Joues rondes rosées, petit nez, sourire doux

Vêtements (IDENTIQUES partout):
- ${outfit.dress}, style ${context.illustrationStyle || 'classic-book'}
- Cardigan ${outfit.cardigan}
- Chaussures ${outfit.shoes}
- ${outfit.accessory}`
    }

    const outfit = this.getBoyOutfitVariant(context)
    return `Personnage: Garçon de ${childAge} ans, ${protagonist}
Peau: ${skinTone.description}
Cheveux: Courts ondulés, ${styleColors.hair}
Yeux: Grands, ${styleColors.eyes}
Visage: Joues rondes, petit nez, sourire amical

Vêtements (IDENTIQUES partout):
- ${outfit.top}, style ${context.illustrationStyle || 'classic-book'}
- ${outfit.bottom}
- ${outfit.shoes}
- ${outfit.accessory}`
  }

  /**
   * Construit le Character Visual Lock pour les espèces non-humaines
   * Uses style-aware descriptions instead of hardcoded hex codes
   * @private
   */
  private getSpeciesCharacterLock(
    species: string,
    protagonist: string,
    childAge: number,
    style?: string
  ): string {
    const styleNote = style ? `, style ${style}` : ''
    const templates: Record<string, string> = {
      cat: `Personnage: Chat anthropomorphe ${childAge} ans, ${protagonist}${styleNote}
Fourrure: Tigré orange sur base blanche, marque "M" front
Yeux: Grands amandes émeraude, pupilles verticales
Nez: Petit rose triangulaire
Moustaches: 6 blanches chaque côté

Tenue (IDENTIQUE partout):
- Gilet bleu royal, 3 boutons dorés
- Chemise blanche col visible
- Clochette argentée sur collier rouge
- Queue rayée orange/blanc, pointe blanche`,

      dog: `Personnage: Chien Golden Retriever anthropomorphe ${childAge} ans, ${protagonist}${styleNote}
Fourrure: Dorée, patches crème autour yeux
Yeux: Grands bruns chaleureux, expression amicale
Nez: Grand noir brillant
Oreilles: Longues tombantes, pointes plus foncées

Tenue (IDENTIQUE partout):
- Veste vert forêt, coudières cuir marron
- Collier rouge, médaille dorée patte
- Bandana bleu sous le collier
- Queue touffue, pointe blanche`,

      rabbit: `Personnage: Lapin anthropomorphe ${childAge} ans, ${protagonist}${styleNote}
Fourrure: Blanc pur, joues extra duveteuses
Yeux: Très grands bleus, longs cils
Nez: Petit rose, frémissant
Oreilles: Très longues (15cm), intérieur rose

Tenue (IDENTIQUE partout):
- Gilet violet, 4 boutons dorés
- Nœud papillon rouge
- Montre à gousset dorée visible
- Épingle carotte sur revers`,

      bear: `Personnage: Ourson anthropomorphe ${childAge} ans, ${protagonist}${styleNote}
Fourrure: Brun épais, museau crème
Yeux: Petits bruns doux, bienveillants
Nez: Grand noir arrondi, brillant
Oreilles: Petites rondes sur le sommet

Tenue (IDENTIQUE partout):
- Pull rouge tricoté, col blanc
- Poignets blancs côtelés
- Motif flocon neige blanc poitrine
- Icône pot miel brodée gauche`,

      mouse: `Personnage: Souris anthropomorphe ${childAge} ans, ${protagonist}${styleNote}
Fourrure: Grise douce, ventre plus clair
Yeux: Très grands bruns, démesurés
Nez: Minuscule rose
Oreilles: Énormes rondes (1/3 tête), rose intérieur

Tenue (IDENTIQUE partout):
- Ciré jaune vif aux genoux
- 4 boutons rouges
- Capuche jaune doublée rouge
- Petit parapluie bleu à la ceinture`,

      robot: `Personnage: Petit robot ${childAge} ans, ${protagonist}${styleNote}
Corps: Blanc, tête argentée sphérique
Yeux: 2 grands LED cyan, toujours brillants
Bouche: Écran LED affichant ^_^
Antenne: Sommet tête, lumière rouge clignotante

Équipement (IDENTIQUE partout):
- Panneau orange poitrine avec cœur blanc
- Cape rouge courte aux épaules
- Badge étoile dorée gauche
- Pieds avec LED bleues latérales`,

      animal: `Personnage: Renard anthropomorphe ${childAge} ans, ${protagonist}${styleNote}
Fourrure: Orange roux, ventre crème, bout queue blanc
Yeux: Grands ambrés, malicieux mais gentils
Nez: Petit noir triangulaire
Oreilles: Pointues noires aux pointes

Tenue (IDENTIQUE partout):
- Écharpe verte tricotée
- Sac à dos brun clair
- Foulard rouge noué autour du cou`,
    }

    return (
      templates[species.toLowerCase()] ||
      `Personnage: ${species} anthropomorphe ${childAge} ans, ${protagonist}${styleNote}
Style chibi mignon, grands yeux expressifs
Tenue distinctive et reconnaissable
Accessoire caractéristique visible`
    )
  }
}
