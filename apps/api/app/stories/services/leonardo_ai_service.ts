/**
 * Service Leonardo AI pour la génération d'images avec cohérence des personnages
 * Version corrigée avec les bons types
 */

import { Leonardo } from '@leonardo-ai/sdk'
import env from '#start/env'
import fs from 'node:fs'
import path from 'node:path'
import { writeFile } from 'node:fs'
import {
  StoryGenerationContext,
  ChapterImage,
  ChapterImageGenerationResponse,
} from '../types/enhanced_story_types.js'
import app from '@adonisjs/core/services/app'
import axios from 'axios'

// Configuration Leonardo AI
const leonardo = new Leonardo({
  bearerAuth: env.get('LEONARDO_AI_API_KEY'),
})

/**
 * Génère des images pour tous les chapitres d'une histoire avec Leonardo AI
 */
export async function generateChapterImagesWithLeonardo(
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

  console.log('🎨 Génération avec Leonardo AI - Stratégie de cohérence des personnages')

  // Étape 1: Créer une image de référence du personnage
  console.log('📝 Création d\'une image de référence du personnage...')
  const characterSeed = generateCharacterSeed(context)
  const referenceImageUrl = await createCharacterReference(context, storySlug, characterSeed)
  
  if (!referenceImageUrl) {
    console.warn('⚠️ Impossible de créer l\'image de référence, continuons avec prompts détaillés')
    throw new Error('Impossible de créer l\'image de référence')
  }

  // Génération séquentielle pour maintenir la cohérence
  for (let index = 0; index < chapters.length; index++) {
    try {
      console.log(`Génération image pour chapitre ${index + 1}: ${chapters[index].title}`)

      const chapterImage = await generateSingleChapterImageWithLeonardo(
        context,
        chapters[index],
        index,
        storySlug,
        characterSeed,
      )

      if (chapterImage) {
        chapterImages.push(chapterImage)
        successfulGeneration++
      }

      // Pause entre les générations pour éviter les rate limits
      if (index < chapters.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
    } catch (error: any) {
      console.error(`Erreur génération chapitre ${index + 1}:`, error.message)
      errors.push(`Chapitre ${index + 1}: ${error.message}`)
    }
  }

  return {
    images: chapterImages.sort((a, b) => a.chapterIndex - b.chapterIndex),
    metadata: {
      generatedAt: new Date().toISOString(),
      model: 'leonardo-ai-phoenix',
      totalImages: chapters.length,
      successfulGeneration,
      errors: errors.length > 0 ? errors : undefined,
    },
  }
}

/**
 * Génère une image pour un chapitre spécifique
 */
async function generateSingleChapterImageWithLeonardo(
  context: StoryGenerationContext,
  chapter: any,
  chapterIndex: number,
  storySlug: string,
  characterSeed: number,
): Promise<ChapterImage | null> {
  const fileName = `${storySlug}_chapter_${chapterIndex + 1}.png`

  try {
    let prompt = createLeonardoChapterPrompt(context, chapter, chapterIndex)

    console.log(`Génération avec prompt: ${prompt.substring(0, 100)}...`)

    // Première tentative avec seed pour cohérence
    let response
    try {
      response = await leonardo.image.createGeneration({
        prompt: prompt,
        modelId: 'aa77f04e-3eec-4034-9c07-d0f619684628', // Leonardo Phoenix
        width: 1024,
        height: 1024,
        numImages: 1,
        guidanceScale: 7,
        seed: characterSeed, // Utiliser le même seed pour la cohérence
        presetStyle: 'ANIME' as any
      })
    } catch (moderationError: any) {
      // Si erreur de modération, essayer avec un prompt plus sûr
      if (moderationError.message?.includes('moderated') || moderationError.message?.includes('403')) {
        console.log('❌ Contenu modéré, retry avec prompt simplifié...')

        prompt = createSafePrompt(context, chapterIndex)
        console.log(`Retry avec prompt sûr: ${prompt.substring(0, 100)}...`)

        response = await leonardo.image.createGeneration({
          prompt: prompt,
          modelId: 'aa77f04e-3eec-4034-9c07-d0f619684628',
          width: 1024,
          height: 1024,
          numImages: 1,
          guidanceScale: 7,
          presetStyle: 'CINEMATIC' as any
        })
      } else {
        throw moderationError
      }
    }

    console.log('Réponse Leonardo AI:', JSON.stringify(response, null, 2))

    // Récupérer l'ID de génération depuis la réponse
    let generationId = (response as any).object?.sdGenerationJob?.generationId
    console.log('Generation ID:', generationId)

    if (!generationId) {
      console.error('Structure de réponse Leonardo AI:', response)
      throw new Error(`Pas d'ID de génération reçu de Leonardo AI. Structure: ${JSON.stringify(response)}`)
    }

    console.log(`Génération ID: ${generationId}, en attente...`)
    // await new Promise(resolve => setTimeout(resolve, 3000))
    // Attendre que la génération soit terminée
    const generatedImages = await waitForGeneration(generationId)

    if (!generatedImages || generatedImages.length === 0) {
      throw new Error('Aucune image générée par Leonardo AI')
    }

    const imageUrl = generatedImages[0].url
    if (!imageUrl) {
      throw new Error('URL d\'image manquante dans la réponse Leonardo AI')
    }

    console.log(`Image générée: ${imageUrl}`)

    // Télécharger et sauvegarder l'image
    const localPath = await downloadImage(imageUrl, fileName)

    return {
      chapterIndex,
      chapterTitle: chapter.title || `Chapitre ${chapterIndex + 1}`,
      imagePath: localPath,
      imageUrl: imageUrl,
      prompt: prompt,
      generatedAt: new Date().toISOString(),
    }
  } catch (error: any) {
    console.error(`Erreur génération chapitre ${chapterIndex + 1}:`, error.message)
    throw error
  }
}

/**
 * Attendre que la génération soit terminée
 */
async function waitForGeneration(generationId: string, maxAttempts = 30): Promise<any[] | null> {
  let attempts = 0

  console.log(`Attente de la génération ${generationId}...`)

  while (attempts < maxAttempts) {
    try {
      const response = await leonardo.image.getGenerationById(generationId)

      const generation = (response as any).object?.generationsByPk
      if (!generation) {
        throw new Error('Génération non trouvée')
      }

      console.log(`Status génération: ${generation.status}`)

      if (generation.status === 'COMPLETE') {
        console.log(`Génération terminée avec ${generation.generatedImages?.length || 0} images`)
        return generation.generatedImages || []
      } else if (generation.status === 'FAILED') {
        throw new Error('Génération échouée sur Leonardo AI')
      }

      // Attendre 3 secondes avant de vérifier à nouveau
      await new Promise(resolve => setTimeout(resolve, 3000))
      attempts++
    } catch (error) {
      console.error('Erreur lors de l\'attente de génération:', error)
      attempts++
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  }

  throw new Error('Timeout: génération Leonardo AI trop longue (>90s)')
}

/**
 * Crée le prompt optimisé pour Leonardo AI avec cohérence renforcée
 */
function createLeonardoChapterPrompt(
  context: StoryGenerationContext,
  chapter: any,
  chapterIndex: number
): string {
  const characterDescription = getConsistentCharacterDescription(context)
  const chapterContent = sanitizeContent(chapter.content || '')
  const chapterSummary = chapterContent.substring(0, 120) + (chapterContent.length > 120 ? '...' : '')

  return `
EXACT CHARACTER REFERENCE: ${characterDescription}

Children's book illustration showing this EXACT character in Chapter ${chapterIndex + 1}: ${chapter.title || `Chapter ${chapterIndex + 1}`}

Story scene: ${chapterSummary}
Setting: ${context.theme} environment

CRITICAL CONSISTENCY REQUIREMENTS:
- Character appearance MUST be identical to reference: same colors, same features, same proportions, same clothing
- Only the background/scene changes, character stays exactly the same
- Same art style: bright colorful children's book illustration
- Same perspective and lighting style
- Professional quality, child-friendly, detailed but clean

The character "${context.protagonist}" must look exactly like the established design in every detail.
  `.trim()
}

/**
 * Crée un prompt ultra-sûr pour éviter la modération
 */
function createSafePrompt(
  context: StoryGenerationContext,
  chapterIndex: number
): string {
  const species = context.species?.toLowerCase() || 'animal'
  const protagonist = context.protagonist || 'character'

  return `
Children's book illustration: A friendly ${species} character named ${protagonist} in a colorful ${context.theme} environment.

Chapter ${chapterIndex + 1} scene showing the character on an adventure.

Style: Bright cartoon illustration, warm colors, child-friendly art style, professional children's book quality.

Safe content for young readers, happy and positive scene.
  `.trim()
}

/**
 * Génère une description physique consistante du personnage principal
 */
function getConsistentCharacterDescription(context: StoryGenerationContext): string {
  const species = context.species?.toLowerCase() || 'animal'
  const protagonist = context.protagonist || 'character'

  const speciesDescriptions: Record<string, string> = {
    'rabbit': `${protagonist}, a small fluffy white rabbit with long ears, black eyes, pink nose, blue vest, brown pants`,
    'bear': `${protagonist}, a friendly brown bear with round ears, small black eyes, red shirt, blue overalls`,
    'cat': `${protagonist}, an orange tabby cat with white chest, green eyes, yellow bow tie`,
    'dog': `${protagonist}, a golden retriever puppy with floppy ears, brown eyes, blue collar`,
    'fox': `${protagonist}, a red fox with pointed ears, amber eyes, white chest, green scarf`,
    'mouse': `${protagonist}, a small gray mouse with round ears, black eyes, purple jacket`,
    'squirrel': `${protagonist}, a brown squirrel with bushy tail, dark eyes, acorn hat`,
    'elephant': `${protagonist}, a small gray elephant with large ears, colorful headband`
  }

  return speciesDescriptions[species] ||
    `${protagonist}, a friendly ${species} with distinctive features, colorful clothing`
}

/**
 * Filtre le contenu pour éviter les violations de politique
 */
function sanitizeContent(content: string): string {
  if (!content) return 'happy adventure'

  const problematicWords = [
    // Mots déclenchant la modération
    'tit', 'petit', 'little', 'small', 'tiny',
    // Mots potentiellement problématiques
    'violence', 'fight', 'combat', 'battle', 'guerre', 'weapon', 'arme', 'gun', 'sword', 'épée',
    'death', 'mort', 'kill', 'tuer', 'blood', 'sang', 'hurt', 'blessé', 'pain', 'douleur',
    'scary', 'effrayant', 'peur', 'fear', 'monster', 'monstre', 'nightmare', 'cauchemar',
    'angry', 'colère', 'hate', 'haine', 'evil', 'mal', 'dark', 'sombre', 'shadow', 'ombre'
  ]

  let sanitized = content

  // Remplacer les mots problématiques de manière case-insensitive
  problematicWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    sanitized = sanitized.replace(regex, 'young')
  })

  // Remplacements spécifiques pour éviter la modération
  sanitized = sanitized
    .replace(/petit\s+/gi, 'young ')
    .replace(/petite\s+/gi, 'young ')
    .replace(/little\s+/gi, 'young ')
    .replace(/small\s+/gi, 'young ')
    .replace(/tiny\s+/gi, 'young ')
    .replace(/\btit\b/gi, 'bird')

  return sanitized
}

/**
 * Télécharge une image depuis une URL et la sauvegarde localement
 */
async function downloadImage(imageUrl: string, fileName: string): Promise<string> {
  try {
    console.log(`Téléchargement de l'image: ${fileName}`)
    const imagePath = app.makePath(`uploads/stories/chapters/${fileName}`)
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    if (!response.data || response.data.length === 0) {
      throw new Error('Aucune image reçue')
    }

    return new Promise((resolve, reject) => {
      writeFile(imagePath, response.data, (err) => {
        if (err) reject(err);
        console.log(`Image downloaded successfully! ${imagePath}`);
      });

      console.log(`Image sauvegardée: ${imagePath}`)
      return resolve(imagePath);
    });
  } catch (error) {
    console.error(`Erreur téléchargement image ${fileName}:`, error)
    throw new Error(`Échec du téléchargement de l'image: ${error}`)
  }
}

/**
 * Génère une image de couverture avec Leonardo AI
 */
export async function generateCoverImageWithLeonardo(
  context: StoryGenerationContext & { slug: string }
): Promise<string | null> {
  try {
    console.log('🖼️ Génération image de couverture avec Leonardo AI...')
    
    const characterSeed = generateCharacterSeed(context)
    const characterDescription = getConsistentCharacterDescription(context)
    
    const coverPrompt = `
Book cover illustration for children's story: "${context.title}"

${characterDescription} as the main character, prominently featured in the center of the composition.
Setting: Beautiful ${context.theme} environment as background.
Story synopsis: ${context.synopsis}

Style: Professional children's book cover, vibrant colors, magical atmosphere, high quality illustration.
Composition: Main character in foreground, thematic background, title space at top.
Age-appropriate for ${context.childAge} years old, inviting and warm feeling.
Art style: Modern children's book illustration, detailed but clean, professional cover quality.

No text or titles in the image, just the visual cover scene.
    `.trim()

    console.log(`🎭 Génération couverture avec seed: ${characterSeed}`)

    const response = await leonardo.image.createGeneration({
      prompt: coverPrompt,
      modelId: 'aa77f04e-3eec-4034-9c07-d0f619684628',
      width: 1024,
      height: 1024,
      numImages: 1,
      guidanceScale: 8,
      seed: characterSeed, // Même seed que les chapitres pour cohérence
      presetStyle: 'ANIME' as any
    })

    const generationId = (response as any).object?.sdGenerationJob?.generationId
    if (!generationId) {
      console.error('❌ Pas d\'ID pour l\'image de couverture')
      return null
    }

    console.log(`⏳ Attente génération couverture: ${generationId}`)
    const generatedImages = await waitForGeneration(generationId)
    
    if (!generatedImages || generatedImages.length === 0) {
      console.error('❌ Aucune image de couverture générée')
      return null
    }

    const coverImageUrl = generatedImages[0].url
    if (!coverImageUrl) {
      console.error('❌ URL manquante pour image de couverture')
      return null
    }

    // Sauvegarder l'image de couverture
    const coverFileName = `${context.slug}.webp`
    const coverPath = await downloadCoverImage(coverImageUrl, coverFileName)
    
    console.log('✅ Image de couverture Leonardo AI créée')
    return coverPath

  } catch (error) {
    console.error('❌ Erreur génération couverture Leonardo AI:', error)
    return null
  }
}

/**
 * Télécharge une image de couverture
 */
async function downloadCoverImage(imageUrl: string, fileName: string): Promise<string> {
  try {
    console.log(`📥 Téléchargement couverture: ${fileName}`)
    const imagePath = app.makePath(`uploads/stories/covers/${fileName}`)
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    if (!response.data || response.data.length === 0) {
      throw new Error('Aucune image reçue')
    }

    return new Promise((resolve, reject) => {
      writeFile(imagePath, response.data, (err) => {
        if (err) reject(err);
        console.log(`✅ Couverture téléchargée: ${imagePath}`);
        resolve(imagePath);
      });
    });
  } catch (error) {
    console.error(`❌ Erreur téléchargement couverture ${fileName}:`, error)
    throw new Error(`Échec du téléchargement de l'image: ${error}`)
  }
}

/**
 * Test de connexion à Leonardo AI
 */
export async function testLeonardoConnection(): Promise<boolean> {
  try {
    const response = await leonardo.user.getUserSelf()
    console.log('Connexion Leonardo AI réussie:', (response as any).user_details?.[0]?.user?.username || 'Utilisateur')
    return true
  } catch (error) {
    console.error('Erreur connexion Leonardo AI:', error)
    return false
  }
}

/**
 * Génère un seed unique basé sur le contexte de l'histoire
 */
function generateCharacterSeed(context: StoryGenerationContext): number {
  // Créer un seed basé sur les caractéristiques du personnage
  const seedString = `${context.protagonist}-${context.species}-${context.theme}`
  let hash = 0
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convertir en 32bit integer
  }
  // Retourner un nombre positif entre 1 et 4294967295
  return Math.abs(hash) || 1
}

/**
 * Crée une image de référence du personnage principal
 */
async function createCharacterReference(
  context: StoryGenerationContext, 
  storySlug: string,
  characterSeed: number
): Promise<string | null> {
  try {
    const characterDescription = getConsistentCharacterDescription(context)
    
    const referencePrompt = `
Character reference sheet: ${characterDescription}

Full body character design, front view, clean white background, children's book illustration style.
Standing pose, friendly expression, detailed character design for consistency across multiple illustrations.
Bright colors, professional quality, detailed but clean art style.
Reference sheet for maintaining visual consistency.
    `.trim()

    console.log(`🎭 Génération personnage de référence avec seed: ${characterSeed}`)

    const response = await leonardo.image.createGeneration({
      prompt: referencePrompt,
      modelId: 'aa77f04e-3eec-4034-9c07-d0f619684628',
      width: 1024,
      height: 1024,
      numImages: 1,
      guidanceScale: 8,
      seed: characterSeed, // Même seed pour cohérence
      presetStyle: 'ANIME' as any
    })

    const generationId = (response as any).object?.sdGenerationJob?.generationId
    if (!generationId) {
      console.error('Pas d\'ID pour l\'image de référence')
      return null
    }

    console.log(`⏳ Attente génération référence: ${generationId}`)
    const generatedImages = await waitForGeneration(generationId)
    
    if (!generatedImages || generatedImages.length === 0) {
      console.error('❌ Aucune image de référence générée')
      return null
    }

    const referenceImageUrl = generatedImages[0].url
    if (!referenceImageUrl) {
      console.error('❌ URL manquante pour image de référence')
      return null
    }

    // Sauvegarder l'image de référence
    const referenceFileName = `${storySlug}_character_reference.png`
    await downloadImage(referenceImageUrl, referenceFileName)
    
    console.log('✅ Image de référence du personnage créée')
    return referenceImageUrl

  } catch (error) {
    console.error('❌ Erreur création image de référence:', error)
    return null
  }
}