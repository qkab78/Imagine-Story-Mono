import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('access_tokens')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('tokenable_id', 'uuid', (col) => col
      .notNull()
      .references('users.id')
      .onDelete('cascade')
    )
    .addColumn('type', 'varchar', (col) => col.notNull())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('hash', 'varchar', (col) => col.notNull())
    .addColumn('abilities', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.notNull())
    .addColumn('last_used_at', 'timestamp')
    .addColumn('expires_at', 'timestamp')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('access_tokens').execute()
}