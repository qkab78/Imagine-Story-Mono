/**
 * Service de génération des profils de personnages pour les histoires
 */

import logger from '@adonisjs/core/services/logger'
import OpenAI from 'openai'

import {
  StoryGenerationContext,
  GeneratedCharacter,
  CharacterGenerationResponse,
  isGeneratedCharacter,
} from '../types/enhanced_story_types.js'
import env from '#start/env'

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: env.get('OPENAI_API_KEY'),
})

/**
 * Génère des profils détaillés de personnages pour une histoire
 */
export async function generateCharacterProfiles(
  context: StoryGenerationContext,
  storyContent?: any
): Promise<CharacterGenerationResponse> {
  try {
    const prompt = createCharacterGenerationPrompt(context, storyContent)

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Tu es un expert en création de personnages pour histoires d'enfants. 
          Tu dois créer des personnages attachants, diversifiés et adaptés à l'âge des enfants.
          Assure-toi que tous les personnages sont appropriés et bienveillants.
          IMPORTANT: Tu dois TOUJOURS répondre avec un JSON valide, sans texte avant ou après.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("Aucune réponse reçue d'OpenAI pour la génération de personnages")
    }

    // Parse la réponse JSON avec gestion d'erreur améliorée
    let parsedResponse: any
    try {
      // Nettoyer le contenu au cas où il y aurait des caractères indésirables
      const cleanedContent = content
        .trim()
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '')
      parsedResponse = JSON.parse(cleanedContent)
    } catch (parseError) {
      logger.error('Erreur parsing JSON personnages:', parseError)
      logger.error('Contenu reçu:', content)
      throw new Error('Réponse OpenAI invalide - format JSON attendu')
    }

    // Validation des personnages générés
    const validCharacters: GeneratedCharacter[] = []
    if (parsedResponse.characters && Array.isArray(parsedResponse.characters)) {
      for (const char of parsedResponse.characters) {
        if (isGeneratedCharacter(char)) {
          validCharacters.push(char)
        } else {
          logger.warn('Personnage ignoré (format invalide):', char)
        }
      }
    } else {
      logger.warn('Format de réponse inattendu:', parsedResponse)
    }

    return {
      characters: validCharacters,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'gpt-4',
        prompt: prompt,
      },
    }
  } catch (error) {
    logger.error('Erreur lors de la génération des personnages:', error)
    throw new Error('Échec de la génération des profils de personnages')
  }
}

/**
 * Crée le prompt pour la génération de personnages
 */
function createCharacterGenerationPrompt(
  context: StoryGenerationContext,
  storyContent?: any
): string {
  const basePrompt = `
Génère des profils détaillés pour les personnages principaux de cette histoire pour enfants:

**Contexte de l'histoire:**
- Titre: "${context.title}"
- Synopsis: "${context.synopsis}"
- Thème: ${context.theme}
- Protagoniste principal: ${context.protagonist}
- Âge cible: ${context.childAge} ans
- Ton de l'histoire: ${context.tone}
- Espèce des personnages: ${context.species}
- Nombre de chapitres: ${context.numberOfChapters}

**Instructions de génération:**
1. Crée 3-5 personnages principaux (incluant le protagoniste)
2. Assure-toi que tous les personnages sont appropriés pour des enfants de ${context.childAge} ans
3. Diversifie les personnages en termes de personnalité et d'apparence
4. Évite tout contenu inapproprié, violent ou effrayant
5. Rends les personnages attachants et inspirants

**Format de réponse JSON requis:**
\`\`\`json
{
  "characters": [
    {
      "name": "Nom du personnage",
      "role": "protagonist|antagonist|supporting|secondary",
      "description": "Description générale du personnage en 1-2 phrases",
      "personalityTraits": [
        "Trait de personnalité 1",
        "Trait de personnalité 2",
        "Trait de personnalité 3"
      ],
      "physicalAppearance": {
        "age": "Age apparent du personnage",
        "height": "Taille relative (petit, moyen, grand)",
        "build": "Constitution physique",
        "hair": "Description des cheveux",
        "eyes": "Couleur et description des yeux",
        "clothing": "Style vestimentaire typique",
        "distinctiveFeatures": ["Caractéristique distinctive 1", "Caractéristique distinctive 2"]
      },
      "backgroundStory": "Histoire personnelle du personnage, ses motivations et son rôle dans l'histoire"
    }
  ]
}
\`\`\``

  // Ajout du contenu de l'histoire si disponible
  if (storyContent && storyContent.chapters) {
    const chaptersInfo = storyContent.chapters
      .map(
        (chapter: any, index: number) => `Chapitre ${index + 1}: ${chapter.title || 'Sans titre'}`
      )
      .join('\n')

    return basePrompt + `\n\n**Structure de l'histoire:**\n${chaptersInfo}`
  }

  return basePrompt
}

/**
 * Génère une image pour un personnage spécifique
 */
export async function generateCharacterImage(
  character: GeneratedCharacter,
  storyContext: StoryGenerationContext
): Promise<string | null> {
  try {
    const prompt = createCharacterImagePrompt(character, storyContext)

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    })

    return response.data?.[0]?.url || null
  } catch (error) {
    logger.error(`Erreur génération image pour ${character.name}:`, error)
    return null
  }
}

/**
 * Crée le prompt pour générer l'image d'un personnage
 */
function createCharacterImagePrompt(
  character: GeneratedCharacter,
  context: StoryGenerationContext
): string {
  const appearance = character.physicalAppearance

  return `
Illustration de personnage pour livre d'enfants de ${context.childAge} ans:

Personnage: ${character.name}
Description: ${character.description}

Apparence physique:
- Âge: ${appearance.age || 'jeune'}
- Taille: ${appearance.height || 'moyenne'}
- Cheveux: ${appearance.hair || 'couleur naturelle'}
- Yeux: ${appearance.eyes || 'expressifs'}
- Vêtements: ${appearance.clothing || 'adaptés au thème'}
- Caractéristiques: ${appearance.distinctiveFeatures?.join(', ') || 'aucune spécifique'}

Style: Illustration colorée et amicale pour enfants, style cartoon/animation, 
couleurs vives et chaleureuses, expression bienveillante, 
fond simple et neutre, adapté pour un livre d'histoires

Thème de l'histoire: ${context.theme}
Éviter: Éléments effrayants, violence, contenu inapproprié
  `.trim()
}
