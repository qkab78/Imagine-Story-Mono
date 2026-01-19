import { Chapter, ChapterImage } from "../entities/chapter.entity.js"
import { ChapterId } from "../value-objects/ids/ChapterId.vo.js"

export class ChapterBuilder {
    private id: ChapterId | undefined
    private title: string | undefined
    private content: string | undefined
    private image: ChapterImage | null = null

    private constructor() {}

    static create(): ChapterBuilder {
        return new ChapterBuilder()
    }

    withId(id: number): ChapterBuilder {
        this.id = ChapterId.create(id)
        return this
    }

    withTitle(title: string): ChapterBuilder {
        this.title = title
        return this
    }

    withContent(content: string): ChapterBuilder {
        this.content = content
        return this
    }

    withImage(image: ChapterImage | null): ChapterBuilder {
        this.image = image
        return this
    }

    public build(): Chapter {
        if (this.id === undefined) {
            throw new Error('Id is required')
        }
        if (!this.title) {
            throw new Error('Title is required')
        }
        if (!this.content) {
            throw new Error('Content is required')
        }

        return Chapter.create(this.id, this.title, this.content, this.image)
    }
}
