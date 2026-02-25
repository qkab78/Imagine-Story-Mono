import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('subscriptions')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('users.id').unique())
    .addColumn('status', 'varchar(20)', (col) => col.notNull().defaultTo('free'))
    .addColumn('revenuecat_app_user_id', 'varchar(255)')
    .addColumn('product_id', 'varchar(255)')
    .addColumn('entitlement_id', 'varchar(255)')
    .addColumn('store', 'varchar(20)')
    .addColumn('expiration_date', 'timestamp')
    .addColumn('original_purchase_date', 'timestamp')
    .addColumn('will_renew', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('grace_period_expires_date', 'timestamp')
    .addColumn('management_url', 'varchar(500)')
    .addColumn('last_verified_at', 'timestamp')
    .addColumn('last_webhook_event_id', 'varchar(255)')
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  await db.schema
    .createIndex('idx_subscriptions_user_id')
    .on('subscriptions')
    .column('user_id')
    .execute()

  await db.schema
    .createIndex('idx_subscriptions_status')
    .on('subscriptions')
    .column('status')
    .execute()

  await db.schema
    .createIndex('idx_subscriptions_revenuecat_app_user_id')
    .on('subscriptions')
    .column('revenuecat_app_user_id')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('idx_subscriptions_revenuecat_app_user_id').execute()
  await db.schema.dropIndex('idx_subscriptions_status').execute()
  await db.schema.dropIndex('idx_subscriptions_user_id').execute()
  await db.schema.dropTable('subscriptions').execute()
}
