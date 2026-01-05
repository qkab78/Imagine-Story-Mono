import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('stories')
    .addColumn('generation_status', 'varchar', (col) => col.notNull().defaultTo('completed'))
    .addColumn('generation_started_at', 'timestamp')
    .addColumn('generation_completed_at', 'timestamp')
    .addColumn('generation_error', 'text')
    .addColumn('job_id', 'varchar')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('stories')
    .dropColumn('generation_status')
    .dropColumn('generation_started_at')
    .dropColumn('generation_completed_at')
    .dropColumn('generation_error')
    .dropColumn('job_id')
    .execute()
}
