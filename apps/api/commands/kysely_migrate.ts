import * as path from 'node:path'
import { db } from '#services/db'
import * as fs from 'node:fs/promises'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { FileMigrationProvider, Migrator } from 'kysely'

export default class KyselyMigrate extends BaseCommand {
  static commandName = 'kysely:migrate'
  static description = 'Migrate the database by executing pending migrations'

  static options: CommandOptions = {
    startApp: true,
  }

  declare migrator: Migrator

  async prepare() {
    this.migrator = new Migrator({
      db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: this.app.migrationsPath(),
      }),
    })
  }

  async completed() {
    await db.destroy()
  }

  async run() {
    this.logger.info('Migration starting...')
    const { error, results } = await this.migrator.migrateToLatest()

    results?.forEach((result) => {
      switch (result.status) {
        case 'Success':
          this.logger.success(`Migration ${result.migrationName} was executed successfully`)
          break
        case 'Error':
          this.logger.error(`Failed to execute migration "${result.migrationName}"`)
          break
        case 'NotExecuted':
          this.logger.info(`migration pending "${result.migrationName}"`)
      }
    })

    if (error) {
      this.logger.error('Migration failed')
      this.error = error
      this.exitCode = 1
    }
  }
}
