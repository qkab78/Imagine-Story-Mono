import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import string from '@adonisjs/core/helpers/string'

import { db } from '#services/db'
import {
  createStoryValidator,
  getStoryByIdValidator,
  getStoryBySlugValidator,
  getSuggestedStoriesValidator,
} from '#stories/controllers/validators/index'

import {
  getStoryByIdPresenter,
  getStoryBySlugPresenter,
  getStoriesPresenter,
  StoryWithTheme,
} from "#stories/presenters/index";
import { StoryGenerated } from "#stories/types/stories_type";
import { generateImage, generateStory } from "#stories/helpers/stories_helper";

// Nouveaux imports pour les fonctionnalités étendues
import { generateCharacterProfiles } from '#stories/helpers/characters_helper'
import { generateChapterImages } from '#stories/helpers/chapter_images_helper'
import { StoryGenerationContext, ChapterImage } from '#stories/types/enhanced_story_types'

@inject()
export default class StoriesController {
  public async getStories({ response }: HttpContext) {
    const stories = await db
      .selectFrom('stories')
      .where('public', '=', true)
      .innerJoin('themes', 'themes.id', 'stories.theme_id')
      .select(['stories.id', 'stories.title', 'stories.synopsis', 'stories.cover_image', 'stories.slug', 'stories.public', 'stories.user_id', 'stories.created_at', 'stories.updated_at', 'stories.chapter_images', 'stories.chapters', 'stories.story_chapters', 'stories.theme_id', 'themes.name as theme_name', 'themes.description as theme_description'])
      .execute();

    return response.json(getStoriesPresenter(stories as unknown as StoryWithTheme[]));
  }

  public async getLatestStories({ response }: HttpContext) {
    const latestStories = await db
      .selectFrom('stories')
      .where('public', '=', true)
      .orderBy('created_at', 'desc')
      .innerJoin('themes', 'themes.id', 'stories.theme_id')
      .limit(5)
      .select(['stories.id', 'stories.title', 'stories.synopsis', 'stories.cover_image', 'stories.slug', 'stories.public', 'stories.user_id', 'stories.created_at', 'stories.updated_at', 'stories.chapter_images', 'stories.chapters', 'stories.story_chapters', 'stories.theme_id', 'themes.name as theme_name', 'themes.description as theme_description'])
      .execute();

    return response.json(getStoriesPresenter(latestStories as unknown as StoryWithTheme[]));
  }

  public async getStoryById({ request, response }: HttpContext) {
    const payload = await getStoryByIdValidator.validate(request.params());
    const story = await db
      .selectFrom('stories')
      .where('stories.id', '=', payload.id)
      .innerJoin('themes', 'themes.id', 'stories.theme_id')
      .select(['stories.id', 'stories.title', 'stories.synopsis', 'stories.cover_image', 'stories.slug', 'stories.public', 'stories.user_id', 'stories.created_at', 'stories.updated_at', 'stories.chapter_images', 'stories.chapters', 'stories.story_chapters', 'stories.theme_id', 'themes.name as theme_name', 'themes.description as theme_description'])
      .executeTakeFirst();

    if (!story) {
      throw new Error('Story not found');
    }

    return response.json(getStoryByIdPresenter(story as unknown as StoryWithTheme));
  }

  public async getStoryBySlug({ request, response }: HttpContext) {
    const payload = await getStoryBySlugValidator.validate(request.params())
    const stories = await db
      .selectFrom('stories')
      .where('slug', '=', payload.slug)
      .innerJoin('themes', 'themes.id', 'stories.theme_id')
      .select(['stories.id', 'stories.title', 'stories.synopsis', 'stories.cover_image', 'stories.slug', 'stories.public', 'stories.user_id', 'stories.created_at', 'stories.updated_at', 'stories.chapter_images', 'stories.chapters', 'stories.story_chapters', 'stories.theme_id', 'themes.name as theme_name', 'themes.description as theme_description'])
      .executeTakeFirst();

    if (!stories) {
      throw new Error('Story not found')
    }

    // @todo: remove any and check for a way to type the story returned by the database
    return response.json(getStoryBySlugPresenter(stories as any))
  }

  public async getStoriesByAuthenticatedUserId({ response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) {
      throw new errors.E_VALIDATION_ERROR('Invalid credentials')
    }

    // @ts-ignore
    const stories = await db
      .selectFrom('stories')
      // @ts-ignore
      .where('user_id', '=', user.id)
      .selectAll()
      .execute()

    return response.json(stories)
  }

  public async getSuggestedStories({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) {
      throw new errors.E_VALIDATION_ERROR('Invalid credentials')
    }

    const payload = await getSuggestedStoriesValidator.validate(request.qs())

    const stories = await db
      .selectFrom('stories')
      .where('title', 'ilike', `%${payload.query}%`)
      .limit(50)
      .select(['id', 'title', 'slug', 'cover_image'])
      .execute()

    return response.json(stories)
  }

  public async createStory({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createStoryValidator)
    const {
      title,
      synopsis,
      theme,
      protagonist,
      childAge,
      numberOfChapters,
      language,
      tone,
      species,
      isPrivate,
    } = payload

    const user = await auth.authenticate()

    if (!user) {
      throw new errors.E_VALIDATION_ERROR('Invalid credentials')
    }

    const chapters = numberOfChapters || 5

    try {
      console.log("🎬 Début de la génération d'histoire complète...")

      // 1. Générer l'histoire avec un modèle IA
      console.log("📝 Génération du contenu de l'histoire...")
      const storyText = await generateStory({
        title,
        synopsis,
        theme,
        protagonist,
        childAge,
        numberOfChapters: chapters,
        language,
        tone,
        species,
      })

      const storyTextJson = JSON.parse(storyText) as StoryGenerated
      const slug = string.slug(storyTextJson.slug, { lower: true, trim: true })

      // Créer le contexte pour les générations supplémentaires
      const storyContext: StoryGenerationContext = {
        title: storyTextJson.title || title || '',
        synopsis: storyTextJson.synopsis || synopsis || '',
        theme: storyTextJson.theme || theme || '',
        protagonist: storyTextJson.protagonist || protagonist || '',
        childAge: childAge || 5,
        numberOfChapters: chapters,
        language: language || 'fr',
        tone: tone || 'happy',
        species: species || 'human',
      }

      // 2. Générer l'image de couverture
      console.log("🖼️ Génération de l'image de couverture...")
      const imageUrl = await generateImage({
        title: storyContext.title,
        synopsis: storyContext.synopsis,
        theme: storyContext.theme,
        childAge: storyContext.childAge,
        protagonist: storyContext.protagonist,
        species: storyContext.species,
        slug,
      })

      // 3. Générer les profils de personnages si demandé
      let charactersData: any[] = []
      console.log('👥 Génération des profils de personnages...')
      try {
        const charactersResponse = await generateCharacterProfiles(storyContext, storyTextJson)
        charactersData.push(...charactersResponse.characters)
        console.log(`✅ ${charactersResponse.characters.length} personnages générés`)
      } catch (error) {
        console.error('❌ Erreur génération personnages:', error)
        // Continue sans les personnages en cas d'erreur
      }

      // 4. Générer les images de chapitres si demandé
      let chapterImages: ChapterImage[] = [];
      if (!storyTextJson.chapters || storyTextJson.chapters.length === 0) {
        console.log('🎨 Pas de chapitres à générer');
        throw new errors.E_VALIDATION_ERROR('Pas de chapitres à générer');
      }

      console.log('🎨 Génération des images de chapitres...')
      try {
        const chapterImagesResponse = await generateChapterImages(
          storyContext,
          storyTextJson.chapters,
          slug
        )
        chapterImages.push(...chapterImagesResponse.images)
        console.log(
          `✅ ${chapterImagesResponse.metadata.successfulGeneration}/${storyTextJson.chapters.length} images de chapitres générées`
        )

        if (chapterImagesResponse.metadata.errors) {
          console.warn('⚠️ Erreurs lors de la génération:', chapterImagesResponse.metadata.errors)
        }
      } catch (error) {
        console.error('❌ Erreur génération images chapitres:', error)
        // Continue sans les images de chapitres en cas d'erreur
      }

      // 5. Enregistrer l'histoire en base de données
      console.log('💾 Enregistrement en base de données...')
      const story = await db
        .insertInto('stories')
        .values({
          title: storyContext.title,
          synopsis: storyContext.synopsis,
          // @ts-ignore
          user_id: user.id,
          content: storyText,
          cover_image: imageUrl,
          chapters: storyTextJson.chapters?.length,
          slug,
          protagonist: storyContext.protagonist,
          theme: storyContext.theme,
          child_age: storyContext.childAge,
          language: storyContext.language,
          tone: storyContext.tone,
          species: storyContext.species,
          story_chapters: JSON.stringify(
            storyTextJson.chapters.map((chapter) => ({
              title: chapter.title,
              content: chapter.content,
            }))
          ),
          chapter_images: JSON.stringify(chapterImages),
          conclusion: storyTextJson.conclusion || '',
          public: !isPrivate || true,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returningAll()
        .execute()

      const createdStory = story[0]

      // 6. Enregistrer les personnages si générés
      if (charactersData.length > 0) {
        console.log('👥 Enregistrement des personnages...')
        try {
          await db
            .insertInto('characters')
            .values(
              charactersData.map((character) => ({
                // @ts-ignore
                story_id: createdStory.id,
                name: character.name,
                role: character.role,
                description: character.description,
                personality_traits: JSON.stringify(character.personalityTraits),
                physical_appearance: JSON.stringify(character.physicalAppearance),
                background_story: character.backgroundStory,
                character_image: character.character_image || null,
                created_at: new Date(),
                updated_at: new Date(),
              }))
            )
            .execute()
          console.log(`✅ ${charactersData.length} personnages sauvegardés`)
        } catch (error) {
          console.error('❌ Erreur sauvegarde personnages:', error)
        }
      }

      // 7. Récupérer l'histoire complète avec les personnages
      const completeStory = await this.getCompleteStory(createdStory.id as string)

      console.log('🎉 Histoire complète générée avec succès!')

      return response.created({
        message: 'Histoire créée avec succès',
        data: completeStory,
        metadata: {
          charactersGenerated: true,
          chapterImagesGenerated: true,
          charactersCount: charactersData.length,
          chapterImagesCount: chapterImages.length,
        },
      })
    } catch (error) {
      console.error("💥 Erreur lors de la création de l'histoire:", error)
      return response.internalServerError({
        message: "Erreur lors de la création de l'histoire",
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      })
    }
  }

  /**
   * Récupère une histoire complète avec ses personnages
   */
  private async getCompleteStory(storyId: string): Promise<any> {
    const story = await db
      .selectFrom('stories')
      .where('stories.id', '=', storyId)
      .selectAll()
      .executeTakeFirstOrThrow()

    const characters = await db
      .selectFrom('characters')
      .where('story_id', '=', storyId)
      .selectAll()
      .execute()

    return {
      ...story,
      characters: characters.map((char: any) => ({
        id: char.id,
        story_id: char.story_id,
        name: char.name,
        role: char.role as 'protagonist' | 'antagonist' | 'supporting' | 'secondary',
        description: char.description || '',
        personality_traits: char.personality_traits ? char.personality_traits : [],
        physical_appearance: char.physical_appearance ? char.physical_appearance : {},
        background_story: char.background_story || '',
        character_image: char.character_image || undefined,
        created_at: char.created_at,
        updated_at: char.updated_at,
      })),
      chapter_images: (story as any).chapter_images ? (story as any).chapter_images : [],
    }
  }
}
