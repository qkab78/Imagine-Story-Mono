import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import {
  IStoryGenerationService,
  StoryGenerationPayload,
} from '#stories/domain/services/i_story_generation'
import { StoryGenerated } from '#stories/domain/services/types/story_generated'
import { IStoryImageGenerationService } from '#stories/domain/services/i_story_image_generation_service'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { ChapterFactory } from '#stories/domain/factories/chapter_factory'
import { Slug } from '#stories/domain/value-objects/metadata/slug.vo'
import type { Story } from '#stories/domain/entities/story.entity'
import type {
  ImageGenerationContext,
  ChapterContent,
  CharacterReferenceResult,
} from '#stories/domain/services/types/image_generation_types'
import OpenAI from 'openai'
import env from '#start/env'

/**
 * Service de génération d'histoires utilisant OpenAI pour le texte et un provider d'images
 *
 * Architecture:
 * - Génération de texte: OpenAI GPT
 * - Génération d'images: Provider injectable (Leonardo AI, Gemini, etc.)
 */
@inject()
export class OpenAiStoryGenerationService implements IStoryGenerationService {
  private readonly openai: OpenAI

  constructor(
    private readonly imageGenerationService: IStoryImageGenerationService,
    private readonly storyRepository: IStoryRepository
  ) {
    this.openai = new OpenAI({ apiKey: env.get('OPENAI_API_KEY') })
  }

  /**
   * Génère un slug unique en vérifiant s'il existe déjà dans la base de données.
   * Si le slug existe, incrémente avec un suffixe numérique (ex: my-story-2, my-story-3)
   * @private
   */
  private async generateUniqueSlug(baseTitle: string): Promise<string> {
    const MAX_SLUG_ATTEMPTS = 100

    // Utiliser Slug.fromTitle() pour générer un slug valide selon les règles de validation
    const baseSlugVO = Slug.fromTitle(baseTitle)
    const baseSlug = baseSlugVO.getValue()
    let counter = 2

    // Vérifier si le slug de base existe déjà
    if (!(await this.storyRepository.existsBySlug(baseSlugVO))) {
      return baseSlug
    }

    // Le slug existe, chercher une variante unique
    logger.info(`🔄 Slug "${baseSlug}" existe déjà, recherche d'un slug unique...`)

    while (counter <= MAX_SLUG_ATTEMPTS) {
      const candidateSlug = `${baseSlug}-${counter}`
      const candidateSlugVO = Slug.create(candidateSlug)

      if (!(await this.storyRepository.existsBySlug(candidateSlugVO))) {
        logger.info(`✅ Slug unique trouvé: "${candidateSlug}" (original: "${baseSlug}")`)
        return candidateSlug
      }

      counter++
    }

    // Fallback avec timestamp si trop de duplications
    const timestampSlug = `${baseSlug}-${Date.now()}`
    logger.warn(
      `⚠️ Plus de ${MAX_SLUG_ATTEMPTS} duplications, utilisation du timestamp: ${timestampSlug}`
    )
    return timestampSlug
  }

  /**
   * Convert an existing story entity to the text JSON format used internally.
   * Used when resuming generation from existing text.
   */
  private storyToTextJson(story: Story): any {
    return {
      title: story.title,
      synopsis: story.synopsis,
      theme: story.theme.name,
      protagonist: story.protagonist,
      childAge: story.childAge.getValue(),
      numberOfChapters: story.numberOfChapters,
      language: story.language.name,
      tone: story.tone.name,
      species: story.species,
      slug: story.slug.getValue(),
      chapters: story.chapters.map((chapter) => ({
        title: chapter.title,
        content: chapter.content,
      })),
      conclusion: story.conclusion,
    }
  }

  /**
   * Save generated text content to the database.
   * This allows resuming from image generation if it fails.
   */
  private async saveGeneratedText(
    story: Story,
    storyTextJson: any,
    slug: string
  ): Promise<void> {
    const chapters = storyTextJson.chapters.map((chapter: any, index: number) => {
      return ChapterFactory.createWithoutImage({
        position: index + 1,
        title: chapter.title,
        content: chapter.content,
      })
    })

    const updatedStory = story.updateGeneratedText(
      chapters,
      storyTextJson.conclusion || '',
      storyTextJson.title,
      Slug.create(slug)
    )

    await this.storyRepository.save(updatedStory)
  }

  /**
   * Generate and parse story text from OpenAI.
   * Extracts and validates JSON response.
   */
  private async generateAndParseStoryText(payload: StoryGenerationPayload): Promise<any> {
    const storyText = await this.generateStoryText(payload)

    // Log raw response for debugging
    logger.debug('📄 Longueur de la réponse OpenAI:', storyText.length, 'caractères')
    logger.debug('📄 Réponse OpenAI brute (premiers 1000 chars):', storyText.substring(0, 1000))
    logger.debug(
      '📄 Réponse OpenAI brute (derniers 500 chars):',
      storyText.substring(storyText.length - 500)
    )

    // Clean and extract JSON
    let cleanedJson: string
    try {
      cleanedJson = this.extractJsonFromResponse(storyText)
    } catch (error: any) {
      logger.error('❌ Erreur lors du nettoyage de la réponse:', error)
      logger.error('📄 Réponse complète:', storyText)
      throw new Error(`Impossible d'extraire le JSON de la réponse OpenAI: ${error.message}`)
    }

    // Parse JSON
    let storyTextJson: any
    try {
      storyTextJson = JSON.parse(cleanedJson)
    } catch (parseError: any) {
      logger.error('❌ Erreur de parsing JSON:', parseError.message)
      logger.error('📄 JSON nettoyé:', cleanedJson)
      throw new Error(`Le JSON retourné par OpenAI est invalide: ${parseError.message}`)
    }

    // Validate chapters exist
    if (!storyTextJson.chapters || !Array.isArray(storyTextJson.chapters)) {
      logger.error(
        '❌ Structure de la réponse OpenAI invalide:',
        JSON.stringify(storyTextJson, null, 2)
      )
      throw new Error('La réponse OpenAI ne contient pas de chapitres valides')
    }

    // Warn if chapter count doesn't match
    if (storyTextJson.chapters.length !== payload.numberOfChapters) {
      logger.warn(
        `⚠️ Nombre de chapitres incorrect: attendu ${payload.numberOfChapters}, reçu ${storyTextJson.chapters.length}`
      )
    }

    return storyTextJson
  }

  /**
   * Nettoie et extrait le JSON de la réponse OpenAI
   * Gère les cas où OpenAI retourne du markdown ou du texte supplémentaire
   */
  private extractJsonFromResponse(text: string): string {
    // Nettoyer le texte
    let cleaned = text.trim()

    // Retirer les blocs markdown ```json ... ``` ou ``` ... ```
    const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (jsonBlockMatch) {
      cleaned = jsonBlockMatch[1].trim()
    }

    // Chercher le premier { et dernier } pour extraire le JSON
    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1)
    }

    return cleaned
  }

  /**
   * Génère le contenu texte de l'histoire via OpenAI GPT
   * @private
   */
  private async generateStoryText(payload: StoryGenerationPayload): Promise<string> {
    const { synopsis, theme, childAge, numberOfChapters, language, protagonist, tone, species } =
      payload

    const response = await this.openai.chat.completions.create({
      model: env.get('OPENAI_MODEL'),
      max_tokens: 16000,
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: `You are a children's storyteller. Write complete stories in ${language} for ${childAge}-year-old children.
IMPORTANT: You MUST write ALL ${numberOfChapters} chapters with full content (300-600 words each).
Generate a title and slug (lowercase, ASCII only, no accents) for the story.
Return ONLY valid JSON. No markdown, no code blocks, no explanations.`,
        },
        {
          role: 'user',
          content: `Write a complete ${numberOfChapters}-chapter story for ${protagonist}, a ${childAge}-year-old ${species}.

${synopsis ? `Synopsis: ${synopsis}` : ''}
Theme: ${theme}
Tone: ${tone}

CRITICAL REQUIREMENTS:
1. Write EXACTLY ${numberOfChapters} chapters
2. Each chapter MUST have 300-600 words of actual story content
3. Write in ${language}
4. Include a conclusion at the end
5. Slug must be lowercase ASCII (no accents: é→e, à→a, etc.)

Return ONLY this JSON structure:
{
  "title": "Story title in ${language}",
  "synopsis": "Brief summary",
  "theme": "${theme}",
  "protagonist": "${protagonist}",
  "childAge": ${childAge},
  "numberOfChapters": ${numberOfChapters},
  "language": "${language}",
  "tone": "${tone}",
  "species": "${species}",
  "slug": "lowercase-ascii-slug",
  "chapters": [
    {
      "title": "Chapter 1 title",
      "content": "Full chapter content here (300-600 words)..."
    }
  ],
  "conclusion": "Story conclusion"
}

Start writing now. Include ALL ${numberOfChapters} chapters with full content.`,
        },
      ],
    })

    // Log de debug pour vérifier si la réponse a été tronquée
    logger.debug('🔍 OpenAI finish_reason:', response.choices[0].finish_reason)
    logger.debug('🔍 OpenAI usage:', JSON.stringify(response.usage))

    if (response.choices[0].finish_reason === 'length') {
      logger.warn(
        '⚠️ La réponse OpenAI a été tronquée (finish_reason: length). La réponse est incomplète.'
      )
    }

    return response.choices[0].message.content?.trim() || ''
  }

  /**
   * Génère une histoire complète avec texte et images
   *
   * Flux:
   * 1. Vérifier si le texte existe déjà (génération incrémentale)
   * 2. Si non, générer le contenu texte de l'histoire (OpenAI) et sauvegarder
   * 3. Générer la character reference sheet (Image Provider)
   * 4. Générer cover image avec character reference
   * 5. Générer chapter images avec character reference
   */
  async generateStory(payload: StoryGenerationPayload): Promise<StoryGenerated> {
    logger.info(
      `🎬 Début de la génération d'histoire complète avec ${this.imageGenerationService.getProviderName()}...`
    )
    const startTime = Date.now()

    try {
      let storyTextJson: any
      let slug!: string
      let existingStory: Story | null = null
      let textWasReused = false

      // ÉTAPE 1: Vérifier si le texte existe déjà (génération incrémentale)
      // Only check for existing text if storyId is provided (async flow)
      if (payload.storyId) {
        existingStory = await this.storyRepository.findById(payload.storyId)
        if (!existingStory) {
          throw new Error(`Story not found: ${payload.storyId}`)
        }

        if (existingStory.hasGeneratedText()) {
          logger.info('📝 Texte existant trouvé, reprise de la génération d\'images...')
          storyTextJson = this.storyToTextJson(existingStory)
          slug = existingStory.slug.getValue()
          textWasReused = true
          logger.info(`📖 ${storyTextJson.chapters.length} chapitre(s) récupéré(s) de la base de données`)
        }
      }

      // Generate text if not already available
      if (!textWasReused) {
        // Générer un slug unique en vérifiant les duplications
        slug = await this.generateUniqueSlug(payload.title)

        // Générer le contenu texte de l'histoire via OpenAI
        const storyStartTime = Date.now()
        logger.info("📝 Génération du contenu texte de l'histoire (OpenAI)...")

        storyTextJson = await this.generateAndParseStoryText(payload)

        const storyEndTime = Date.now()
        logger.info(`✅ Texte généré en ${((storyEndTime - storyStartTime) / 1000).toFixed(2)}s`)
        logger.info(`📖 ${storyTextJson.chapters.length} chapitre(s) généré(s)`)

        // SAUVEGARDER immédiatement le texte généré (only if we have an existing story)
        if (existingStory) {
          await this.saveGeneratedText(existingStory, storyTextJson, slug)
          logger.info('💾 Texte sauvegardé en base de données')
        }
      }

      logger.debug('📄 Structure JSON complète:', JSON.stringify(storyTextJson, null, 2))

      // Créer le contexte de génération d'images
      const imageContext: ImageGenerationContext = {
        title: storyTextJson.title || payload.title,
        synopsis: storyTextJson.synopsis || payload.synopsis,
        theme: payload.theme,
        protagonist: storyTextJson.protagonist || payload.protagonist,
        childAge: payload.childAge,
        numberOfChapters: payload.numberOfChapters,
        language: payload.language,
        tone: payload.tone,
        species: payload.species,
        slug,
        appearancePreset: payload.appearancePreset,
        illustrationStyle: payload.illustrationStyle,
      }

      // ÉTAPE 2: Générer la character reference (si le provider supporte)
      let characterReference: CharacterReferenceResult | undefined
      const referenceStartTime = Date.now()
      logger.info('🎨 Génération de la character reference sheet...')

      try {
        characterReference =
          await this.imageGenerationService.createCharacterReference(imageContext)
        const referenceEndTime = Date.now()
        logger.info(
          `✅ Character reference créée en ${((referenceEndTime - referenceStartTime) / 1000).toFixed(2)}s`
        )
      } catch (error: any) {
        logger.warn(
          '⚠️ Échec création character reference, fallback vers text-to-image:',
          error.message
        )
        characterReference = undefined
      }

      // ÉTAPE 3: Générer cover image
      const parallelStartTime = Date.now()
      logger.info('🚀 Génération cover image...')
      const coverResult = await this.imageGenerationService.generateCoverImage(
        imageContext,
        characterReference
      )
      if (!coverResult.imagePath) {
        throw new Error('Cover image path est null')
      }
      const coverImagePath = coverResult.imagePath
      const parallelEndTime = Date.now()
      logger.info(
        `✅ Cover image générée en ${((parallelEndTime - parallelStartTime) / 1000).toFixed(2)}s`
      )

      // ÉTAPE 4: Générer les images des chapitres avec character reference
      const chaptersStartTime = Date.now()
      logger.info('🎨 Génération des images de chapitres...')

      // Préparer les chapitres pour la génération d'images
      const chapterContents: ChapterContent[] = storyTextJson.chapters.map(
        (chapter: any, index: number) => ({
          title: chapter.title,
          content: chapter.content,
          index,
        })
      )

      // Ajouter le Character Visual Lock et cover image data au contexte pour les chapitres (cohérence Gemini)
      const imageContextWithLock: ImageGenerationContext = {
        ...imageContext,
        characterVisualLock: coverResult.characterVisualLock,
        coverImageData: coverResult.coverImageData, // Thread-safe: passé via context au lieu de propriété d'instance
      }

      const chapterImagesResponse = await this.imageGenerationService.generateChapterImages(
        imageContextWithLock,
        chapterContents,
        characterReference
      )

      const chaptersEndTime = Date.now()
      logger.info(
        `✅ ${chapterImagesResponse.metadata.successfulGeneration}/${storyTextJson.chapters.length} images de chapitres générées en ${((chaptersEndTime - chaptersStartTime) / 1000).toFixed(2)}s`
      )

      // ÉTAPE 5: Construire le résultat StoryGenerated
      // Créer les Chapter entities avec ChapterFactory
      const chapterEntities = storyTextJson.chapters.map((chapter: any, index: number) => {
        const chapterImage = chapterImagesResponse.images.find((img) => img.chapterIndex === index)
        return ChapterFactory.create({
          position: index + 1,
          title: chapter.title,
          content: chapter.content,
          imageUrl: chapterImage?.imagePath || undefined,
        })
      })

      const endTime = Date.now()
      const totalTime = ((endTime - startTime) / 1000).toFixed(2)
      logger.info(`🎉 Histoire complète générée avec succès en ${totalTime}s`)
      logger.info(
        `📊 Résumé: ${characterReference?.referenceId ? '✅ Character reference utilisée' : '⚠️ Text-to-image sans référence'}`
      )

      return {
        title: imageContext.title,
        synopsis: imageContext.synopsis,
        theme: payload.theme,
        protagonist: imageContext.protagonist,
        childAge: payload.childAge,
        numberOfChapters: payload.numberOfChapters,
        language: payload.language,
        tone: payload.tone,
        species: payload.species,
        conclusion: storyTextJson.conclusion || '',
        slug,
        chapters: chapterEntities,
        coverImageUrl: coverImagePath,
        ownerId: payload.ownerId,
        isPublic: payload.isPublic,
        characterVisualLock: coverResult.characterVisualLock,
      }
    } catch (error: any) {
      logger.error("💥 Erreur lors de la génération de l'histoire:", error)
      throw new Error(`Story generation failed: ${error.message}`)
    }
  }
}
