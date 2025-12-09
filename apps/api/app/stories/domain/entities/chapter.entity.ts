export class Chapter {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly content: string,
        public readonly image: ChapterImage | null,
    ) {}
}

export class ChapterImage {
    constructor(
        public readonly id: number,
        public readonly imageUrl: string,
    ) {}
}