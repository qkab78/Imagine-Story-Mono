import { ImageUrl } from '../value-objects/media/image_url.vo.js'

export class ImageUrlBuilder {
  private id: number | undefined
  private imageUrl: string | undefined

  private constructor() {}

  static create(): ImageUrlBuilder {
    return new ImageUrlBuilder()
  }

  withId(id: number): ImageUrlBuilder {
    this.id = id
    return this
  }

  withImageUrl(imageUrl: string): ImageUrlBuilder {
    this.imageUrl = imageUrl
    return this
  }

  public build(): ImageUrl {
    if (this.id === undefined) {
      throw new Error('Id is required')
    }
    if (!this.imageUrl) {
      throw new Error('Image URL is required')
    }

    return ImageUrl.create(this.imageUrl)
  }
}
