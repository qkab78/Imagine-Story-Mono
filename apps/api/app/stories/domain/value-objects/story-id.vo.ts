import { IRandomService } from "../services/IRandomService.js"

export class StoryId {
    private readonly value: string
    constructor(private readonly randomService: IRandomService, private readonly id?: string) {
        this.value = this.id ?? this.randomService.generateRandomUuid()
    }
    getValue(): string {
        return this.value
    }

    equals(other: StoryId): boolean {
        return this.value === other.value
    }
}