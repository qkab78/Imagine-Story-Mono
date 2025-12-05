export class Language {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly code: string,
        public readonly isFree: boolean,
    ) {}
}