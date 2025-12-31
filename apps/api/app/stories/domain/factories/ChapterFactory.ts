import { Chapter, ChapterImage } from '../entities/chapter.entity.js'
import { ChapterId } from '../value-objects/ids/ChapterId.vo.js'
import { ImageUrl } from '../value-objects/media/ImageUrl.vo.js'

/**
 * Chapter Factory
 *
 * Responsible for Chapter entity creation.
 * Handles value object construction and provides convenient factory methods.
 */
export class ChapterFactory {
  /**
   * Create a new Chapter with optional image
   */
  public static create(params: {
    position: number
    title: string
    content: string
    imageUrl?: string
  }): Chapter {
    const chapterId = ChapterId.create(params.position)
    const image = params.imageUrl
      ? ChapterImage.create(chapterId, ImageUrl.create(params.imageUrl))
      : null

    return Chapter.create(chapterId, params.title, params.content, image)
  }

  /**
   * Create a Chapter without image
   */
  public static createWithoutImage(params: {
    position: number
    title: string
    content: string
  }): Chapter {
    return Chapter.create(ChapterId.create(params.position), params.title, params.content, null)
  }

  /**
   * Create a Chapter with image
   */
  public static createWithImage(params: {
    position: number
    title: string
    content: string
    imageUrl: string
  }): Chapter {
    const chapterId = ChapterId.create(params.position)
    const image = ChapterImage.create(chapterId, ImageUrl.create(params.imageUrl))

    return Chapter.create(chapterId, params.title, params.content, image)
  }

  /**
   * Create multiple chapters from array
   */
  public static createMany(
    chaptersData: Array<{ position: number; title: string; content: string; imageUrl?: string }>
  ): Chapter[] {
    return chaptersData.map((data) => ChapterFactory.create(data))
  }
}
