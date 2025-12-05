import { IDateService } from "./IDateService.js";

export class DateService implements IDateService {
    public now(): string {
        return new Date().toISOString()
    }
}