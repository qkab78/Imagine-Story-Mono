import { inject } from '@adonisjs/core'
import string from '@adonisjs/core/helpers/string'
import { IStoryGenerationService, StoryGenerationPayload } from "#stories/domain/services/IStoryGeneration";
import { StoryGenerated } from "#stories/domain/services/types/StoryGenerated";
import { IStoryImageGenerationService } from '#stories/domain/services/IStoryImageGenerationService';
import { ChapterFactory } from '#stories/domain/factories/ChapterFactory';
import type { ImageGenerationContext, ChapterContent, CharacterReferenceResult } from '#stories/domain/services/types/ImageGenerationTypes';
import OpenAI from 'openai'
import env from '#start/env'
import { ALLOWED_LANGUAGES } from '#stories/constants/allowed_languages'
import { LOCALES } from '#stories/constants/locales'

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
        private readonly imageGenerationService: IStoryImageGenerationService
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
     * 2. Générer la character reference sheet (Image Provider)
     * 3. Générer cover image avec character reference
     * 4. Générer chapter images avec character reference
     */
    async generateStory(payload: StoryGenerationPayload): Promise<StoryGenerated> {
        console.log(`🎬 Début de la génération d'histoire complète avec ${this.imageGenerationService.getProviderName()}...`)
        const startTime = Date.now()

        try {
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
            }

            // ÉTAPE 2: Générer la character reference (si le provider supporte)
            let characterReference: CharacterReferenceResult | undefined = undefined
            const referenceStartTime = Date.now()
            console.log('🎨 Génération de la character reference sheet...')

            try {
                characterReference = await this.imageGenerationService.createCharacterReference(imageContext)
                const referenceEndTime = Date.now()
                console.log(`✅ Character reference créée en ${((referenceEndTime - referenceStartTime) / 1000).toFixed(2)}s`)
            } catch (error: any) {
                console.warn('⚠️ Échec création character reference, fallback vers text-to-image:', error.message)
                characterReference = undefined
            }

            // ÉTAPE 3: Générer cover image
            const parallelStartTime = Date.now()
            console.log('🚀 Génération cover image...')
            const coverImagePath = await this.imageGenerationService.generateCoverImage(imageContext, characterReference)
            if (!coverImagePath) {
                throw new Error('Cover image path est null')
            }
            const parallelEndTime = Date.now()
            console.log(`✅ Cover image générée en ${((parallelEndTime - parallelStartTime) / 1000).toFixed(2)}s`)

            // ÉTAPE 4: Générer les images des chapitres avec character reference
            const chaptersStartTime = Date.now()
            console.log('🎨 Génération des images de chapitres...')

            // Préparer les chapitres pour la génération d'images
            const chapterContents: ChapterContent[] = storyTextJson.chapters.map((chapter: any, index: number) => ({
                title: chapter.title,
                content: chapter.content,
                index,
            }))

            const chapterImagesResponse = await this.imageGenerationService.generateChapterImages(
                imageContext,
                chapterContents,
                characterReference
            )

            const chaptersEndTime = Date.now()
            console.log(`✅ ${chapterImagesResponse.metadata.successfulGeneration}/${storyTextJson.chapters.length} images de chapitres générées en ${((chaptersEndTime - chaptersStartTime) / 1000).toFixed(2)}s`)

            // ÉTAPE 5: Construire le résultat StoryGenerated
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
            console.log(`📊 Résumé: ${characterReference?.referenceId ? '✅ Character reference utilisée' : '⚠️ Text-to-image sans référence'}`)

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
            }
        } catch (error: any) {
            console.error('💥 Erreur lors de la génération de l\'histoire:', error)
            throw new Error(`Story generation failed: ${error.message}`)
        }
    }
}