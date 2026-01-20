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
} from '#stories/domain/services/types/image_generation_types'
import { IStorageService } from '#stories/domain/services/i_storage_service'

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

    return `🚫 CRITICAL TEXT RESTRICTION - READ FIRST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTELY NO TEXT, WORDS, LETTERS, OR WRITTEN CONTENT OF ANY KIND
- NO title text anywhere in the image
- NO speech bubbles or dialogue
- NO labels, captions, or annotations
- NO visible letters, numbers, or symbols
- NO written words in any language
- NO book spines with text, signs, or posters with writing
PURE VISUAL ILLUSTRATION ONLY - TEXT-FREE CHILDREN'S BOOK ART
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create a professional children's book cover illustration with the following details:

═══════════════════════════════════════════════════════════════
SECTION 1: MAIN CHARACTER DESIGN (CANONICAL REFERENCE)
═══════════════════════════════════════════════════════════════

${characterDescription}

⚠️ CHARACTER DESIGN IMPORTANCE:
This character design is ICONIC and must be INSTANTLY RECOGNIZABLE. Every visual detail described above is essential and must appear EXACTLY as specified in all future illustrations. This is the MASTER REFERENCE that defines the character's appearance for the entire story.

═══════════════════════════════════════════════════════════════
SECTION 2: COVER SCENE COMPOSITION
═══════════════════════════════════════════════════════════════

Main Scene Layout:
- The character is prominently featured in the center of the composition, taking up 60-70% of the image
- Full-body view showing all distinctive features, clothing, and accessories
- The character should have a welcoming, engaging expression directly facing the viewer
- Character positioned with feet visible, showing complete outfit and accessories
- Background: Beautiful ${context.theme} environment that sets the story's atmosphere
- Background should be detailed but not distracting from the main character

Story Context Integration:
- Title theme: "${context.title}"
- Story synopsis: ${context.synopsis}
- Emotional tone: ${context.tone}
- Target audience: ${context.childAge}-year-old children

═══════════════════════════════════════════════════════════════
SECTION 3: VISUAL STYLE & ARTISTIC SPECIFICATIONS
═══════════════════════════════════════════════════════════════

Art Style Requirements:
- Art style: Modern children's book illustration with soft painted textures
- Rendering: Slightly stylized but with realistic proportions and lighting
- Color palette: Warm, vibrant colors with high saturation - avoid muted or pastel tones
- Lighting: Soft, even front lighting (like golden hour sunlight) that illuminates the character clearly
- Perspective: Straight-on view at eye level with the character
- Texture: Smooth digital painting style with subtle brushwork visible
- Line quality: Clean outlines with consistent thickness
- Shadow style: Soft, natural shadows that enhance depth without darkening the mood
- Overall mood: Inviting, warm, and age-appropriate for ${context.childAge}-year-old children

Composition Technical Guidelines:
- Main character in foreground (sharp focus, maximum detail, crisp edges)
- Background elements slightly softer but still detailed and atmospheric
- Leave clear space at the top 20% for future title text overlay (keep this area simple)
- Ensure character's distinctive features (clothing, colors, accessories) are clearly visible
- Frame the character to show personality and approachability
- Rule of thirds composition with character's face in upper third
- Balanced visual weight with breathing room around the character

═══════════════════════════════════════════════════════════════
SECTION 4: CONSISTENCY & QUALITY REQUIREMENTS
═══════════════════════════════════════════════════════════════

Character Consistency Rules (CRITICAL):
✓ This is the REFERENCE IMAGE for the entire story series
✓ The character's appearance established here is CANONICAL and UNCHANGEABLE
✓ All distinctive features must be clearly visible and well-defined
✓ Clothing, colors, accessories MUST remain identical in all future illustrations
✓ Character proportions and style must be consistent and memorable
✓ Every detail matters - this image defines the character forever

Image Quality Standards:
✓ High resolution with crisp, clean details
✓ Professional children's book illustration quality
✓ Colors should be vibrant and appealing to young children
✓ Character should be immediately recognizable and memorable
✓ Background should support but not overwhelm the character
✓ Overall composition should be balanced and visually appealing

═══════════════════════════════════════════════════════════════
🚫 FINAL REMINDER: ABSOLUTELY NO TEXT IN THE IMAGE
═══════════════════════════════════════════════════════════════

Generate ONLY the pure visual illustration without any text, titles, words, letters, or written content.
This is a TEXT-FREE children's book illustration - focus on creating an engaging, memorable character design that will be instantly recognizable throughout the story.`
  }

  /**
   * Construit le prompt pour une image de chapitre
   * @private
   */
  private buildChapterPrompt(context: ImageGenerationContext, chapter: ChapterContent): string {
    const characterDescription = this.getCharacterDescription(context)
    const contentPreview = chapter.content.substring(0, 500)

    return `🚫 CRITICAL TEXT RESTRICTION - READ FIRST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTELY NO TEXT, WORDS, LETTERS, OR WRITTEN CONTENT OF ANY KIND
- NO chapter titles or page numbers
- NO speech bubbles, dialogue, or captions
- NO labels or annotations
- NO visible letters, numbers, or symbols
- NO written words in any language
- NO signs, posters, book text, or environmental text
PURE VISUAL ILLUSTRATION ONLY - TEXT-FREE CHILDREN'S BOOK ART
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create a children's book illustration for chapter ${chapter.index + 1} of ${context.numberOfChapters}:

Chapter Title Reference (DO NOT WRITE IN IMAGE): "${chapter.title}"

═══════════════════════════════════════════════════════════════
SECTION 1: CHARACTER CONSISTENCY (CRITICAL - EXACT MATCH REQUIRED)
═══════════════════════════════════════════════════════════════

${characterDescription}

⚠️ ABSOLUTE CHARACTER CONSISTENCY REQUIREMENTS:
The character MUST have EXACTLY the same appearance as in the cover and all previous chapter illustrations:

CRITICAL CHECKLIST (EVERY ITEM MUST MATCH EXACTLY):
✓ IDENTICAL facial features, eye color, and expression style
✓ EXACT SAME clothing items, colors (use same hex codes), and patterns
✓ EXACT SAME accessories in the same positions
✓ SAME proportions, height, and body shape
✓ SAME distinctive features and unique characteristics
✓ SAME fur/skin/metal colors and textures
✓ SAME art style and rendering technique
✓ The character should be INSTANTLY recognizable as the same character from the cover

DO NOT ALTER:
✗ NO changes to outfit or clothing colors
✗ NO different accessories or missing accessories
✗ NO variations in proportions or features
✗ NO style changes or artistic reinterpretation
This is chapter ${chapter.index + 1} - the character is already established and CANNOT change.

═══════════════════════════════════════════════════════════════
SECTION 2: CHAPTER SCENE & NARRATIVE MOMENT
═══════════════════════════════════════════════════════════════

Chapter Story Context:
${contentPreview}

Scene Composition Requirements:
- The main character is clearly visible and central to the action (minimum 40% of image)
- Show the character actively participating in this chapter's key narrative moment
- Character should be engaged with the scene (action, emotion, or interaction)
- Background: ${context.theme} environment matching this specific chapter's setting
- Camera angle: Eye-level perspective with the character (child's viewpoint)
- Ensure the character's distinctive clothing and features are clearly visible
- Frame the action to tell the story visually without text

Environmental Setting:
- Background should support the chapter's narrative without overwhelming the character
- Include setting details that match the chapter content
- Maintain ${context.theme} atmosphere consistent with the overall story
- Create depth with foreground, midground, and background elements

═══════════════════════════════════════════════════════════════
SECTION 3: VISUAL STYLE CONSISTENCY (MUST MATCH COVER)
═══════════════════════════════════════════════════════════════

Art Style Requirements (IDENTICAL TO COVER):
- Art style: Modern children's book illustration with soft painted textures
- Rendering: Slightly stylized but with realistic proportions and lighting
- Color palette: Warm, vibrant colors with high saturation - MUST match cover palette
- Lighting: Soft, even lighting that keeps the scene bright and inviting
- Perspective: Consistent with cover and previous chapters
- Texture: Smooth digital painting style with subtle brushwork visible
- Line quality: Clean outlines with consistent thickness (same as cover)
- Shadow style: Soft, natural shadows that enhance depth
- Emotional tone: ${context.tone}
- Age-appropriate: Designed specifically for ${context.childAge}-year-old children

Technical Consistency Standards:
- Character rendering quality must match the cover illustration exactly
- Color saturation and vibrancy consistent across all images
- Same level of detail and finish quality
- Same artistic techniques and visual treatment
- Professional children's book illustration standard maintained

═══════════════════════════════════════════════════════════════
SECTION 4: STORY CONTINUITY & QUALITY ASSURANCE
═══════════════════════════════════════════════════════════════

Story Context:
- This is chapter ${chapter.index + 1} of ${context.numberOfChapters} in the story "${context.title}"
- This chapter continues the visual narrative established in the cover
- Character appearance is LOCKED from the cover illustration
- Overall theme: ${context.theme}
- Maintain the same artistic technique and rendering quality throughout

Visual Continuity Checklist:
✓ Character appearance matches cover image exactly (clothing, colors, features)
✓ Art style is consistent with cover and previous chapters
✓ Color palette harmonizes with the established visual language
✓ Line quality and rendering technique match previous illustrations
✓ Character proportions are identical to cover illustration
✓ All distinctive accessories and features are present
✓ Background style complements character rendering
✓ Overall quality and finish match the cover standard

Quality Standards:
✓ High resolution with crisp, clean details
✓ Professional children's book illustration quality
✓ Character is clearly recognizable as the same character from cover
✓ Scene tells the chapter story visually without needing text
✓ Composition is balanced and age-appropriate
✓ Colors are vibrant and appealing to ${context.childAge}-year-old children
✓ Image works as part of a cohesive visual story sequence

═══════════════════════════════════════════════════════════════
🚫 FINAL REMINDER: ABSOLUTELY NO TEXT IN THE IMAGE
═══════════════════════════════════════════════════════════════

Generate ONLY the pure visual illustration without any text, words, letters, or written content.
This is a TEXT-FREE children's book illustration.
The character must look EXACTLY the same as in the cover and previous chapters - this is absolutely critical for story continuity.
Focus on telling this chapter's story visually while maintaining perfect consistency with the established character design.`
  }

  /**
   * Construit une description détaillée du personnage pour garantir la cohérence visuelle
   * Cette description ULTRA-DÉTAILLÉE garantit que le personnage reste identique sur toutes les images
   * @private
   */
  private buildDetailedCharacterDescription(context: ImageGenerationContext): string {
    const { protagonist, species, childAge, theme, tone } = context

    // Templates de description ULTRA-DÉTAILLÉE par espèce avec spécifications visuelles précises
    const speciesTemplates: Record<string, string> = {
      human: `${protagonist}, a ${childAge}-year-old child character with the following EXACT physical characteristics:

FACIAL FEATURES (CRITICAL - MUST BE IDENTICAL):
- Face shape: Round with soft cheeks and a small chin
- Eyes: Large round bright blue eyes with long black eyelashes, positioned wide apart
- Iris color: Bright sapphire blue (#0066CC) with small white highlights
- Eyebrows: Thin, arched, dark brown eyebrows
- Nose: Small button nose with a subtle upward tilt
- Mouth: Wide friendly smile showing small white teeth, pink lips
- Skin tone: Fair peachy skin (#FFDAB9) with rosy pink cheeks
- Hair: Shoulder-length wavy brown hair (#8B4513) with natural highlights, parted on the left side

BODY & PROPORTIONS (CRITICAL - MUST BE IDENTICAL):
- Height: Average for ${childAge} years old (head = 1/5 of total body height)
- Build: Slim but healthy proportions, slightly rounded belly
- Hands: Small with 4 visible fingers, pink palms
- Posture: Upright, confident stance with slight forward lean

CLOTHING (CRITICAL - MUST BE IDENTICAL IN EVERY IMAGE):
- Top: Bright red and white horizontal striped t-shirt (5 stripes visible, each 3cm wide)
- Overalls: Classic blue denim overalls (#4682B4) with silver metal buttons and adjustable straps
- Pockets: Two front pockets on the overalls with visible stitching
- Shoes: Red sneakers with white laces and white rubber toe caps
- Accessories: Small yellow star badge pinned on the left overall strap

DISTINCTIVE MARKS:
- One small freckle on the right cheek
- Cowlick in hair on the top left side of head`,

      cat: `${protagonist}, a ${childAge}-year-old anthropomorphic cat character with the following EXACT physical characteristics:

FACIAL FEATURES (CRITICAL - MUST BE IDENTICAL):
- Face shape: Rounded feline face with soft fur texture
- Fur pattern: Orange tabby stripes (#FF8C00) on white base fur (#FFFFFF), classic "M" marking on forehead
- Eyes: Large almond-shaped emerald green eyes (#50C878) with vertical slit pupils
- Eye size: Eyes are 1.5x larger than typical cat proportions for expressiveness
- Nose: Small triangular pink nose (#FFB6C1), always visible
- Whiskers: 6 white whiskers on each side (12 total), each 4cm long
- Ears: Pointed triangular ears with white fur tufts inside, pink inner ear visible
- Muzzle: White fur around mouth and chin area

BODY & PROPORTIONS (CRITICAL - MUST BE IDENTICAL):
- Height: 80cm tall when standing upright
- Build: Slender anthropomorphic cat body standing on two legs
- Tail: Long striped tail (same orange/white pattern), always curved upward with white tip
- Paws: Four-toed paws with pink paw pads visible, capable of grasping objects
- Posture: Stands upright on two legs like a human

CLOTHING (CRITICAL - MUST BE IDENTICAL IN EVERY IMAGE):
- Vest: Royal blue vest (#4169E1) with three gold buttons down the front
- Shirt: White cotton shirt underneath with collar visible above vest
- No pants: Anthropomorphic style - only vest and shirt on upper body
- Accessories: Small silver bell on a red collar around neck

DISTINCTIVE MARKS:
- White diamond shape on chest
- Orange stripe pattern is asymmetrical - left side has one more stripe than right`,

      dog: `${protagonist}, a ${childAge}-year-old anthropomorphic dog character with the following EXACT physical characteristics:

FACIAL FEATURES (CRITICAL - MUST BE IDENTICAL):
- Breed characteristics: Golden Retriever features
- Face shape: Friendly rounded snout with soft features
- Fur color: Golden-brown fur (#DAA520) with lighter cream patches around eyes
- Eyes: Large warm brown eyes (#8B4513) with friendly expression, always slightly squinting in happiness
- Nose: Large black button nose, always shiny
- Ears: Long floppy ears that hang down to chin level, darker brown at tips
- Tongue: Often visible, pink tongue hanging slightly out on left side of mouth
- Muzzle: Cream-colored fur around mouth area

BODY & PROPORTIONS (CRITICAL - MUST BE IDENTICAL):
- Height: 90cm tall when standing upright
- Build: Slightly stocky, friendly proportions
- Tail: Medium-length fluffy tail, always wagging (curved to the right)
- Paws: Four-toed paws with black paw pads, capable of grasping
- Posture: Stands upright with slight forward lean, friendly stance

CLOTHING (CRITICAL - MUST BE IDENTICAL IN EVERY IMAGE):
- Jacket: Forest green jacket (#228B22) with brown leather elbow patches
- Collar: Red collar with a gold circular tag showing a paw print
- Pockets: Two front pockets on jacket with visible buttons
- No pants: Anthropomorphic style - jacket only
- Accessories: Small blue bandana tied around neck under the collar

DISTINCTIVE MARKS:
- One white spot above the left eye
- Tail has a white tip at the very end`,

      rabbit: `${protagonist}, a ${childAge}-year-old anthropomorphic rabbit character with the following EXACT physical characteristics:

FACIAL FEATURES (CRITICAL - MUST BE IDENTICAL):
- Face shape: Round with soft features and fluffy cheeks
- Fur color: Pure white fluffy fur (#FFFFFF) with subtle gray shading
- Eyes: Large bright blue eyes (#87CEEB) with long eyelashes, very expressive
- Nose: Small pink twitching nose (#FFB6C1), triangular shape
- Whiskers: 8 white whiskers on each side (16 total), each 3cm long
- Ears: Very long upright ears (15cm tall) with pink inner lining, tips slightly curved
- Teeth: Two front teeth always slightly visible even when mouth closed
- Cheeks: Extra fluffy white cheeks

BODY & PROPORTIONS (CRITICAL - MUST BE IDENTICAL):
- Height: 70cm tall when standing upright
- Build: Small and nimble with fluffy appearance
- Tail: Small fluffy cotton-ball tail, pure white, always visible from back
- Paws: Small pink paws with 4 visible toes, soft paw pads
- Posture: Stands upright with good posture, slightly bouncy stance

CLOTHING (CRITICAL - MUST BE IDENTICAL IN EVERY IMAGE):
- Vest: Purple vest (#9370DB) with four golden buttons arranged in two rows
- Bow tie: Small red bow tie at the collar
- Pocket watch: Small golden pocket watch visible in vest pocket with chain
- No pants: Anthropomorphic style - vest only on upper body
- Accessories: Small carrot-shaped pin on the vest lapel

DISTINCTIVE MARKS:
- One ear is slightly longer than the other (right ear is 1cm taller)
- Small gray spot behind left ear`,

      bear: `${protagonist}, a ${childAge}-year-old anthropomorphic bear character with the following EXACT physical characteristics:

FACIAL FEATURES (CRITICAL - MUST BE IDENTICAL):
- Face shape: Round friendly bear face
- Fur color: Thick brown fur (#8B4513) with lighter cream-colored snout
- Snout: Distinctive cream-colored (#F5DEB3) rounded snout area
- Eyes: Small gentle dark brown eyes (#3E2723), warm and friendly
- Nose: Large black nose, rounded triangle shape, always shiny
- Ears: Small round ears positioned on top of head
- Muzzle: Cream-colored fur extends from nose to chin
- Expression: Always has a gentle, warm smile

BODY & PROPORTIONS (CRITICAL - MUST BE IDENTICAL):
- Height: 100cm tall when standing upright
- Build: Slightly chubby, cuddly proportions with rounded belly
- Arms: Thick arms with visible brown fur
- Paws: Large paws with five visible claws, dark brown paw pads
- Posture: Stands upright with slight belly protrusion, warm stance

CLOTHING (CRITICAL - MUST BE IDENTICAL IN EVERY IMAGE):
- Sweater: Cozy red knitted sweater (#DC143C) with visible knit texture
- Collar: White ribbed collar visible at the neck
- Cuffs: White ribbed cuffs at the wrists
- Pattern: Small white snowflake pattern on the chest area of sweater
- No pants: Anthropomorphic style - sweater only
- Accessories: Small honey pot icon embroidered on the left chest

DISTINCTIVE MARKS:
- One patch of lighter brown fur on the right shoulder
- Belly is slightly more cream-colored than rest of body`,

      mouse: `${protagonist}, a ${childAge}-year-old anthropomorphic mouse character with the following EXACT physical characteristics:

FACIAL FEATURES (CRITICAL - MUST BE IDENTICAL):
- Face shape: Small pointed face with soft features
- Fur color: Soft gray fur (#A9A9A9) with lighter gray on belly
- Eyes: Very large expressive brown eyes (#654321), proportionally oversized for cuteness
- Nose: Tiny pink nose (#FFB6C1), always twitching
- Whiskers: 10 delicate whiskers on each side (20 total), each 2cm long
- Ears: Very large round ears (proportionally 1/3 of head size), pink inside with visible veins
- Teeth: Two small white front teeth visible when smiling
- Cheeks: Slightly puffy cheeks

BODY & PROPORTIONS (CRITICAL - MUST BE IDENTICAL):
- Height: 60cm tall when standing upright (smallest protagonist)
- Build: Small, nimble, and delicate proportions
- Tail: Long thin tail (30cm length), same gray color as body, slightly curved
- Paws: Very small pink paws with 4 tiny fingers, delicate
- Posture: Stands upright, alert stance with hands often clasped

CLOTHING (CRITICAL - MUST BE IDENTICAL IN EVERY IMAGE):
- Raincoat: Bright yellow raincoat (#FFD700) that reaches knees
- Buttons: Four red buttons (#FF0000) down the front
- Hood: Yellow hood with red inner lining, usually down
- Pockets: Two side pockets with red button closures
- No pants: Anthropomorphic style - raincoat only
- Accessories: Small blue umbrella attached to a belt loop (when not raining, folded)

DISTINCTIVE MARKS:
- White spot on the tip of the tail
- Left ear has a tiny notch at the top edge`,

      robot: `${protagonist}, a ${childAge}-year-old small robot character with the following EXACT physical characteristics:

BODY STRUCTURE (CRITICAL - MUST BE IDENTICAL):
- Head: Rounded dome-shaped head made of shiny silver metal (#C0C0C0)
- Head size: Perfectly spherical, 20cm diameter
- Body: Rectangular torso (25cm tall, 18cm wide) made of white metal (#F5F5F5)
- Body panels: Visible panel lines with small screws at corners
- Proportions: Head-to-body ratio is 1:1.25

FACIAL FEATURES (CRITICAL - MUST BE IDENTICAL):
- Eyes: Two large circular LED eyes, bright cyan blue (#00FFFF), always glowing
- Eye size: 4cm diameter each, positioned 6cm apart
- Eyelids: Mechanical eyelids that open/close with visible hinge mechanism
- Mouth: LED light strip display showing simple emotions (^_^ happy face most common)
- Antenna: Single antenna on top of head (10cm tall) with small red blinking light at tip
- Expression display: Digital screen on forehead showing battery level (always 85%)

LIMBS & EXTREMITIES (CRITICAL - MUST BE IDENTICAL):
- Arms: Thin robotic arms (15cm long) made of silver segmented metal tubes
- Arm joints: Visible ball joints at shoulders and elbows (black rubber connectors)
- Hands: Three-fingered mechanical hands with orange rubber fingertips
- Legs: Short sturdy legs (12cm tall) made of white metal matching body
- Feet: Rounded base feet with small black rubber treads, small blue LED lights on sides

COLOR SCHEME (CRITICAL - MUST BE IDENTICAL):
- Primary body: White metal (#F5F5F5)
- Head: Silver metal (#C0C0C0)
- Accent panels: Bright orange panels (#FF6600) on chest and back
- LED lights: Cyan blue eyes, red antenna light, blue foot lights
- Joint connectors: Black rubber (#2C2C2C)

CLOTHING & ACCESSORIES (CRITICAL - MUST BE IDENTICAL IN EVERY IMAGE):
- Chest panel: Orange rectangular panel with a heart symbol (♥) in white
- Back panel: Orange with small exhaust vent details
- Cape: Small red fabric cape (#FF0000) attached to shoulders with magnetic clips
- Badge: Small star-shaped gold badge on the left chest panel
- Utility belt: Thin black belt around waist with small tool pouches

DISTINCTIVE MARKS & DETAILS:
- Small dent on the upper right side of the head (looks like a dimple)
- Serial number "RBT-${childAge}00" printed in small black text on the back of the neck
- One antenna light blinks every 3 seconds
- Slight scratch on the left leg (vertical line, 2cm long)
- Small yellow caution stripe pattern on the back of each hand

MECHANICAL DETAILS:
- Visible spring mechanism in neck allowing head rotation
- Small vents on the sides of the body (4 on each side)
- Power button on the back (blue circular button)
- Charging port on the lower back (looks like a small circular socket)

PROPORTIONS REFERENCE:
- Total height: 65cm when standing upright
- Head: 20cm diameter
- Torso: 25cm tall × 18cm wide
- Arms: 15cm long each
- Legs: 12cm tall
- Cape length: 20cm from shoulders`,
    }

    // Obtenir le template de base ou créer une description générique ultra-détaillée
    const baseDescription =
      speciesTemplates[species.toLowerCase()] ||
      `${protagonist}, a ${childAge}-year-old ${species} character with the following EXACT physical characteristics:

FACIAL FEATURES (CRITICAL - MUST BE IDENTICAL):
- Large expressive eyes with bright irises
- Distinctive facial features unique to ${species}
- Warm, friendly expression with gentle smile
- Specific markings or patterns that make them instantly recognizable

BODY & PROPORTIONS (CRITICAL - MUST BE IDENTICAL):
- Height appropriate for ${childAge}-year-old ${species}
- Characteristic body shape and proportions
- Distinctive posture and stance
- Unique physical attributes

CLOTHING (CRITICAL - MUST BE IDENTICAL IN EVERY IMAGE):
- Signature outfit with specific colors and patterns
- Distinctive accessories that are always present
- Recognizable style elements

DISTINCTIVE MARKS:
- Unique identifying features
- Specific color patterns or markings`

    // Ajuster la description selon le ton et le thème avec des détails visuels précis
    let enhancedDescription = baseDescription

    // Ajout de détails visuels basés sur le ton
    if (tone.toLowerCase().includes('adventurous') || tone.toLowerCase().includes('exciting')) {
      enhancedDescription += `\n\nEXPRESSION & PERSONALITY VISUAL CUES:
- Eyes: Sparkle with curiosity, slightly wider with excitement
- Posture: Leaning forward eagerly, one foot slightly ahead
- Facial expression: Bright, enthusiastic smile with raised eyebrows`
    } else if (tone.toLowerCase().includes('calm') || tone.toLowerCase().includes('peaceful')) {
      enhancedDescription += `\n\nEXPRESSION & PERSONALITY VISUAL CUES:
- Eyes: Gentle, serene gaze with soft eyelids
- Posture: Relaxed, balanced stance with shoulders at ease
- Facial expression: Soft, peaceful smile with calm demeanor`
    } else if (tone.toLowerCase().includes('joyful') || tone.toLowerCase().includes('happy')) {
      enhancedDescription += `\n\nEXPRESSION & PERSONALITY VISUAL CUES:
- Eyes: Bright and cheerful with visible joy
- Posture: Upright and energetic, possibly with slight bounce
- Facial expression: Wide, infectious smile radiating warmth and happiness`
    }

    // Ajout d'accessoires thématiques avec détails précis
    if (theme.toLowerCase().includes('magic') || theme.toLowerCase().includes('fantasy')) {
      enhancedDescription += `\n\nTHEMATIC ACCESSORY (ALWAYS VISIBLE):
- Magic charm: Small glowing crystal pendant on a silver chain around neck
- Crystal color: Soft purple glow (#9370DB) with sparkle effect
- Position: Hangs at chest level, always visible over clothing`
    } else if (theme.toLowerCase().includes('nature') || theme.toLowerCase().includes('forest')) {
      enhancedDescription += `\n\nTHEMATIC ACCESSORY (ALWAYS VISIBLE):
- Nature crown: Small crown made of green leaves and tiny white flowers
- Crown details: 5 oak leaves with 3 small daisies interspersed
- Position: Sits on top of head, slightly tilted to the right`
    } else if (theme.toLowerCase().includes('space') || theme.toLowerCase().includes('cosmic')) {
      enhancedDescription += `\n\nTHEMATIC ACCESSORY (ALWAYS VISIBLE):
- Star badge: Five-pointed golden star pin with shimmering effect
- Badge details: Gold color (#FFD700) with subtle sparkle, 3cm diameter
- Position: Pinned to the left chest area, always clearly visible`
    }

    // Ajouter les règles de cohérence strictes
    enhancedDescription += `\n\n⚠️ ABSOLUTE CONSISTENCY RULES:
1. This character description is CANONICAL and IMMUTABLE
2. EVERY detail specified above MUST appear in EVERY image
3. NO variations in clothing, colors, or physical features are allowed
4. The character must be INSTANTLY recognizable from image to image
5. Maintain EXACT proportions and visual characteristics across all illustrations`

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
