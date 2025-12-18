import { IThemeRepository } from "#stories/domain/repositories/ThemeRepository";
import { Theme } from "#stories/domain/entities/theme.entity";
import { db } from "#services/db";
import { ThemeBuilder } from "#stories/domain/builders/theme.builder";

export class KyselyThemeRepository implements IThemeRepository {
    async findById(id: string): Promise<Theme> {
        const theme = await db.selectFrom('themes').where('id', '=', id).selectAll().executeTakeFirst()
        if (!theme) {
            throw new Error("Theme not found")
        }
        return ThemeBuilder.create()
            .withId(theme.id)
            .withName(theme.name)
            .withDescription(theme.description)
            .build()
    }
}