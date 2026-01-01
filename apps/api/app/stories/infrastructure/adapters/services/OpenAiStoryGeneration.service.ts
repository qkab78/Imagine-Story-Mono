import { inject } from '@adonisjs/core'
import string from '@adonisjs/core/helpers/string'
import { IStoryGenerationService, StoryChapterImagesPayload, StoryCharacterPayload, StoryCharacterProfilesPayload, StoryCharacterReferencePayload, StoryGenerationPayload, StoryImagePayload } from "#stories/domain/services/IStoryGeneration";
import { StoryGenerated } from "#stories/domain/services/types/StoryGenerated";
import { ImageUrl } from "#stories/domain/value-objects/media/ImageUrl.vo";
import { IStorageService } from '#stories/domain/services/IStorageService';
import { ChapterFactory } from '#stories/domain/factories/ChapterFactory';
import OpenAI from 'openai'
import env from '#start/env'
import { ALLOWED_LANGUAGES } from '#stories/constants/allowed_languages'
import { LOCALES } from '#stories/constants/locales'

/**
 * Service de génération d'histoires utilisant OpenAI pour le texte et Leonardo AI pour les images
 *
 * Architecture:
 * - Génération de texte: OpenAI GPT
 * - Génération d'images: Leonardo AI avec support init images pour cohérence des personnages
 * - Storage: IStorageService (MinIO ou Local)
 */
@inject()
export class OpenAiStoryGenerationService implements IStoryGenerationService {
    private readonly openai: OpenAI

    constructor(
        private readonly storageService: IStorageService
    ) {
        this.openai = new OpenAI({ apiKey: env.get('OPENAI_API_KEY') })
    }

    /**
     * Génère le contenu texte de l'histoire via OpenAI GPT
     * @private
     */
    private async generateStoryText(payload: StoryGenerationPayload): Promise<string> {
        const { synopsis, theme, childAge, numberOfChapters, language, protagonist, tone, species } = payload
        const locale = LOCALES[language?.toUpperCase() as keyof typeof LOCALES] || LOCALES.ENGLISH

        const prompt = `
            You are the best children's storyteller in the world.

            Write an original story for a ${childAge}-year-old child.
            The story must be divided into exactly ${numberOfChapters} chapters, each with a clear title.
            It should tell a complete and engaging story, with a beginning, middle, and a **clear ending**.

            The main character is named ${protagonist}, a relatable ${species} of ${childAge} years old.
            ${synopsis ? `Here is the basic synopsis: "${synopsis}".` : ''}
            The main theme is: ${theme}.

            The tone of the story is: ${tone}.

            Use simple, vivid, age-appropriate language filled with adventure and imagination.
            Each chapter should be **around 300-600 words**.
            At the end of the last chapter, **write a proper conclusion** that wraps up the story, solves the main plot, or delivers a gentle lesson.
            **Make sure the final chapter ends the story completely, with no cliffhanger.**
            If the story is too long to fit, **shorten chapters if needed but always include the full ending.**
            Write the entire story in ${language} (even the title and the conclusion).

            I need you to return the story in the following JSON format:
            {
            "title": "The title of the story",
            "synopsis": "The synopsis of the story",
            "theme": "The theme of the story",
            "protagonist": "The protagonist of the story",
            "childAge": "The age of the protagonist",
            "numberOfChapters": "The number of chapters in the story",
            "language": "The language of the story",
            "tone": "The tone of the story",
            "species": "The species of the protagonist",
            "slug": "The slug of the story",
            "chapters": [
                {
                "title": "The title of the chapter",
                "content": "The content of the chapter"
                }
            ],
            "conclusion": "The conclusion of the story"
            }
        `
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: `
        You are the best children's storyteller in the world. You are writing a story for a child of ${childAge} years old.
        You are writing in ${language} and the tone of the story is ${tone}.
        You know all of those languages: ${Object.values(ALLOWED_LANGUAGES).join(', ')}.
        Generate a title for the story.
        Generate a slug in ${locale} from the title of the story.`,
                },
                {
                    role: 'user',
                    content: `
          CRITICAL: You MUST return ONLY valid JSON. No explanations, no
          markdown, no additional text.

          Format EXACTLY like this:
          {"title":"...","synopsis":"...","theme":"...","protagonist":"...","childAge":${childAge},"numberOfChapters":${numberOfChapters},"language":"${language}","tone":"${tone}","species":"${species}","slug":"...","chapters":[{"title":"...","content":"..."}],"conclusion":"..."}
          Write an original story for a ${childAge}-year-old child...
          ${prompt}
          RETURN ONLY THE JSON OBJECT. NO OTHER TEXT.`,
                },
            ],
        })

        return response.choices[0].message.content?.trim() || ''
    }

    /**
     * Génère une histoire complète avec texte et images
     *
     * Flux:
     * 1. Générer le contenu texte de l'histoire (OpenAI)
     * 2. Générer la character reference sheet (Leonardo AI)
     * 3. Upload character reference vers Leonardo AI pour obtenir initImageId
     * 4. Générer cover image avec init image (Leonardo AI)
     * 5. Générer chapter images avec init image (Leonardo AI)
     */
    async generateStory(payload: StoryGenerationPayload): Promise<StoryGenerated> {
        console.log('🎬 Début de la génération d\'histoire complète avec cohérence visuelle...')
        const startTime = Date.now()

        try {
            // Import dynamique des fonctions de leonardo_ai_service
            const {
                generateCharacterSeed,
                createCharacterReference,
                uploadCharacterReference,
                generateCoverImageWithLeonardo,
                generateChapterImagesWithLeonardo
            } = await import('#stories/services/leonardo_ai_service')

            const { generateCharacterProfiles } = await import('#stories/helpers/characters_helper')

            const slug = string.slug(payload.title, { lower: true, trim: true })

            // ÉTAPE 1: Générer le contenu texte de l'histoire via OpenAI
            const storyStartTime = Date.now()
            console.log('📝 Génération du contenu texte de l\'histoire (OpenAI)...')

            const storyText = await this.generateStoryText(payload)

            const storyTextJson = JSON.parse(storyText) as any
            const storyEndTime = Date.now()
            console.log(`✅ Texte généré en ${((storyEndTime - storyStartTime) / 1000).toFixed(2)}s`)

            // Vérifier que les chapitres existent
            if (!storyTextJson.chapters || !Array.isArray(storyTextJson.chapters)) {
                console.error('❌ Structure de la réponse OpenAI invalide:', JSON.stringify(storyTextJson, null, 2))
                throw new Error('La réponse OpenAI ne contient pas de chapitres valides')
            }
            console.log(`📖 ${storyTextJson.chapters.length} chapitre(s) généré(s)`)

            // Créer le contexte de génération
            const storyContext = {
                title: storyTextJson.title || payload.title,
                synopsis: storyTextJson.synopsis || payload.synopsis,
                theme: payload.theme,
                protagonist: storyTextJson.protagonist || payload.protagonist,
                childAge: payload.childAge,
                numberOfChapters: payload.numberOfChapters,
                language: payload.language,
                tone: payload.tone,
                species: payload.species,
            }

            // ÉTAPE 2: Générer le character seed (déterministe)
            const characterSeed = generateCharacterSeed(storyContext)
            console.log(`🎲 Character seed généré: ${characterSeed}`)

            // ÉTAPE 3: Générer la character reference sheet
            const referenceStartTime = Date.now()
            console.log('🎨 Génération de la character reference sheet (Leonardo AI)...')

            let initImageId: string | undefined
            let referenceImagePath: string | null = null

            try {
                referenceImagePath = await createCharacterReference(storyContext, slug, characterSeed)
                console.log(`✅ Character reference créée: ${referenceImagePath}`)

                // ÉTAPE 4: Upload vers Leonardo AI pour obtenir initImageId
                if (referenceImagePath) {
                    const referenceImageUrl = await this.storageService.getUrl(referenceImagePath)
                    initImageId = await uploadCharacterReference(referenceImageUrl, storyContext.protagonist)

                    const referenceEndTime = Date.now()
                    console.log(`✅ Init image ID obtenu: ${initImageId} (${((referenceEndTime - referenceStartTime) / 1000).toFixed(2)}s)`)
                }
            } catch (error: any) {
                console.warn('⚠️ Échec upload character reference, fallback vers text-to-image:', error.message)
                initImageId = undefined
            }

            // ÉTAPE 5: Générer cover image et profils de personnages en parallèle
            const parallelStartTime = Date.now()
            console.log('🚀 Génération parallèle: cover image + character profiles...')

            const [coverImagePath, charactersResponse] = await Promise.allSettled([
                // Cover image avec init image pour cohérence
                generateCoverImageWithLeonardo({ ...storyContext, slug }, initImageId),
                // Profils de personnages
                generateCharacterProfiles(storyContext, storyTextJson).catch((error) => {
                    console.error('❌ Erreur génération character profiles:', error)
                    return { characters: [] }
                }),
            ])

            if (coverImagePath.status === 'rejected') {
                throw new Error('Échec génération cover image: ' + coverImagePath.reason)
            }

            const finalCoverImagePath = coverImagePath.value
            if (!finalCoverImagePath) {
                throw new Error('Cover image path est null')
            }

            const parallelEndTime = Date.now()
            console.log(`✅ Cover + profiles générés en ${((parallelEndTime - parallelStartTime) / 1000).toFixed(2)}s`)

            // ÉTAPE 6: Générer les images des chapitres avec init image
            const chaptersStartTime = Date.now()
            console.log('🎨 Génération des images de chapitres avec init image...')

            const chapterImagesResponse = await generateChapterImagesWithLeonardo(
                storyContext,
                storyTextJson.chapters,
                slug,
                referenceImagePath,
                characterSeed,
                initImageId // PASSER l'init image ID pour cohérence
            )

            const chaptersEndTime = Date.now()
            console.log(`✅ ${chapterImagesResponse.metadata.successfulGeneration}/${storyTextJson.chapters.length} images de chapitres générées en ${((chaptersEndTime - chaptersStartTime) / 1000).toFixed(2)}s`)

            // ÉTAPE 7: Construire le résultat StoryGenerated
            // Créer les Chapter entities avec ChapterFactory
            const chapterEntities = storyTextJson.chapters.map((chapter: any, index: number) => {
                const chapterImage = chapterImagesResponse.images.find(img => img.chapterIndex === index)
                return ChapterFactory.create({
                    position: index + 1,
                    title: chapter.title,
                    content: chapter.content,
                    imageUrl: chapterImage?.imagePath || undefined
                })
            })

            const endTime = Date.now()
            const totalTime = ((endTime - startTime) / 1000).toFixed(2)
            console.log(`🎉 Histoire complète générée avec succès en ${totalTime}s`)
            console.log(`📊 Résumé: ${initImageId ? '✅ Init images utilisées' : '⚠️ Text-to-image fallback'}`)

            return {
                title: storyContext.title,
                synopsis: storyContext.synopsis,
                theme: payload.theme,
                protagonist: storyContext.protagonist,
                childAge: payload.childAge,
                numberOfChapters: payload.numberOfChapters,
                language: payload.language,
                tone: payload.tone,
                species: payload.species,
                conclusion: storyTextJson.conclusion || '',
                slug,
                chapters: chapterEntities,
                coverImageUrl: finalCoverImagePath,
                ownerId: payload.ownerId,
                isPublic: payload.isPublic,
            }
        } catch (error: any) {
            console.error('💥 Erreur lors de la génération de l\'histoire:', error)
            throw new Error(`Story generation failed: ${error.message}`)
        }
    }

    async generateImage(payload: StoryImagePayload): Promise<ImageUrl> {
        console.log('🖼️ Génération d\'image de couverture...')

        const { generateCoverImageWithLeonardo } = await import('#stories/services/leonardo_ai_service')

        const imagePath = await generateCoverImageWithLeonardo({
            title: payload.title,
            synopsis: payload.synopsis,
            theme: payload.theme,
            childAge: payload.childAge,
            protagonist: payload.protagonist,
            species: payload.species,
            numberOfChapters: 5, // Default
            language: 'en',
            tone: 'friendly',
            slug: payload.slug,
        })

        if (!imagePath) {
            throw new Error('Failed to generate cover image')
        }

        return ImageUrl.create(imagePath)
    }

    async generateCharacter(payload: StoryCharacterPayload): Promise<string> {
        console.log('👤 Génération d\'image de personnage...')

        // Pour l'instant, on utilise la même méthode que la cover image
        // TODO: Créer une méthode spécifique pour les personnages
        const { generateCoverImageWithLeonardo } = await import('#stories/services/leonardo_ai_service')

        const imagePath = await generateCoverImageWithLeonardo({
            title: payload.title,
            synopsis: payload.synopsis,
            theme: payload.theme,
            childAge: payload.childAge,
            protagonist: payload.protagonist,
            species: payload.species,
            numberOfChapters: 5,
            language: 'en',
            tone: 'friendly',
            slug: payload.slug,
        })

        if (!imagePath) {
            throw new Error('Failed to generate character image')
        }

        return imagePath
    }

    async generateChapterImages(payload: StoryChapterImagesPayload): Promise<ImageUrl[]> {
        console.log('📚 Génération d\'images de chapitres...')

        const { generateChapterImages } = await import('#stories/helpers/chapter_images_helper')

        // Note: Cette méthode ne supporte pas encore init images
        // Pour utiliser init images, il faut passer par generateStory()
        const chapterImagesResponse = await generateChapterImages(
            {
                title: payload.title,
                synopsis: payload.synopsis,
                theme: payload.theme,
                childAge: payload.childAge,
                protagonist: payload.protagonist,
                species: payload.species,
                numberOfChapters: 5,
                language: 'en',
                tone: 'friendly',
            },
            [], // chapters
            payload.slug
        )

        return chapterImagesResponse.images.map(img => ImageUrl.create(img.imageUrl))
    }

    async generateCharacterReference(payload: StoryCharacterReferencePayload): Promise<string> {
        console.log('🎨 Génération de character reference sheet...')

        const { createCharacterReference } = await import('#stories/services/leonardo_ai_service')

        const referenceImagePath = await createCharacterReference(
            {
                title: payload.story,
                synopsis: '',
                theme: '',
                protagonist: '',
                childAge: 5,
                numberOfChapters: 5,
                language: 'en',
                tone: 'friendly',
                species: '',
            },
            payload.slug,
            payload.characterSeed
        )

        if (!referenceImagePath) {
            throw new Error('Failed to generate character reference')
        }

        return referenceImagePath
    }

    async generateCharacterProfiles(payload: StoryCharacterProfilesPayload): Promise<Record<string, any>[]> {
        console.log('👥 Génération de profils de personnages...')

        const { generateCharacterProfiles } = await import('#stories/helpers/characters_helper')

        const response = await generateCharacterProfiles(
            payload.storyContent,
            {
                chapters: payload.chapters,
            }
        )

        return response.characters || []
    }
}