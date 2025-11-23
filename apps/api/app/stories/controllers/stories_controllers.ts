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
  getStoriesValidator,
} from '#stories/controllers/validators/index'

import {
  getStoryByIdPresenter,
  getStoryBySlugPresenter,
  getStoriesPresenter,
  StoryWithTheme,
  StoryLanguage,
  StoryTone,
  StoryTheme,
} from "#stories/presenters/index";
import { StoryGenerated } from "#stories/types/stories_type";
import { generateImage, generateStory } from "#stories/helpers/stories_helper";

// Nouveaux imports pour les fonctionnalités étendues
import { generateCharacterProfiles } from '#stories/helpers/characters_helper'
import { generateChapterImages } from '#stories/helpers/chapter_images_helper'
import { StoryGenerationContext, ChapterImage } from '#stories/types/enhanced_story_types'
import env from '#start/env'
import { Languages, Themes, Tones } from '#types/db'

@inject()
export default class StoriesController {
  public async getStories({ request, response }: HttpContext) {
    const payload = await getStoriesValidator.validate(request.qs());
    const limit = payload.limit ?? Number(env.get('STORIES_QUERY_LIMIT'));

    const stories = await db
      .selectFrom('stories')
      .where('public', '=', true)
      .innerJoin('themes', 'themes.id', 'stories.theme_id')
      .innerJoin('tones', 'tones.id', 'stories.tone_id')
      .innerJoin('languages', 'languages.id', 'stories.language_id')
      .select([
        'stories.id',
        'stories.title',
        'stories.synopsis',
        'stories.cover_image',
        'stories.slug',
        'stories.public',
        'stories.user_id',
        'stories.created_at',
        'stories.updated_at',
        'stories.chapter_images',
        'stories.chapters',
        'stories.story_chapters',
        'stories.created_at',
        'stories.tone_id',
        'stories.species',
        'stories.conclusion',
        'stories.theme_id',
        'themes.name as theme_name',
        'themes.description as theme_description',
        'tones.id as tone_id',
        'tones.name as tone_name',
        'tones.description as tone_description',
        'languages.id as language_id',
        'languages.name as language_name',
        'languages.code as language_code',
        'languages.is_free as language_is_free'
      ])
      .limit(limit)
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
      .innerJoin('tones', 'tones.id', 'stories.tone_id')
      .innerJoin('languages', 'languages.id', 'stories.language_id')
      .select([
        'stories.id',
        'stories.title',
        'stories.synopsis',
        'stories.cover_image',
        'stories.slug',
        'stories.public',
        'stories.user_id',
        'stories.created_at',
        'stories.updated_at',
        'stories.chapter_images',
        'stories.chapters',
        'stories.story_chapters',
        'stories.created_at',
        'stories.tone_id',
        'stories.species',
        'stories.conclusion',
        'stories.theme_id',
        'themes.name as theme_name',
        'themes.description as theme_description',
        'tones.id as tone_id',
        'tones.name as tone_name',
        'tones.description as tone_description',
        'languages.id as language_id',
        'languages.name as language_name',
        'languages.code as language_code',
        'languages.is_free as language_is_free'
      ]).execute();

    return response.json(getStoriesPresenter(latestStories as unknown as StoryWithTheme[]));
  }

  public async getStoryById({ request, response }: HttpContext) {
    const payload = await getStoryByIdValidator.validate(request.params());
    const story = await db
      .selectFrom('stories')
      .where('stories.id', '=', payload.id)
      .innerJoin('themes', 'themes.id', 'stories.theme_id')
      .innerJoin('tones', 'tones.id', 'stories.tone_id')
      .innerJoin('languages', 'languages.id', 'stories.language_id')
      .select([
        'stories.id',
        'stories.title',
        'stories.synopsis',
        'stories.cover_image',
        'stories.slug',
        'stories.public',
        'stories.user_id',
        'stories.created_at',
        'stories.updated_at',
        'stories.chapter_images',
        'stories.chapters',
        'stories.story_chapters',
        'stories.created_at',
        'stories.tone_id',
        'stories.species',
        'stories.conclusion',
        'stories.theme_id',
        'themes.name as theme_name',
        'themes.description as theme_description',
        'tones.id as tone_id',
        'tones.name as tone_name',
        'tones.description as tone_description',
        'languages.id as language_id',
        'languages.name as language_name',
        'languages.code as language_code',
        'languages.is_free as language_is_free'
      ])
      .executeTakeFirst();

    if (!story) {
      throw new Error('Story not found');
    }

    const formattedStory = getStoryByIdPresenter(story as unknown as StoryWithTheme);
    return response.json(formattedStory);
  }

  public async getStoryBySlug({ request, response }: HttpContext) {
    const payload = await getStoryBySlugValidator.validate(request.params())
    const stories = await db
      .selectFrom('stories')
      .where('slug', '=', payload.slug)
      .innerJoin('themes', 'themes.id', 'stories.theme_id')
      .innerJoin('tones', 'tones.id', 'stories.tone_id')
      .innerJoin('languages', 'languages.id', 'stories.language_id')
      .select([
        'stories.id',
        'stories.title',
        'stories.synopsis',
        'stories.cover_image',
        'stories.slug',
        'stories.public',
        'stories.user_id',
        'stories.created_at',
        'stories.updated_at',
        'stories.chapter_images',
        'stories.chapters',
        'stories.story_chapters',
        'stories.created_at',
        'stories.tone_id',
        'stories.species',
        'stories.conclusion',
        'stories.theme_id',
        'themes.name as theme_name',
        'themes.description as theme_description',
        'tones.id as tone_id',
        'tones.name as tone_name',
        'tones.description as tone_description',
        'languages.id as language_id',
        'languages.name as language_name',
        'languages.code as language_code',
        'languages.is_free as language_is_free'
      ]).executeTakeFirst();

    if (!stories) {
      throw new Error('Story not found')
    }

    return response.json(getStoryBySlugPresenter(stories as unknown as StoryWithTheme))
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
      .innerJoin('themes', 'themes.id', 'stories.theme_id')
      .innerJoin('tones', 'tones.id', 'stories.tone_id')
      .innerJoin('languages', 'languages.id', 'stories.language_id')
      .select([
        'stories.id',
        'stories.title',
        'stories.synopsis',
        'stories.cover_image',
        'stories.slug',
        'stories.public',
        'stories.user_id',
        'stories.created_at',
        'stories.updated_at',
        'stories.chapter_images',
        'stories.chapters',
        'stories.story_chapters',
        'stories.created_at',
        'stories.tone_id',
        'stories.species',
        'stories.conclusion',
        'stories.theme_id',
        'themes.name as theme_name',
        'themes.description as theme_description',
        'tones.id as tone_id',
        'tones.name as tone_name',
        'tones.description as tone_description',
        'languages.id as language_id',
        'languages.name as language_name',
        'languages.code as language_code',
        'languages.is_free as language_is_free'
      ])
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
      .innerJoin('themes', 'themes.id', 'stories.theme_id')
      .innerJoin('tones', 'tones.id', 'stories.tone_id')
      .innerJoin('languages', 'languages.id', 'stories.language_id')
      .select([
        'stories.id',
        'stories.title',
        'stories.synopsis',
        'stories.cover_image',
        'stories.slug',
        'stories.public',
        'stories.user_id',
        'stories.created_at',
        'stories.updated_at',
        'stories.chapter_images',
        'stories.chapters',
        'stories.story_chapters',
        'stories.created_at',
        'stories.tone_id',
        'stories.species',
        'stories.conclusion',
        'stories.theme_id',
        'themes.name as theme_name',
        'themes.description as theme_description',
        'tones.id as tone_id',
        'tones.name as tone_name',
        'tones.description as tone_description',
        'languages.id as language_id',
        'languages.name as language_name',
        'languages.code as language_code',
        'languages.is_free as language_is_free'
      ])
      .limit(50)
      .execute()

    return response.json(getStoriesPresenter(stories as unknown as StoryWithTheme[]))
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

    // Valider que les IDs sont fournis
    if (!theme || !tone || !language) {
      throw new errors.E_VALIDATION_ERROR('Les IDs de theme, tone et language sont requis')
    }

    try {
      const startTime = Date.now()
      console.log("🎬 Début de la génération d'histoire complète...")

      // Récupérer les informations des relations pour la génération (en parallèle)
      const dbStartTime = Date.now()
      console.log("🔍 Récupération des informations des relations...")
      
      const [themeRecord, toneRecord, languageRecord] = await Promise.all([
        db
          .selectFrom('themes')
          .select(['id', 'name', 'description'])
          .where('id', '=', theme)
          .executeTakeFirst(),
        db
          .selectFrom('tones')
          .select(['id', 'name', 'description'])
          .where('id', '=', tone)
          .executeTakeFirst(),
        db
          .selectFrom('languages')
          .select(['id', 'code', 'name'])
          .where('id', '=', language)
          .executeTakeFirst(),
      ])

      if (!themeRecord || !toneRecord || !languageRecord) {
        throw new errors.E_VALIDATION_ERROR(
          `Relations introuvables: theme=${themeRecord ? 'OK' : 'MANQUANT'}, tone=${toneRecord ? 'OK' : 'MANQUANT'}, language=${languageRecord ? 'OK' : 'MANQUANT'}`
        )
      }
      const dbEndTime = Date.now()
      console.log(`⏱️  Récupération DB: ${((dbEndTime - dbStartTime) / 1000).toFixed(2)}s`)

      // 1. Générer l'histoire avec un modèle IA
      const storyStartTime = Date.now()
      console.log("📝 Génération du contenu de l'histoire...")
      const storyText = await generateStory({
        title,
        synopsis,
        theme: themeRecord.name,
        protagonist,
        childAge,
        numberOfChapters: chapters,
        language: languageRecord.code.toLowerCase(),
        tone: toneRecord.name,
        species,
      })

      const storyTextJson = JSON.parse(storyText) as StoryGenerated
      const slug = string.slug(storyTextJson.slug, { lower: true, trim: true })
      const storyEndTime = Date.now()
      console.log(`⏱️  Génération texte histoire: ${((storyEndTime - storyStartTime) / 1000).toFixed(2)}s`)

      // Créer le contexte pour les générations supplémentaires
      const storyContext: StoryGenerationContext = {
        title: storyTextJson.title || title || '',
        synopsis: storyTextJson.synopsis || synopsis || '',
        theme: themeRecord.name,
        protagonist: storyTextJson.protagonist || protagonist || '',
        childAge: childAge || 5,
        numberOfChapters: chapters,
        language: languageRecord.code.toLowerCase(),
        tone: toneRecord.name,
        species: species || 'human',
      }

      // 2. Générer l'image de couverture, l'image de référence et les personnages en parallèle
      const parallelStartTime = Date.now()
      console.log("🚀 Génération parallèle: couverture, référence personnage et personnages...")
      
      // Importer les fonctions nécessaires pour générer l'image de référence
      const { generateCharacterSeed, createCharacterReference } = await import('#stories/services/leonardo_ai_service')
      
      const characterSeed = generateCharacterSeed(storyContext)
      
      const [imageUrl, referenceImageUrl, charactersResponse] = await Promise.allSettled([
        // Image de couverture
        generateImage({
          title: storyContext.title,
          synopsis: storyContext.synopsis,
          theme: storyContext.theme,
          childAge: storyContext.childAge,
          protagonist: storyContext.protagonist,
          species: storyContext.species,
          slug,
        }),
        // Image de référence du personnage
        createCharacterReference(storyContext, slug, characterSeed),
        // Profils de personnages
        generateCharacterProfiles(storyContext, storyTextJson).catch((error) => {
          console.error('❌ Erreur génération personnages:', error)
          return { characters: [] }
        }),
      ])

      // Traiter les résultats
      if (imageUrl.status === 'rejected') {
        throw new Error('Échec de la génération de l\'image de couverture: ' + imageUrl.reason)
      }
      const finalImageUrl = imageUrl.value
      
      const finalReferenceImageUrl = referenceImageUrl.status === 'fulfilled' ? referenceImageUrl.value : null

      let charactersData: any[] = []
      if (charactersResponse.status === 'fulfilled') {
        charactersData = charactersResponse.value.characters || []
        console.log(`✅ ${charactersData.length} personnages générés`)
      } else {
        console.error('❌ Erreur génération personnages:', charactersResponse.reason)
      }

      if (finalReferenceImageUrl) {
        console.log('✅ Image de référence du personnage générée')
      } else {
        console.warn('⚠️ Échec de la génération de l\'image de référence')
      }
      const parallelEndTime = Date.now()
      console.log(`⏱️  Génération parallèle (couverture/référence/personnages): ${((parallelEndTime - parallelStartTime) / 1000).toFixed(2)}s`)

      // 4. Générer les images de chapitres si demandé
      let chapterImages: ChapterImage[] = [];
      if (!storyTextJson.chapters || storyTextJson.chapters.length === 0) {
        console.log('🎨 Pas de chapitres à générer');
        throw new errors.E_VALIDATION_ERROR('Pas de chapitres à générer');
      }

      const chaptersStartTime = Date.now()
      console.log('🎨 Génération des images de chapitres...')
      try {
        // Passer l'image de référence et le seed si disponibles pour éviter de les régénérer
        const { generateChapterImagesWithLeonardo } = await import('#stories/services/leonardo_ai_service')
        const chapterImagesResponse = finalReferenceImageUrl && characterSeed
          ? await generateChapterImagesWithLeonardo(
              storyContext,
              storyTextJson.chapters,
              slug,
              finalReferenceImageUrl,
              characterSeed
            )
          : await generateChapterImages(
              storyContext,
              storyTextJson.chapters,
              slug
            )
        chapterImages.push(...chapterImagesResponse.images)
        const chaptersEndTime = Date.now()
        console.log(
          `✅ ${chapterImagesResponse.metadata.successfulGeneration}/${storyTextJson.chapters.length} images de chapitres générées`
        )
        console.log(`⏱️  Génération images chapitres: ${((chaptersEndTime - chaptersStartTime) / 1000).toFixed(2)}s`)

        if (chapterImagesResponse.metadata.errors) {
          console.warn('⚠️ Erreurs lors de la génération:', chapterImagesResponse.metadata.errors)
        }
      } catch (error) {
        console.error('❌ Erreur génération images chapitres:', error)
        // Continue sans les images de chapitres en cas d'erreur
      }

      // 5. Enregistrer l'histoire en base de données
      const dbSaveStartTime = Date.now()
      console.log('💾 Enregistrement en base de données...')
      const story = await db
        .insertInto('stories')
        .values({
          title: storyContext.title,
          synopsis: storyContext.synopsis,
          // @ts-ignore
          user_id: user.id,
          content: storyText,
          cover_image: finalImageUrl,
          chapters: storyTextJson.chapters?.length,
          slug,
          protagonist: storyContext.protagonist,
          theme_id: theme,
          child_age: storyContext.childAge,
          language_id: language,
          tone_id: tone,
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
      const dbSaveEndTime = Date.now()
      console.log(`⏱️  Enregistrement histoire en DB: ${((dbSaveEndTime - dbSaveStartTime) / 1000).toFixed(2)}s`)

      // 6. Enregistrer les personnages si générés
      if (charactersData.length > 0) {
        const charactersSaveStartTime = Date.now()
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
          const charactersSaveEndTime = Date.now()
          console.log(`✅ ${charactersData.length} personnages sauvegardés`)
          console.log(`⏱️  Enregistrement personnages: ${((charactersSaveEndTime - charactersSaveStartTime) / 1000).toFixed(2)}s`)
        } catch (error) {
          console.error('❌ Erreur sauvegarde personnages:', error)
        }
      }

      // 7. Récupérer l'histoire complète avec les personnages
      const completeStory = await this.getCompleteStory(createdStory.id as string)

      const endTime = Date.now()
      const totalTime = ((endTime - startTime) / 1000).toFixed(2)
      console.log(`🎉 Histoire complète générée avec succès!`)
      console.log(`⏱️  ════════════════════════════════════════`)
      console.log(`⏱️  TEMPS TOTAL: ${totalTime}s`)
      console.log(`⏱️  ════════════════════════════════════════`)

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
   * Récupère tous les thèmes disponibles
   */
  public async getThemes({ response }: HttpContext) {
    const themes = await db
      .selectFrom('themes')
      .select(['id', 'name', 'description'])
      .orderBy('name', 'asc')
      .execute()

    return response.json(
      themes.map((theme) => this.getThemePresenter(theme as unknown as Themes))
    )
  }
  private getThemePresenter(theme: Themes): StoryTheme {
    return {
      id: theme.id as unknown as string,
      name: theme.name,
      description: theme.description as unknown as string,
    }
  }

  /**
   * Récupère toutes les tonalités disponibles
   */
  public async getTones({ response }: HttpContext) {
    const tones = await db
      .selectFrom('tones')
      .select(['id', 'name', 'description'])
      .orderBy('name', 'asc')
      .execute()

    return response.json(tones.map((tone) => this.getTonePresenter(tone as unknown as Tones)))
  }

  private getTonePresenter(tone: Tones): StoryTone {
    return {
      id: tone.id as unknown as string,
      name: tone.name,
      description: tone.description as unknown as string,
    }
  }

  /**
   * Récupère toutes les langues disponibles
   */
  public async getLanguages({ response }: HttpContext) {
    const languages = await db
      .selectFrom('languages')
      .select(['id', 'code', 'name', 'is_free'])
      .orderBy('name', 'asc')
      .execute()

    return response.json(languages.map((language) => this.getLanguagePresenter(language as unknown as Languages)))
  }

  private getLanguagePresenter(language: Languages): StoryLanguage {
    return {
      id: language.id as unknown as string,
      code: language.code,
      name: language.name,
      isFree: language.is_free as unknown as boolean,
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
