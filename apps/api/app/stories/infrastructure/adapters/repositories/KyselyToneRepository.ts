import { Tone } from "#stories/domain/entities/tone.entity";
import { IToneRepository } from "#stories/domain/repositories/ToneRepository";
import { db } from "#services/db";
import { ToneBuilder } from "#stories/domain/builders/tone.builder";

export class KyselyToneRepository implements IToneRepository {
    async findById(id: string): Promise<Tone> {
        const tone = await db.selectFrom('tones').where('id', '=', id).selectAll().executeTakeFirst()
        if (!tone) {
            throw new Error("Tone not found")
        }
        return ToneBuilder.create()
            .withId(tone.id)
            .withName(tone.name)
            .withDescription(tone.description ?? '')
            .build()
    }
}