import { Tone } from "../entities/tone.entity.js"

export class ToneBuilder {
    private id: string | undefined
    private name: string | undefined
    private description: string | undefined

    static create(): ToneBuilder {
        return new ToneBuilder()
    }

    withId(id: string): ToneBuilder {
        this.id = id
        return this
    }

    withName(name: string): ToneBuilder {
        this.name = name
        return this
    }

    withDescription(description: string): ToneBuilder {
        this.description = description
        return this
    }

    public build(): Tone {
        if (!this.id) {
            throw new Error('Id is required')
        }
        if (!this.name) {
            throw new Error('Name is required')
        }
        if (!this.description) {
            throw new Error('Description is required')
        }

        return new Tone(this.id, this.name, this.description)
    }
}