/**
 * Service de génération des images pour les chapitres d'histoires
 */

import OpenAI from 'openai'
import env from '#start/env'
import fs from 'node:fs'
import path from 'node:path'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import {
  StoryGenerationContext,
  ChapterImage,
  ChapterImageGenerationResponse,
  isChapterImage,
} from '../types/enhanced_story_types.js'

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: env.get('OPENAI_API_KEY'),
})

/**
 * Génère des images pour tous les chapitres d'une histoire
 */
export async function generateChapterImages(
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
      await new Promise(resolve => setTimeout(resolve, 2000))
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
 * Génère une image pour un chapitre spécifique
 */
async function generateSingleChapterImage(
  context: StoryGenerationContext,
  chapter: any,
  chapterIndex: number,
  storySlug: string
): Promise<ChapterImage | null> {
  try {
    const prompt = createChapterImagePrompt(context, chapter, chapterIndex)
    const fileName = `${storySlug}_chapter_${chapterIndex + 1}.png`
    
    console.log(`Génération image pour chapitre ${chapterIndex + 1}: ${chapter.title}`)

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    })

    const imageUrl = response.data?.[0]?.url
    if (!imageUrl) {
      throw new Error('Aucune URL d\'image reçue d\'OpenAI')
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
  } catch (error) {
    console.error(`Erreur génération image chapitre ${chapterIndex + 1}:`, error)
    throw error
  }
}

/**
 * Crée le prompt pour générer l'image d'un chapitre
 */
function createChapterImagePrompt(
  context: StoryGenerationContext,
  chapter: any,
  chapterIndex: number
): string {
  // Extraire un résumé du contenu du chapitre
  const chapterContent = chapter.content || ''
  const chapterSummary = chapterContent.substring(0, 300) + (chapterContent.length > 300 ? '...' : '')
  
  return `
Illustration pour livre d'enfants de ${context.childAge} ans:

Histoire: "${context.title}"
Chapitre ${chapterIndex + 1}: "${chapter.title || `Chapitre ${chapterIndex + 1}`}"

Contexte de l'histoire:
- Thème: ${context.theme}
- Protagoniste: ${context.protagonist}
- Ton: ${context.tone}
- Espèce des personnages: ${context.species}

Contenu du chapitre:
${chapterSummary}

Style d'illustration:
- Illustration colorée et amicale pour enfants
- Style cartoon/animation moderne
- Couleurs vives et chaleureuses
- Composition équilibrée et attrayante
- Perspective adaptée aux enfants
- Fond détaillé mais pas trop chargé

Éléments à inclure:
- Scène principale du chapitre
- Personnages principaux si mentionnés
- Environnement/décor approprié au thème
- Ambiance correspondant au ton "${context.tone}"

Éléments à éviter absolument:
- Violence ou contenu effrayant
- Éléments inappropriés pour des enfants de ${context.childAge} ans
- Expressions négatives ou tristes
- Objets dangereux ou situations stressantes
- Texte ou lettres dans l'image
  `.trim()
}

/**
 * Télécharge une image depuis une URL et la sauvegarde localement
 */
async function downloadChapterImage(imageUrl: string, fileName: string): Promise<string> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    const chaptersDir = path.join(process.cwd(), 'uploads', 'stories', 'chapters')
    const filePath = path.join(chaptersDir, fileName)
    
    if (!response.body) {
      throw new Error('Aucun contenu dans la réponse')
    }

    // Utiliser des streams Node.js natifs pour plus de performance
    const fileStream = createWriteStream(filePath)
    
    // Convertir le ReadableStream web en stream Node.js
    const nodeStream = new ReadableStream({
      start(controller) {
        const reader = response.body!.getReader()
        
        function pump(): Promise<void> {
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close()
              return
            }
            controller.enqueue(value)
            return pump()
          })
        }
        
        return pump()
      }
    })

    // Pipeline pour sauvegarder l'image
    await pipeline(
      nodeStream as any,
      fileStream
    )

    console.log(`Image sauvegardée: ${filePath}`)
    return `chapters/${fileName}`
  } catch (error) {
    console.error(`Erreur téléchargement image ${fileName}:`, error)
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