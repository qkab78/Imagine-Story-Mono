import { Language } from "../entities/language.entity.js";

export abstract class ILanguageRepository {
    abstract findById(id: string): Promise<Language>;
}