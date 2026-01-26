import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('webhook_events')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('event_id', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('event_type', 'varchar(50)', (col) => col.notNull())
    .addColumn('app_user_id', 'varchar(255)', (col) => col.notNull())
    .addColumn('status', 'varchar(20)', (col) => col.notNull().defaultTo('pending'))
    .addColumn('payload', 'jsonb', (col) => col.notNull())
    .addColumn('error_message', 'text')
    .addColumn('retry_count', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('processed_at', 'timestamp')
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  // Index for performance
  await db.schema
    .createIndex('idx_webhook_events_event_id')
    .on('webhook_events')
    .column('event_id')
    .execute()

  await db.schema
    .createIndex('idx_webhook_events_status')
    .on('webhook_events')
    .column('status')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('webhook_events').execute()
}