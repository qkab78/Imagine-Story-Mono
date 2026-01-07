/**
 * Service Leonardo AI pour la génération d'images avec cohérence des personnages
 * Version corrigée avec les bons types
 */

import { Leonardo } from '@leonardo-ai/sdk'
import env from '#start/env'
import fs from 'node:fs'
import path from 'node:path'
import {
  StoryGenerationContext,
  ChapterImage,
  ChapterImageGenerationResponse,
} from '../types/enhanced_story_types.js'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'
import { IStorageService } from '#stories/domain/services/IStorageService'

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
  storySlug: string,
  referenceImageUrl?: string | null,
  characterSeed?: number,
  initImageId?: string
): Promise<ChapterImageGenerationResponse> {
  const chapterImages: ChapterImage[] = []
  const errors: string[] = []
  let successfulGeneration = 0

  // Créer le dossier de destination s'il n'existe pas
  const chaptersDir = path.join(process.cwd(), 'uploads', 'stories', 'chapters')
  if (!fs.existsSync(chaptersDir)) {
    fs.mkdirSync(chaptersDir, { recursive: true })
  }

  logger.info('🎨 Génération avec Leonardo AI - Stratégie de cohérence des personnages')

  // Étape 1: Créer une image de référence du personnage (si non fournie)
  let finalReferenceImageUrl = referenceImageUrl
  let finalCharacterSeed = characterSeed

  if (!finalReferenceImageUrl || !finalCharacterSeed) {
    logger.info("📝 Création d'une image de référence du personnage...")
    finalCharacterSeed = finalCharacterSeed || generateCharacterSeed(context)
    finalReferenceImageUrl = await createCharacterReference(context, storySlug, finalCharacterSeed)

    if (!finalReferenceImageUrl) {
      logger.warn("⚠️ Impossible de créer l'image de référence, continuons avec prompts détaillés")
      throw new Error("Impossible de créer l'image de référence")
    }
  } else {
    logger.info("✅ Utilisation de l'image de référence fournie")
  }

  // Génération parallèle pour réduire le temps de traitement
  const parallelStartTime = Date.now()
  logger.info(`🚀 Génération parallèle de ${chapters.length} images de chapitres...`)

  if (initImageId) {
    logger.info(`🎨 Utilisation init image ID pour tous les chapitres: ${initImageId}`)
  }

  const generationPromises = chapters.map((chapter, index) => {
    logger.info(`📋 Planification génération image pour chapitre ${index + 1}: ${chapter.title}`)
    return generateSingleChapterImageWithLeonardo(
      context,
      chapter,
      index,
      storySlug,
      finalCharacterSeed!,
      initImageId
    ).then((chapterImage) => {
      if (chapterImage) {
        return { success: true, chapterImage, index }
      }
      return { success: false, chapterImage: null, index, error: 'Aucune image générée' }
    }).catch((error: any) => {
      logger.error(`❌ Erreur génération chapitre ${index + 1}:`, error.message)
      errors.push(`Chapitre ${index + 1}: ${error.message}`)
      return { success: false, chapterImage: null, index, error: error.message }
    })
  })

  // Attendre que toutes les générations se terminent (en parallèle)
  const results = await Promise.all(generationPromises)

  // Traiter les résultats et compter les succès
  results.forEach((result) => {
    if (result.success && result.chapterImage) {
      chapterImages.push(result.chapterImage)
      successfulGeneration++
    } else if (!result.success && result.error) {
      // L'erreur a déjà été ajoutée dans le catch, mais on s'assure qu'elle est bien dans le tableau
      if (!errors.some(e => e.includes(`Chapitre ${result.index + 1}`))) {
        errors.push(`Chapitre ${result.index + 1}: ${result.error}`)
      }
    }
  })

  const parallelEndTime = Date.now()
  logger.info(`⏱️  Génération parallèle images chapitres: ${((parallelEndTime - parallelStartTime) / 1000).toFixed(2)}s`)

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
  initImageId?: string
): Promise<ChapterImage | null> {
  const fileName = `${storySlug}_chapter_${chapterIndex + 1}.png`

  try {
    let prompt = createLeonardoChapterPrompt(context, chapter, chapterIndex)

    logger.info(`Génération avec prompt: ${prompt.substring(0, 100)}...`)

    // Première tentative avec seed pour cohérence
    let response
    try {
      const generationParams: any = {
        prompt: prompt,
        modelId: 'aa77f04e-3eec-4034-9c07-d0f619684628', // Leonardo Phoenix
        width: 1024,
        height: 1024,
        numImages: 1,
        guidanceScale: 7, // Leonardo AI requiert un integer
        seed: characterSeed, // Utiliser le même seed pour la cohérence
        presetStyle: 'ANIME' as any,
      }

      // Si init image fournie, utiliser mode image-to-image
      if (initImageId) {
        generationParams.initImageId = initImageId
        generationParams.initStrength = 0.4 // Équilibre personnage + contexte
        logger.info(`🔄 Chapitre ${chapterIndex + 1}: Mode image-to-image (strength: 0.4)`)
      }

      response = await leonardo.image.createGeneration(generationParams)
    } catch (moderationError: any) {
      // Si erreur de modération, essayer avec un prompt plus sûr
      if (
        moderationError.message?.includes('moderated') ||
        moderationError.message?.includes('403')
      ) {
        logger.warn('❌ Contenu modéré, retry avec prompt simplifié...')

        prompt = createSafePrompt(context, chapterIndex)
        logger.info(`Retry avec prompt sûr: ${prompt.substring(0, 100)}...`)

        response = await leonardo.image.createGeneration({
          prompt: prompt,
          modelId: 'aa77f04e-3eec-4034-9c07-d0f619684628',
          width: 1024,
          height: 1024,
          numImages: 1,
          guidanceScale: 7,
          presetStyle: 'CINEMATIC' as any,
        })
      } else {
        throw moderationError
      }
    }

    logger.debug('Réponse Leonardo AI:', JSON.stringify(response, null, 2))

    // Récupérer l'ID de génération depuis la réponse
    let generationId = (response as any).object?.sdGenerationJob?.generationId
    logger.info('Generation ID:', generationId)

    if (!generationId) {
      logger.error('Structure de réponse Leonardo AI:', response)
      throw new Error(
        `Pas d'ID de génération reçu de Leonardo AI. Structure: ${JSON.stringify(response)}`
      )
    }

    logger.info(`Génération ID: ${generationId}, en attente...`)
    // await new Promise(resolve => setTimeout(resolve, 3000))
    // Attendre que la génération soit terminée
    const generatedImages = await waitForGeneration(generationId)

    if (!generatedImages || generatedImages.length === 0) {
      throw new Error('Aucune image générée par Leonardo AI')
    }

    const imageUrl = generatedImages[0].url
    if (!imageUrl) {
      throw new Error("URL d'image manquante dans la réponse Leonardo AI")
    }

    logger.info(`Image générée: ${imageUrl}`)

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
    logger.error(`Erreur génération chapitre ${chapterIndex + 1}:`, error.message)
    throw error
  }
}

/**
 * Attendre que la génération soit terminée
 */
async function waitForGeneration(generationId: string, maxAttempts = 30): Promise<any[] | null> {
  let attempts = 0

  logger.info(`Attente de la génération ${generationId}...`)

  while (attempts < maxAttempts) {
    try {
      const response = await leonardo.image.getGenerationById(generationId)

      const generation = (response as any).object?.generationsByPk
      if (!generation) {
        throw new Error('Génération non trouvée')
      }

      logger.info(`Status génération: ${generation.status}`)

      if (generation.status === 'COMPLETE') {
        logger.info(`Génération terminée avec ${generation.generatedImages?.length || 0} images`)
        return generation.generatedImages || []
      } else if (generation.status === 'FAILED') {
        throw new Error('Génération échouée sur Leonardo AI')
      }

      // Attendre 3 secondes avant de vérifier à nouveau
      await new Promise((resolve) => setTimeout(resolve, 3000))
      attempts++
    } catch (error) {
      logger.error("Erreur lors de l'attente de génération:", error)
      attempts++
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
  }

  throw new Error('Timeout: génération Leonardo AI trop longue (>90s)')
}

/**
 * Extrait les noms des personnages mentionnés dans le contenu du chapitre
 */
function extractCharactersFromContent(content: string, protagonist: string): string[] {
  if (!content) return []
  
  const characterNames = new Set<string>()
  const contentLower = content.toLowerCase()
  const protagonistLower = protagonist.toLowerCase()
  
  // Patterns pour détecter les personnages
  const patterns = [
    // "Max et Robert", "Max and Robert"
    /(?:et|and)\s+([A-Z][a-z]+)/g,
    // "avec Robert", "with Robert"
    /(?:avec|with)\s+([A-Z][a-z]+)/g,
    // "Robert, l'ami", "Robert, the friend"
    /([A-Z][a-z]+),\s*(?:l'|le|la|les|the|un|une|son|sa|ses|his|her|their)\s+(?:ami|friend|compagnon|companion)/gi,
    // "Robert le renard", "Robert the fox"
    /([A-Z][a-z]+)\s+(?:le|la|les|the|un|une)\s+(?:renard|fox|lapin|rabbit|ours|bear|chat|cat|chien|dog)/gi,
    // "son ami Robert", "his friend Robert"
    /(?:son|sa|ses|his|her|their|mon|ma|mes|my)\s+(?:ami|friend|compagnon|companion)\s+([A-Z][a-z]+)/gi,
  ]
  
  // Extraire avec les patterns
  patterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(content)) !== null) {
      const name = match[1]
      if (name && name.toLowerCase() !== protagonistLower && name.length > 2) {
        characterNames.add(name)
      }
    }
  })
  
  // Chercher aussi les noms propres isolés qui apparaissent plusieurs fois (probablement des personnages)
  const words = content.split(/\s+/)
  const nameCounts = new Map<string, number>()
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i].replace(/[.,!?;:()"«»]/g, '')
    if (
      word.length > 2 &&
      word[0] === word[0].toUpperCase() &&
      word.toLowerCase() !== protagonistLower &&
      !word.match(/^(Le|La|Les|Un|Une|Des|De|Du|Et|Ou|Mais|Donc|Car|The|A|An|And|Or|But|So|For|With|To|From|In|On|At)$/)
    ) {
      const count = nameCounts.get(word) || 0
      nameCounts.set(word, count + 1)
    }
  }
  
  // Ajouter les noms qui apparaissent au moins 2 fois
  nameCounts.forEach((count, name) => {
    if (count >= 2) {
      characterNames.add(name)
    }
  })
  
  return Array.from(characterNames)
}

/**
 * Crée une description pour un personnage secondaire basée sur le contexte
 */
function createSecondaryCharacterDescription(characterName: string, context: StoryGenerationContext, chapterContent: string): string {
  const content = chapterContent.toLowerCase()
  const nameLower = characterName.toLowerCase()
  
  // Chercher l'espèce associée au nom du personnage
  let species = 'animal'
  
  // Patterns pour détecter l'espèce du personnage spécifique
  const speciesPatterns = [
    { pattern: new RegExp(`${nameLower}\\s+(?:le|la|les|the|un|une)\\s+(renard|fox)`, 'i'), species: 'fox' },
    { pattern: new RegExp(`${nameLower}\\s+(?:le|la|les|the|un|une)\\s+(lapin|rabbit)`, 'i'), species: 'rabbit' },
    { pattern: new RegExp(`${nameLower}\\s+(?:le|la|les|the|un|une)\\s+(ours|bear)`, 'i'), species: 'bear' },
    { pattern: new RegExp(`${nameLower}\\s+(?:le|la|les|the|un|une)\\s+(chat|cat)`, 'i'), species: 'cat' },
    { pattern: new RegExp(`${nameLower}\\s+(?:le|la|les|the|un|une)\\s+(chien|dog)`, 'i'), species: 'dog' },
    { pattern: new RegExp(`${nameLower}\\s+(?:le|la|les|the|un|une)\\s+(souris|mouse)`, 'i'), species: 'mouse' },
    { pattern: new RegExp(`${nameLower}\\s+(?:le|la|les|the|un|une)\\s+(écureuil|squirrel)`, 'i'), species: 'squirrel' },
    // Patterns généraux si le nom n'est pas directement associé
    { pattern: /renard|fox/i, species: 'fox' },
    { pattern: /lapin|rabbit/i, species: 'rabbit' },
    { pattern: /ours|bear/i, species: 'bear' },
    { pattern: /chat|cat/i, species: 'cat' },
    { pattern: /chien|dog/i, species: 'dog' },
    { pattern: /souris|mouse/i, species: 'mouse' },
    { pattern: /écureuil|squirrel/i, species: 'squirrel' },
  ]
  
  // Chercher d'abord les patterns spécifiques au personnage
  for (const { pattern, species: detectedSpecies } of speciesPatterns) {
    if (pattern.test(content)) {
      species = detectedSpecies
      break
    }
  }
  
  // Utiliser la description générique basée sur l'espèce
  const speciesDescriptions: Record<string, string> = {
    fox: `a red fox with pointed ears, amber eyes, white chest, green scarf`,
    rabbit: `a fluffy white rabbit with long ears, black eyes, pink nose`,
    bear: `a friendly brown bear with round ears, black eyes, red shirt`,
    cat: `an orange tabby cat with white chest, green eyes, yellow bow tie`,
    dog: `a golden retriever puppy with floppy ears, brown eyes, blue collar`,
    mouse: `a gray mouse with round ears, black eyes, purple jacket`,
    squirrel: `a brown squirrel with bushy tail, dark eyes, acorn hat`,
  }
  
  return `${characterName}, ${speciesDescriptions[species] || `a friendly ${species} with distinctive features, colorful clothing`}`
}

/**
 * Crée le prompt optimisé pour Leonardo AI avec cohérence renforcée
 */
function createLeonardoChapterPrompt(
  context: StoryGenerationContext,
  chapter: any,
  chapterIndex: number
): string {
  let characterDescription = getConsistentCharacterDescription(context)
  characterDescription = sanitizeContent(characterDescription)
  
  const chapterContent = sanitizeContent(chapter.content || '')
  const chapterSummary =
    chapterContent.substring(0, 200) + (chapterContent.length > 200 ? '...' : '')
  
  const chapterTitle = sanitizeContent(chapter.title || `Chapter ${chapterIndex + 1}`)
  const theme = sanitizeContent(context.theme || 'adventure')
  const protagonist = sanitizeContent(context.protagonist || 'character')

  // Extraire les personnages secondaires mentionnés dans le chapitre
  const secondaryCharacters = extractCharactersFromContent(chapter.content || '', context.protagonist || '')
  
  // Créer les descriptions des personnages secondaires
  let secondaryCharactersDescription = ''
  if (secondaryCharacters.length > 0) {
    const descriptions = secondaryCharacters.map(charName => 
      createSecondaryCharacterDescription(charName, context, chapter.content || '')
    )
    secondaryCharactersDescription = `
Additional characters in this scene:
${descriptions.map(desc => `- ${sanitizeContent(desc)}`).join('\n')}
`
  }

  const prompt = `
EXACT CHARACTER REFERENCE: ${characterDescription}
${secondaryCharactersDescription}
Children's book illustration showing ${protagonist}${secondaryCharacters.length > 0 ? ` and ${secondaryCharacters.join(', ')}` : ''} in Chapter ${chapterIndex + 1}: ${chapterTitle}

Story scene: ${chapterSummary}
Setting: ${theme} environment

CRITICAL CONSISTENCY REQUIREMENTS:
- Main character "${protagonist}" appearance MUST be identical to reference: same colors, same features, same proportions, same clothing
${secondaryCharacters.length > 0 ? `- Include secondary characters: ${secondaryCharacters.join(', ')} in the scene\n` : ''}
- Only the background/scene changes, characters stay consistent
- Same art style: bright colorful children's book illustration
- Same perspective and lighting style
- Professional quality, child-friendly, detailed but clean

The character "${protagonist}" must look exactly like the established design in every detail.
${secondaryCharacters.length > 0 ? `Show all characters together in the scene: ${protagonist} and ${secondaryCharacters.join(', ')}.` : ''}
  `.trim()
  
  // Nettoyer le prompt final pour être sûr
  return sanitizeContent(prompt)
}

/**
 * Crée un prompt ultra-sûr pour éviter la modération
 */
function createSafePrompt(context: StoryGenerationContext, chapterIndex: number): string {
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
  // Nettoyer l'espèce pour éviter les mots problématiques
  let species = context.species?.toLowerCase() || 'animal'
  species = species.replace(/petit(e)?\s+/gi, '').replace(/little\s+/gi, '').trim()
  
  const protagonist = context.protagonist || 'character'

  const speciesDescriptions: Record<string, string> = {
    rabbit: `${protagonist}, a fluffy white rabbit with long ears, black eyes, pink nose, blue vest, brown pants`,
    bear: `${protagonist}, a friendly brown bear with round ears, black eyes, red shirt, blue overalls`,
    cat: `${protagonist}, an orange tabby cat with white chest, green eyes, yellow bow tie`,
    dog: `${protagonist}, a golden retriever puppy with floppy ears, brown eyes, blue collar`,
    fox: `${protagonist}, a red fox with pointed ears, amber eyes, white chest, green scarf`,
    mouse: `${protagonist}, a gray mouse with round ears, black eyes, purple jacket`,
    squirrel: `${protagonist}, a brown squirrel with bushy tail, dark eyes, acorn hat`,
    elephant: `${protagonist}, a gray elephant with large ears, colorful headband`,
    princesse: `${protagonist}, a young princess with long hair, colorful dress, crown, friendly smile`,
    princess: `${protagonist}, a young princess with long hair, colorful dress, crown, friendly smile`,
  }

  // Chercher une correspondance partielle dans les clés
  const matchingKey = Object.keys(speciesDescriptions).find(key => 
    species.includes(key) || key.includes(species)
  )

  return (
    (matchingKey ? speciesDescriptions[matchingKey] : null) ||
    `${protagonist}, a friendly ${species} with distinctive features, colorful clothing`
  )
}

/**
 * Filtre le contenu pour éviter les violations de politique
 */
function sanitizeContent(content: string): string {
  if (!content) return 'happy adventure'

  const problematicWords = [
    // Mots déclenchant la modération
    'tit',
    'petit',
    'little',
    'small',
    'tiny',
    // Mots potentiellement problématiques
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
  ]

  let sanitized = content

  // Remplacer les mots problématiques de manière case-insensitive
  problematicWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    sanitized = sanitized.replace(regex, 'young')
  })

  // Remplacements spécifiques pour éviter la modération
  // IMPORTANT: Remplacer "petit" et "petite" AVANT de remplacer "tit" pour éviter la détection
  sanitized = sanitized
    .replace(/petite\s+/gi, 'young ')
    .replace(/petit\s+/gi, 'young ')
    .replace(/petite\b/gi, 'young')
    .replace(/petit\b/gi, 'young')
    .replace(/little\s+/gi, 'young ')
    .replace(/small\s+/gi, 'young ')
    .replace(/tiny\s+/gi, 'young ')
    // Remplacer "tit" seulement s'il n'est pas dans "petit" ou "petite" (déjà remplacés)
    .replace(/\btit\b/gi, 'bird')

  return sanitized
}

/**
 * Télécharge une image depuis une URL et la sauvegarde localement
 */
async function downloadImage(imageUrl: string, fileName: string): Promise<string> {
  try {
    logger.info(`Téléchargement de l'image: ${fileName}`)
    const storageService = await app.container.make(IStorageService)
    const destinationPath = `chapters/${fileName}`

    const result = await storageService.uploadFromUrl(imageUrl, destinationPath, {
      contentType: 'image/png',
    })

    logger.info(`Image sauvegardée: ${result.path}`)
    return result.url
  } catch (error) {
    logger.error(`Erreur téléchargement image ${fileName}:`, error)
    throw new Error(`Échec du téléchargement de l'image: ${error}`)
  }
}

/**
 * Génère une image de couverture avec Leonardo AI
 */
export async function generateCoverImageWithLeonardo(
  context: StoryGenerationContext & { slug: string },
  initImageId?: string
): Promise<string | null> {
  try {
    logger.info('🖼️ Génération image de couverture avec Leonardo AI...')
    if (initImageId) {
      logger.info(`🎨 Utilisation init image ID pour cohérence: ${initImageId}`)
    }

    const characterSeed = generateCharacterSeed(context)
    let characterDescription = getConsistentCharacterDescription(context)
    characterDescription = sanitizeContent(characterDescription)

    const title = sanitizeContent(context.title || '')
    const theme = sanitizeContent(context.theme || 'adventure')
    const synopsis = sanitizeContent(context.synopsis || '')

    const coverPrompt = sanitizeContent(`
Book cover illustration for children's story: "${title}"

${characterDescription} as the main character, prominently featured in the center of the composition.
Setting: Beautiful ${theme} environment as background.
Story synopsis: ${synopsis}

Style: Professional children's book cover, vibrant colors, magical atmosphere, high quality illustration.
Composition: Main character in foreground, thematic background, title space at top.
Age-appropriate for ${context.childAge} years old, inviting and warm feeling.
Art style: Modern children's book illustration, detailed but clean, professional cover quality.

No text or titles in the image, just the visual cover scene.
    `.trim())

    logger.info(`🎭 Génération couverture avec seed: ${characterSeed}`)

    const generationParams: any = {
      prompt: coverPrompt,
      modelId: 'aa77f04e-3eec-4034-9c07-d0f619684628',
      width: 1024,
      height: 1024,
      numImages: 1,
      guidanceScale: 8, // Leonardo AI requiert un integer
      seed: characterSeed,
      presetStyle: 'ANIME' as any,
    }

    // Si init image fournie, utiliser mode image-to-image
    if (initImageId) {
      generationParams.initImageId = initImageId
      generationParams.initStrength = 0.3 // Conserve fortement le personnage
      logger.info(`🔄 Mode image-to-image activé (strength: 0.3)`)
    }

    const response = await leonardo.image.createGeneration(generationParams)

    const generationId = (response as any).object?.sdGenerationJob?.generationId
    if (!generationId) {
      logger.error("❌ Pas d'ID pour l'image de couverture")
      return null
    }

    logger.info(`⏳ Attente génération couverture: ${generationId}`)
    const generatedImages = await waitForGeneration(generationId)

    if (!generatedImages || generatedImages.length === 0) {
      logger.error('❌ Aucune image de couverture générée')
      return null
    }

    const coverImageUrl = generatedImages[0].url
    if (!coverImageUrl) {
      logger.error('❌ URL manquante pour image de couverture')
      return null
    }

    // Sauvegarder l'image de couverture
    const coverFileName = `${context.slug}.webp`
    const coverPath = await downloadCoverImage(coverImageUrl, coverFileName)

    logger.info('✅ Image de couverture Leonardo AI créée')
    return coverPath
  } catch (error) {
    logger.error('❌ Erreur génération couverture Leonardo AI:', error)
    return null
  }
}

/**
 * Télécharge une image de couverture
 */
async function downloadCoverImage(imageUrl: string, fileName: string): Promise<string> {
  try {
    logger.info(`📥 Téléchargement couverture: ${fileName}`)
    const storageService = await app.container.make(IStorageService)
    const destinationPath = `covers/${fileName}`

    const result = await storageService.uploadFromUrl(imageUrl, destinationPath, {
      contentType: 'image/webp',
    })

    logger.info(`✅ Couverture téléchargée: ${result.path}`)
    return result.url
  } catch (error) {
    logger.error(`❌ Erreur téléchargement couverture ${fileName}:`, error)
    throw new Error(`Échec du téléchargement de l'image: ${error}`)
  }
}

/**
 * Test de connexion à Leonardo AI
 */
export async function testLeonardoConnection(): Promise<boolean> {
  try {
    const response = await leonardo.user.getUserSelf()
    logger.info(
      'Connexion Leonardo AI réussie:',
      (response as any).user_details?.[0]?.user?.username || 'Utilisateur'
    )
    return true
  } catch (error) {
    logger.error('Erreur connexion Leonardo AI:', error)
    return false
  }
}

/**
 * Génère un seed unique basé sur le contexte de l'histoire
 */
export function generateCharacterSeed(context: StoryGenerationContext): number {
  // Créer un seed basé sur les caractéristiques du personnage
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
 * Upload une image de référence vers Leonardo AI et retourne l'init image ID
 * pour utilisation dans les générations image-to-image
 */
export async function uploadCharacterReference(
  characterImageUrl: string,
  characterName: string
): Promise<string> {
  try {
    logger.info(`📤 Upload character reference vers Leonardo AI: ${characterName}`)

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
    const uploadResult = await leonardo.initImages.uploadInitImage({
      extension: 'png',
      // @ts-ignore - Le SDK Leonardo AI accepte Buffer
      file: imageBuffer,
    })

    const initImageId = (uploadResult as any)?.uploadInitImage?.id

    if (!initImageId) {
      logger.error('Leonardo AI upload response:', uploadResult)
      throw new Error('Failed to get init image ID from Leonardo AI')
    }

    logger.info(`✅ Character reference uploaded, init image ID: ${initImageId}`)
    return initImageId
  } catch (error: any) {
    logger.error('❌ Failed to upload character reference:', error.message)
    throw new Error(`Character reference upload failed: ${error.message}`)
  }
}

/**
 * Crée une image de référence du personnage principal
 */
export async function createCharacterReference(
  context: StoryGenerationContext,
  storySlug: string,
  characterSeed: number
): Promise<string | null> {
  try {
    let characterDescription = getConsistentCharacterDescription(context)
    
    // Nettoyer la description pour éviter la modération
    characterDescription = sanitizeContent(characterDescription)

    const referencePrompt = sanitizeContent(`
Character reference sheet: ${characterDescription}

Full body character design, front view, clean white background, children's book illustration style.
Standing pose, friendly expression, detailed character design for consistency across multiple illustrations.
Bright colors, professional quality, detailed but clean art style.
Reference sheet for maintaining visual consistency.
    `.trim())

    logger.info(`🎭 Génération personnage de référence avec seed: ${characterSeed}`)

    const response = await leonardo.image.createGeneration({
      prompt: referencePrompt,
      modelId: 'aa77f04e-3eec-4034-9c07-d0f619684628',
      width: 1024,
      height: 1024,
      numImages: 1,
      guidanceScale: 8,
      seed: characterSeed, // Même seed pour cohérence
      presetStyle: 'ANIME' as any,
    })

    const generationId = (response as any).object?.sdGenerationJob?.generationId
    if (!generationId) {
      logger.error("Pas d'ID pour l'image de référence")
      return null
    }

    logger.info(`⏳ Attente génération référence: ${generationId}`)
    const generatedImages = await waitForGeneration(generationId)

    if (!generatedImages || generatedImages.length === 0) {
      logger.error('❌ Aucune image de référence générée')
      return null
    }

    const referenceImageUrl = generatedImages[0].url
    if (!referenceImageUrl) {
      logger.error('❌ URL manquante pour image de référence')
      return null
    }

    // Sauvegarder l'image de référence
    const referenceFileName = `${storySlug}_character_reference.png`
    await downloadImage(referenceImageUrl, referenceFileName)

    logger.info('✅ Image de référence du personnage créée')
    return referenceImageUrl
  } catch (error) {
    logger.error('❌ Erreur création image de référence:', error)
    return null
  }
}
