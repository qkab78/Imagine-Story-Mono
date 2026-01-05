import { Story } from '#stories/domain/entities/story.entity'
import { ChapterFactory } from '#stories/domain/factories/ChapterFactory'
import { Theme } from '#stories/domain/value-objects/settings/Theme.vo'
import { Language } from '#stories/domain/value-objects/settings/Language.vo'
import { Tone } from '#stories/domain/value-objects/settings/Tone.vo'
import { StoryId } from '#stories/domain/value-objects/ids/StoryId.vo'
import { Slug } from '#stories/domain/value-objects/metadata/Slug.vo'
import { ChildAge } from '#stories/domain/value-objects/metadata/ChildAge.vo'
import { ImageUrl } from '#stories/domain/value-objects/media/ImageUrl.vo'
import { OwnerId } from '#stories/domain/value-objects/ids/OwnerId.vo'
import { PublicationDate } from '#stories/domain/value-objects/metadata/PublicationDate.vo'
import { PublicationStatus } from '#stories/domain/value-objects/metadata/PublicationStatus.vo'
import { GenerationStatus } from '#stories/domain/value-objects/metadata/GenerationStatus.vo'
/**
 * Database row interfaces
 */
interface StoryRow {
  id: string
  title: string
  synopsis: string
  protagonist: string
  child_age: number
  species: string
  conclusion: string
  cover_image: string
  user_id: string
  public: boolean
  created_at: Date
  theme_id: string
  language_id: string
  tone_id: string
  slug: string
  story_chapters: unknown
  chapter_images: unknown
  generation_status?: string
  job_id?: string | null
  generation_started_at?: Date | null
  generation_completed_at?: Date | null
  generation_error?: string | null
}

interface ThemeRow {
  id: string
  name: string
  description: string | null
}

interface LanguageRow {
  id: string
  name: string
  code: string
  is_free: boolean
}

interface ToneRow {
  id: string
  name: string
  description: string | null
}

interface StoryChapter {
  content: string
  title: string
}

interface StoryChapterImage {
  chapterIndex: number
  chapterTitle: string
  imagePath: string
}

/**
 * Story Mapper
 *
 * Converts between database rows and Story domain entities
 */
export class StoryMapper {
  /**
   * Map database row to Story entity
   */
  public static toDomain(
    storyRow: StoryRow,
    themeRow: ThemeRow,
    languageRow: LanguageRow,
    toneRow: ToneRow
  ): Story {
    // Map chapters
    const storyChapters = (storyRow.story_chapters as StoryChapter[]) || []
    const chapterImages = (storyRow.chapter_images as StoryChapterImage[]) || []

    const chapters = storyChapters.map((chapter: StoryChapter, index: number) => {
      const chapterImage = chapterImages.find((image) => image.chapterIndex === index)
      const position = index + 1

      if (chapterImage?.imagePath) {
        return ChapterFactory.createWithImage({
          position,
          title: chapter.title,
          content: chapter.content,
          imageUrl: chapterImage.imagePath,
        })
      }

      return ChapterFactory.createWithoutImage({
        position,
        title: chapter.title,
        content: chapter.content,
      })
    })

    // Map value objects
    const theme = Theme.create(themeRow.id, themeRow.name, themeRow.description || '')
    const language = Language.create(
      languageRow.id,
      languageRow.name,
      languageRow.code,
      languageRow.is_free
    )
    const tone = Tone.create(toneRow.id, toneRow.name, toneRow.description || '')

    // Reconstitute story from database
    return Story.create(
      StoryId.create(storyRow.id),
      Slug.create(storyRow.slug),
      ChildAge.create(storyRow.child_age),
      storyRow.generation_status === GenerationStatus.completed().getValue() ? ImageUrl.create(storyRow.cover_image) : null,
      OwnerId.create(storyRow.user_id),
      PublicationDate.create(storyRow.created_at),
      storyRow.public ? PublicationStatus.public() : PublicationStatus.private(),
      storyRow.title,
      storyRow.synopsis,
      storyRow.protagonist,
      storyRow.species,
      storyRow.conclusion,
      theme,
      language,
      tone,
      chapters,
      storyRow.generation_status
        ? GenerationStatus.create(storyRow.generation_status as any)
        : GenerationStatus.completed(),
      storyRow.job_id ?? null,
      storyRow.generation_started_at ?? null,
      storyRow.generation_completed_at ?? null,
      storyRow.generation_error ?? null
    )
  }

  /**
   * Map Story entity to database row (for insert/update)
   */
  public static toPersistence(story: Story): {
    id: string
    title: string
    content: string // Legacy field - using first chapter content or empty
    synopsis: string
    protagonist: string
    child_age: number
    species: string
    conclusion: string
    cover_image: string
    user_id: string
    public: boolean
    created_at: Date
    updated_at: Date
    theme_id: string
    language_id: string
    tone_id: string
    slug: string
    chapters: number // Number of chapters
    story_chapters: string // JSON string
    chapter_images: string // JSON string
    generation_status: string
    job_id: string | null
    generation_started_at: Date | null
    generation_completed_at: Date | null
    generation_error: string | null
  } {
    // Map chapters
    const storyChapters: StoryChapter[] = story.getAllChapters().map((chapter) => ({
      title: chapter.title,
      content: chapter.content,
    }))

    const chapterImages: StoryChapterImage[] = story
      .getAllChapters()
      .map((chapter, index) => {
        if (chapter.image) {
          return {
            chapterIndex: index,
            chapterTitle: chapter.title,
            imagePath: chapter.image.imageUrl.getValue(),
          }
        }
        return null
      })
      .filter((img): img is StoryChapterImage => img !== null)

    return {
      id: story.id.getValue(),
      title: story.title,
      content: story.getAllChapters()[0]?.content || '', // Legacy field
      synopsis: story.synopsis,
      protagonist: story.protagonist,
      child_age: story.childAge.getValue(),
      species: story.species,
      conclusion: story.conclusion,
      cover_image: story.coverImageUrl?.getValue() || '',
      user_id: story.ownerId.getValue(),
      public: story.isPublic(),
      created_at: story.publicationDate.getValue(),
      updated_at: new Date(), // Auto-update timestamp
      theme_id: story.theme.id.getValue(),
      language_id: story.language.id.getValue(),
      tone_id: story.tone.id.getValue(),
      slug: story.slug.getValue(),
      chapters: story.getAllChapters().length,
      story_chapters: JSON.stringify(storyChapters),
      chapter_images: JSON.stringify(chapterImages),
      generation_status: story.generationStatus.getValue(),
      job_id: story.jobId,
      generation_started_at: story.generationStartedAt,
      generation_completed_at: story.generationCompletedAt,
      generation_error: story.generationError,
    }
  }
}
