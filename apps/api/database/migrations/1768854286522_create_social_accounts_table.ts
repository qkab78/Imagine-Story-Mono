import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('social_accounts')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('cascade').notNull()
    )
    .addColumn('provider', 'varchar(50)', (col) => col.notNull())
    .addColumn('provider_user_id', 'varchar(255)', (col) => col.notNull())
    .addColumn('email', 'varchar(255)', (col) => col.notNull())
    .addColumn('name', 'varchar(255)')
    .addColumn('avatar_url', 'text')
    .addColumn('access_token', 'text', (col) => col.notNull())
    .addColumn('refresh_token', 'text')
    .addColumn('token_expires_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .execute()

  // Unique constraint: one social account per provider per user
  await db.schema
    .createIndex('social_accounts_provider_user_id_unique')
    .on('social_accounts')
    .columns(['provider', 'provider_user_id'])
    .unique()
    .execute()

  // Index for user lookups
  await db.schema
    .createIndex('social_accounts_user_id_idx')
    .on('social_accounts')
    .column('user_id')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('social_accounts').execute()
}
