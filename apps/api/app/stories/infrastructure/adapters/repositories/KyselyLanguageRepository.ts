import { Language } from "#stories/domain/entities/language.entity";
import { ILanguageRepository } from "#stories/domain/repositories/LanguageRepository";
import { db } from "#services/db";
import { LanguageBuilder } from "#stories/domain/builders/language.builder";

export class KyselyLanguageRepository implements ILanguageRepository {
    async findById(id: string): Promise<Language> {
        const language = await db.selectFrom('languages').where('id', '=', id).selectAll().executeTakeFirst()
        if (!language) {
            throw new Error("Language not found")
        }
        return LanguageBuilder.create()
            .withId(language.id)
            .withName(language.name)
            .withCode(language.code)
            .withIsFree(language.is_free)
            .build()
    }
}