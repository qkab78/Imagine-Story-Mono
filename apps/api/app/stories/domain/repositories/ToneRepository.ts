import { Tone } from "../entities/tone.entity.js";

export abstract class IToneRepository {
    abstract findById(id: string): Promise<Tone>;
}