import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('stories')
    .addColumn('appearance_preset', 'varchar(50)', (col) => col.defaultTo('light'))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('stories').dropColumn('appearance_preset').execute()
}
