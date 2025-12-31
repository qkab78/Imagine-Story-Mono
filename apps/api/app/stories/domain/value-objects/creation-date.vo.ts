export class CreationDate {
    private readonly value: Date

    constructor(date: Date | string) {
        if (typeof date === 'string') {
            this.value = new Date(date)
        } else {
            this.value = date
        }

        if (isNaN(this.value.getTime())) {
            throw new Error('Invalid creation date')
        }
    }

    static now(): CreationDate {
        return new CreationDate(new Date())
    }

    static fromString(dateString: string): CreationDate {
        return new CreationDate(dateString)
    }

    toISOString(): string {
        return this.value.toISOString()
    }

    toDate(): Date {
        return new Date(this.value)
    }

    isRecent(days: number = 7): boolean {
        const now = new Date()
        const diffInMs = now.getTime() - this.value.getTime()
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
        return diffInDays <= days
    }

    daysSinceCreation(): number {
        const now = new Date()
        const diffInMs = now.getTime() - this.value.getTime()
        return Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    }

    isBefore(other: CreationDate): boolean {
        return this.value < other.value
    }

    isAfter(other: CreationDate): boolean {
        return this.value > other.value
    }

    equals(other: CreationDate): boolean {
        return this.value.getTime() === other.value.getTime()
    }
}
