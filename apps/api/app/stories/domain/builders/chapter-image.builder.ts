import { ChapterImage } from "../entities/chapter.entity.js"

export class ChapterImageBuilder {
    private id: number | undefined
    private imageUrl: string | undefined

    private constructor() {}

    static create(): ChapterImageBuilder {
        return new ChapterImageBuilder()
    }

    withId(id: number): ChapterImageBuilder {
        this.id = id
        return this
    }

    withImageUrl(imageUrl: string): ChapterImageBuilder {
        this.imageUrl = imageUrl
        return this
    }

    public build(): ChapterImage {
        if (this.id === undefined) {
            throw new Error('Id is required')
        }
        if (!this.imageUrl) {
            throw new Error('Image URL is required')
        }

        return new ChapterImage(this.id, this.imageUrl)
    }
}
