import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('characters')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('story_id', 'uuid', (col) => 
      col.notNull().references('stories.id').onDelete('cascade')
    )
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('role', 'varchar(100)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('personality_traits', 'jsonb')
    .addColumn('physical_appearance', 'jsonb')
    .addColumn('background_story', 'text')
    .addColumn('character_image', 'varchar(500)')
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  // Index pour améliorer les performances de requêtes par story_id
  await db.schema
    .createIndex('characters_story_id_index')
    .on('characters')
    .column('story_id')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('characters').execute()
}