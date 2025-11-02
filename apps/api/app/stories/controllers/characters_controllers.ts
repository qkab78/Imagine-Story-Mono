/**
 * Contrôleur pour la gestion des personnages d'histoires
 */

import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { db } from '#services/db'
import { Character } from '#stories/entities/character_entity'
import {
  getCharactersByStoryIdValidator,
  updateCharacterValidator,
} from '#stories/controllers/validators/index'

@inject()
export default class CharactersController {
  /**
   * Récupère tous les personnages d'une histoire
   */
  public async getCharactersByStoryId({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) {
      throw new errors.E_VALIDATION_ERROR('Invalid credentials')
    }

    const { id: storyId } = await getCharactersByStoryIdValidator.validate(request.params())

    // Vérifier que l'utilisateur peut accéder à cette histoire
    const story = await db
      .selectFrom('stories')
      .where('id', '=', storyId)
      .where('user_id', '=', (user as any).id)
      .selectAll()
      .executeTakeFirst()

    if (!story) {
      return response.notFound({
        message: 'Histoire non trouvée ou accès non autorisé',
      })
    }

    // Récupérer les personnages
    const characters = await db
      .selectFrom('characters')
      .where('story_id', '=', storyId)
      .selectAll()
      .execute()

    const mappedCharacters: Character[] = characters.map((char: any) => ({
      id: char.id,
      name: char.name,
      role: char.role as Character['role'],
      description: char.description || '',
      personalityTraits: char.personality_traits
        ? JSON.parse(char.personality_traits as string)
        : [],
      physicalAppearance: char.physical_appearance
        ? JSON.parse(char.physical_appearance as string)
        : {},
      backgroundStory: char.background_story || '',
    }))

    return response.json({
      data: mappedCharacters,
      story: {
        id: story.id,
        title: story.title,
        slug: story.slug,
      },
    })
  }

  /**
   * Met à jour un personnage
   */
  public async updateCharacter({ request, response, auth, params }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) {
      throw new errors.E_VALIDATION_ERROR('Invalid credentials')
    }

    const { id: characterId } = params
    const payload = await updateCharacterValidator.validate(request.body())

    // Vérifier que le personnage existe et appartient à l'utilisateur
    const character = await db
      .selectFrom('characters')
      .innerJoin('stories', 'stories.id', 'characters.story_id')
      .where('characters.id', '=', characterId)
      .where('stories.user_id', '=', (user as any).id)
      .selectAll('characters')
      .select('stories.title as story_title')
      .executeTakeFirst()

    if (!character) {
      return response.notFound({
        message: 'Personnage non trouvé ou accès non autorisé',
      })
    }

    try {
      // Mettre à jour le personnage
      const updatedData: any = {
        updated_at: new Date(),
      }

      if (payload.name !== undefined) updatedData.name = payload.name
      if (payload.role !== undefined) updatedData.role = payload.role
      if (payload.description !== undefined) updatedData.description = payload.description
      if (payload.personality_traits !== undefined) {
        updatedData.personality_traits = JSON.stringify(payload.personality_traits)
      }
      if (payload.physical_appearance !== undefined) {
        updatedData.physical_appearance = JSON.stringify(payload.physical_appearance)
      }
      if (payload.background_story !== undefined)
        updatedData.background_story = payload.background_story
      if (payload.character_image !== undefined)
        updatedData.character_image = payload.character_image

      const updatedCharacter = await db
        .updateTable('characters')
        .set(updatedData)
        .where('id', '=', characterId)
        .returningAll()
        .execute()

      return response.json({
        message: 'Personnage mis à jour avec succès',
        data: updatedCharacter[0],
      })
    } catch (error) {
      console.error('Erreur mise à jour personnage:', error)
      return response.internalServerError({
        message: 'Erreur lors de la mise à jour du personnage',
      })
    }
  }

  /**
   * Supprime un personnage
   */
  public async deleteCharacter({ response, auth, params }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) {
      throw new errors.E_VALIDATION_ERROR('Invalid credentials')
    }

    const { id: characterId } = params

    // Vérifier que le personnage existe et appartient à l'utilisateur
    const character = await db
      .selectFrom('characters')
      .innerJoin('stories', 'stories.id', 'characters.story_id')
      .where('characters.id', '=', characterId)
      .where('stories.user_id', '=', (user as any).id)
      .select(['characters.id', 'characters.name', 'stories.title as story_title'])
      .executeTakeFirst()

    if (!character) {
      return response.notFound({
        message: 'Personnage non trouvé ou accès non autorisé',
      })
    }

    try {
      await db.deleteFrom('characters').where('id', '=', characterId).execute()

      return response.json({
        message: `Personnage "${character.name}" supprimé avec succès`,
      })
    } catch (error) {
      console.error('Erreur suppression personnage:', error)
      return response.internalServerError({
        message: 'Erreur lors de la suppression du personnage',
      })
    }
  }

  /**
   * Récupère un personnage spécifique
   */
  public async getCharacterById({ response, auth, params }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) {
      throw new errors.E_VALIDATION_ERROR('Invalid credentials')
    }

    const { id: characterId } = params

    const character = await db
      .selectFrom('characters')
      .innerJoin('stories', 'stories.id', 'characters.story_id')
      .where('characters.id', '=', characterId)
      .where('stories.user_id', '=', (user as any).id)
      .selectAll('characters')
      .select(['stories.title as story_title', 'stories.slug as story_slug'])
      .executeTakeFirst()

    if (!character) {
      return response.notFound({
        message: 'Personnage non trouvé ou accès non autorisé',
      })
    }

    const mappedCharacter: Character = {
      id: character.id,
      name: character.name,
      role: character.role as Character['role'],
      description: character.description || '',
      personalityTraits: character.personality_traits
        ? JSON.parse(character.personality_traits as string)
        : [],
      physicalAppearance: character.physical_appearance
        ? JSON.parse(character.physical_appearance as string)
        : {},
      backgroundStory: character.background_story || '',
    }

    return response.json({
      data: mappedCharacter,
      story: {
        title: character.story_title,
        slug: character.story_slug,
      },
    })
  }
}
