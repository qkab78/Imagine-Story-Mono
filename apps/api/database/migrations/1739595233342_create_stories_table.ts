import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('stories')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('title', 'varchar', (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('public', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('synopsis', 'text', (col) => col.notNull())
    .addColumn('cover_image', 'text', (col) => col.notNull())
    .addColumn('chapters', 'integer', (col) => col.notNull())
    .addColumn('slug', 'varchar', (col) => col.notNull().unique())
    .addColumn('user_id', 'uuid', (col) => col
      .notNull()
      .references('users.id')
      .onDelete('cascade')
    )
    .addColumn('created_at', 'timestamp', (col) => col.notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('stories').execute()
}