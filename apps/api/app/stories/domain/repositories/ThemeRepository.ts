import { Theme } from "../entities/theme.entity.js";

export abstract class IThemeRepository {
    abstract findById(id: string): Promise<Theme>;
}