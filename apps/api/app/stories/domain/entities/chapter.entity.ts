export class Chapter {
    constructor(
        private readonly id: string,
        private readonly title: string,
        private readonly content: string,
        private readonly images: ChapterImage[],
    ) {}
}

export class ChapterImage {
    constructor(
        private readonly id: string,
        private readonly title: string,
        private readonly imageUrl: string,
    ) {}
}