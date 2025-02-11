import * as path from 'node:path'
import { db } from '#services/db'
import * as fs from 'node:fs/promises'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { FileMigrationProvider, Migrator } from 'kysely'

export default class KyselyRollback extends BaseCommand {
  static commandName = 'kysely:rollback'
  static description = 'Rollback the database by running down method on the migration files'

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
    this.logger.info('Rollback starting...')
    const { error, results } = await this.migrator.migrateDown()

    results?.forEach((result) => {
      switch (result.status) {
        case 'Success':
          this.logger.success(`Migration ${result.migrationName} rollback successfully`)
          break
        case 'Error':
          this.logger.error(`Failed to rollback migration "${result.migrationName}"`)
          break
        case 'NotExecuted':
          this.logger.info(`Rollback pending "${result.migrationName}"`)
      }
    })

    if (error) {
      this.logger.error('Rollback failed')
      this.error = error
      this.exitCode = 1
    }
  }
}
