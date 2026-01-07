/**
 * Service de génération des images pour les chapitres d'histoires
 * Utilise Leonardo AI pour une meilleure cohérence des personnages
 */

import logger from '@adonisjs/core/services/logger'
import OpenAI from 'openai'
import env from '#start/env'
import fs from 'node:fs'
import path from 'node:path'
import app from '@adonisjs/core/services/app'
import { IStorageService } from '#stories/domain/services/IStorageService'
import {
  StoryGenerationContext,
  ChapterImage,
  ChapterImageGenerationResponse,
  isChapterImage,
} from '../types/enhanced_story_types.js'
import {
  generateChapterImagesWithLeonardo,
  testLeonardoConnection,
} from '../services/leonardo_ai_service.js'

// Configuration OpenAI (backup)
const openai = new OpenAI({
  apiKey: env.get('OPENAI_API_KEY'),
})

/**
 * Génère des images pour tous les chapitres d'une histoire
 * Utilise Leonardo AI en priorité, avec fallback sur DALL-E
 */
export async function generateChapterImages(
  context: StoryGenerationContext,
  chapters: any[],
  storySlug: string
): Promise<ChapterImageGenerationResponse> {
  // Tester la connexion Leonardo AI
  const leonardoAvailable = await testLeonardoConnection()

  if (leonardoAvailable) {
    logger.info('🎨 Utilisation de Leonardo AI pour la génération des images de chapitres')
    try {
      return await generateChapterImagesWithLeonardo(context, chapters, storySlug)
    } catch (error) {
      logger.error('❌ Erreur Leonardo AI, fallback sur DALL-E:', error)
      return await generateChapterImagesWithDallE(context, chapters, storySlug)
    }
  } else {
    logger.info('🤖 Utilisation de DALL-E pour la génération des images de chapitres')
    return await generateChapterImagesWithDallE(context, chapters, storySlug)
  }
}

/**
 * Génère des images avec DALL-E (méthode originale)
 */
async function generateChapterImagesWithDallE(
  context: StoryGenerationContext,
  chapters: any[],
  storySlug: string
): Promise<ChapterImageGenerationResponse> {
  const chapterImages: ChapterImage[] = []
  const errors: string[] = []
  let successfulGeneration = 0

  // Créer le dossier de destination s'il n'existe pas
  const chaptersDir = path.join(process.cwd(), 'uploads', 'stories', 'chapters')
  if (!fs.existsSync(chaptersDir)) {
    fs.mkdirSync(chaptersDir, { recursive: true })
  }

  // Génération parallèle avec limitation de concurrence
  const concurrency = 2 // Limiter à 2 requêtes simultanées pour éviter les rate limits
  const chapterBatches: any[][] = []

  for (let i = 0; i < chapters.length; i += concurrency) {
    chapterBatches.push(chapters.slice(i, i + concurrency))
  }

  for (const batch of chapterBatches) {
    const batchPromises = batch.map(async (chapter, batchIndex) => {
      const actualIndex = chapterBatches.indexOf(batch) * concurrency + batchIndex
      return generateSingleChapterImage(context, chapter, actualIndex, storySlug)
    })

    const batchResults = await Promise.allSettled(batchPromises)

    batchResults.forEach((result, batchIndex) => {
      if (result.status === 'fulfilled' && result.value) {
        chapterImages.push(result.value)
        successfulGeneration++
      } else if (result.status === 'rejected') {
        const actualIndex = chapterBatches.indexOf(batch) * concurrency + batchIndex
        errors.push(`Chapitre ${actualIndex + 1}: ${result.reason}`)
      }
    })

    // Pause entre les batches pour respecter les rate limits
    if (chapterBatches.indexOf(batch) < chapterBatches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  return {
    images: chapterImages.sort((a, b) => a.chapterIndex - b.chapterIndex),
    metadata: {
      generatedAt: new Date().toISOString(),
      model: 'dall-e-3',
      totalImages: chapters.length,
      successfulGeneration,
      errors: errors.length > 0 ? errors : undefined,
    },
  }
}

/**
 * Génère une image pour un chapitre spécifique avec retry automatique
 */
async function generateSingleChapterImage(
  context: StoryGenerationContext,
  chapter: any,
  chapterIndex: number,
  storySlug: string
): Promise<ChapterImage | null> {
  const fileName = `${storySlug}_chapter_${chapterIndex + 1}.png`
  logger.info(`Génération image pour chapitre ${chapterIndex + 1}: ${chapter.title}`)

  // Première tentative avec le prompt complet
  try {
    const prompt = createChapterImagePrompt(context, chapter, chapterIndex, false)

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    })

    const imageUrl = response.data?.[0]?.url
    if (!imageUrl) {
      throw new Error("Aucune URL d'image reçue d'OpenAI")
    }

    // Télécharger et sauvegarder l'image
    const localPath = await downloadChapterImage(imageUrl, fileName)

    return {
      chapterIndex,
      chapterTitle: chapter.title || `Chapitre ${chapterIndex + 1}`,
      imagePath: localPath,
      imageUrl: imageUrl,
      prompt: prompt,
      generatedAt: new Date().toISOString(),
    }
  } catch (error: any) {
    logger.warn(`Première tentative échouée pour chapitre ${chapterIndex + 1}:`, error.message)

    // Si c'est une violation de content policy, essayer avec le prompt simplifié
    if (error.code === 'content_policy_violation' || error.message?.includes('safety system')) {
      logger.info(`Retry avec prompt simplifié pour chapitre ${chapterIndex + 1}`)

      try {
        const simplifiedPrompt = createChapterImagePrompt(context, chapter, chapterIndex, true)

        const response = await openai.images.generate({
          model: 'dall-e-3',
          prompt: simplifiedPrompt,
          size: '1024x1024',
          quality: 'standard',
          n: 1,
        })

        const imageUrl = response.data?.[0]?.url
        if (!imageUrl) {
          throw new Error("Aucune URL d'image reçue d'OpenAI (retry)")
        }

        // Télécharger et sauvegarder l'image
        const localPath = await downloadChapterImage(imageUrl, fileName)

        return {
          chapterIndex,
          chapterTitle: chapter.title || `Chapitre ${chapterIndex + 1}`,
          imagePath: localPath,
          imageUrl: imageUrl,
          prompt: simplifiedPrompt,
          generatedAt: new Date().toISOString(),
        }
      } catch (retryError) {
        logger.error(`Retry échoué pour chapitre ${chapterIndex + 1}:`, retryError)
        throw retryError
      }
    } else {
      // Pour les autres types d'erreurs, ne pas retry
      throw error
    }
  }
}

/**
 * Filtre le contenu pour éviter les violations de politique de sécurité
 */
function sanitizeContent(content: string): string {
  if (!content) return ''

  // Mots et phrases potentiellement problématiques à éviter
  const problematicWords = [
    'violence',
    'fight',
    'combat',
    'battle',
    'guerre',
    'weapon',
    'arme',
    'gun',
    'sword',
    'épée',
    'death',
    'mort',
    'kill',
    'tuer',
    'blood',
    'sang',
    'hurt',
    'blessé',
    'pain',
    'douleur',
    'scary',
    'effrayant',
    'peur',
    'fear',
    'monster',
    'monstre',
    'nightmare',
    'cauchemar',
    'angry',
    'colère',
    'hate',
    'haine',
    'evil',
    'mal',
    'dark',
    'sombre',
    'shadow',
    'ombre',
    'cry',
    'pleurer',
    'sad',
    'triste',
    'tears',
    'larmes',
    'alone',
    'seul',
    'lost',
    'perdu',
  ]

  let sanitized = content.toLowerCase()

  // Remplacer les mots problématiques par des alternatives neutres
  problematicWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    sanitized = sanitized.replace(regex, 'adventure')
  })

  return sanitized
}

/**
 * Crée le prompt pour générer l'image d'un chapitre
 */
function createChapterImagePrompt(
  context: StoryGenerationContext,
  chapter: any,
  chapterIndex: number,
  useSimplified: boolean = false
): string {
  if (useSimplified) {
    return createSimplifiedPrompt(context, chapter, chapterIndex)
  }

  // Extraire et nettoyer le contenu du chapitre
  const chapterContent = chapter.content || ''
  const sanitizedContent = sanitizeContent(chapterContent)
  const chapterSummary =
    sanitizedContent.substring(0, 200) + (sanitizedContent.length > 200 ? '...' : '')

  return `
Children's book illustration for ${context.childAge}-year-old kids:

Story: "${context.title}"
Chapter ${chapterIndex + 1}: "${chapter.title || `Chapter ${chapterIndex + 1}`}"

Story context:
- Theme: ${context.theme}
- Main character: ${context.protagonist}
- Tone: happy and positive
- Character species: ${context.species}

Chapter summary:
${chapterSummary}

Illustration style:
- Colorful and friendly children's illustration
- Modern cartoon/animation style
- Bright and warm colors
- Balanced and attractive composition
- Child-friendly perspective
- Detailed but not cluttered background

Elements to include:
- Main scene from the chapter
- Main characters if mentioned
- Environment/setting appropriate to the theme
- Happy and positive atmosphere

Elements to absolutely avoid:
- Violence or scary content
- Inappropriate elements for ${context.childAge}-year-old children
- Negative or sad expressions
- Dangerous objects or stressful situations
- Text or letters in the image
- Dark or frightening themes
  `.trim()
}

/**
 * Crée un prompt simplifié et plus sûr
 */
function createSimplifiedPrompt(
  context: StoryGenerationContext,
  chapter: any,
  chapterIndex: number
): string {
  return `
Children's book illustration for ${context.childAge}-year-old kids:

A happy and colorful scene featuring ${context.protagonist} in a ${context.theme} setting.
Chapter ${chapterIndex + 1}: "${chapter.title || `Chapter ${chapterIndex + 1}`}"

Style: Modern cartoon illustration, bright colors, child-friendly, positive atmosphere.
Characters: ${context.species} characters in a happy adventure.
Setting: Safe and welcoming environment appropriate for young children.

Make it joyful, educational, and age-appropriate for ${context.childAge}-year-olds.
  `.trim()
}

/**
 * Télécharge une image depuis une URL et la sauvegarde localement
 */
async function downloadChapterImage(imageUrl: string, fileName: string): Promise<string> {
  try {
    const storageService = await app.container.make(IStorageService)
    const destinationPath = `chapters/${fileName}`

    const result = await storageService.uploadFromUrl(imageUrl, destinationPath, {
      contentType: 'image/png',
    })

    logger.info(`Image sauvegardée: ${result.path}`)
    return result.path
  } catch (error) {
    logger.error(`Erreur téléchargement image ${fileName}:`, error)
    throw new Error(`Échec du téléchargement de l'image: ${error}`)
  }
}

/**
 * Génère une image de placeholder en cas d'échec
 */
export function createPlaceholderChapterImage(
  chapterIndex: number,
  chapterTitle: string,
  _storySlug: string
): ChapterImage {
  return {
    chapterIndex,
    chapterTitle,
    imagePath: 'placeholder/chapter-placeholder.png',
    imageUrl: '/uploads/placeholder/chapter-placeholder.png',
    prompt: 'Placeholder image',
    generatedAt: new Date().toISOString(),
  }
}

/**
 * Valide qu'une image de chapitre est correcte
 */
export function validateChapterImage(image: any): image is ChapterImage {
  return isChapterImage(image)
}
