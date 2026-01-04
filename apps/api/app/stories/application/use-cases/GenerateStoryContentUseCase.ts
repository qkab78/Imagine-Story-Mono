import { inject } from '@adonisjs/core'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import { IStoryGenerationService } from '#stories/domain/services/IStoryGeneration'
import { ChapterFactory } from '#stories/domain/factories/ChapterFactory'
import { ImageUrl } from '#stories/domain/value-objects/media/ImageUrl.vo'
import { Slug } from '#stories/domain/value-objects/metadata/Slug.vo'

export interface GenerateStoryContentPayload {
  storyId: string
  synopsis: string
  theme: string
  protagonist: string
  childAge: number
  numberOfChapters: number
  language: string
  tone: string
  species: string
}

@inject()
export class GenerateStoryContentUseCase {
  constructor(
    private readonly storyRepository: IStoryRepository,
    private readonly storyGenerationService: IStoryGenerationService
  ) {}

  async execute(payload: GenerateStoryContentPayload) {
    console.log(`🤖 Generating story content for: ${payload.storyId}`)

    // 1. Récupérer la story
    const story = await this.storyRepository.findById(payload.storyId)
    if (!story) throw new Error('Story not found')

    try {
      // 2. Générer le contenu avec AI
      const storyGenerated = await this.storyGenerationService.generateStory({
        title: story.title,
        synopsis: payload.synopsis,
        theme: payload.theme,
        protagonist: payload.protagonist,
        childAge: payload.childAge,
        numberOfChapters: payload.numberOfChapters,
        language: payload.language,
        tone: payload.tone,
        species: payload.species,
        isPublic: story.isPublic(),
        ownerId: story.ownerId.getValue(),
        status: story.generationStatus,
      })

      // 3. Créer les entités Chapter
      const chapters = storyGenerated.chapters.map((chapterData) => {
        const position = chapterData.id.getValue()

        if (chapterData.image) {
          return ChapterFactory.createWithImage({
            position,
            title: chapterData.title,
            content: chapterData.content,
            imageUrl: chapterData.image.imageUrl.getValue(),
          })
        }

        return ChapterFactory.createWithoutImage({
          position,
          title: chapterData.title,
          content: chapterData.content,
        })
      })

      // 4. Mettre à jour la story avec le contenu généré
      const updatedStory = story.completeGeneration(
        chapters,
        ImageUrl.create(storyGenerated.coverImageUrl),
        storyGenerated.conclusion,
        storyGenerated.title,
        Slug.fromTitle(storyGenerated.title) // Generate slug from title to ensure proper normalization
      )

      await this.storyRepository.save(updatedStory)

      console.log(`✅ Story generation completed: ${payload.storyId}`)
      console.log(`📖 Generated title: "${storyGenerated.title}"`)
      console.log(`🔗 Generated slug: "${storyGenerated.slug}"`)

      return updatedStory
    } catch (error: any) {
      console.error(`❌ Story generation failed: ${error.message}`)

      // Marquer comme échoué seulement si le status est processing
      if (story.generationStatus.isProcessing()) {
        story.failGeneration(error.message)
        await this.storyRepository.save(story)
      } else {
        console.error(`⚠️ Cannot mark story as failed: status is ${story.generationStatus.getValue()}, expected processing`)
      }

      throw error
    }
  }
}
