import { db } from '#services/db'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { fakerFR as faker } from '@faker-js/faker'
import hash from '@adonisjs/core/services/hash'
import env from '#start/env'

export default class Seed extends BaseCommand {
  static commandName = 'seed'
  static description = 'Seed database with initial data'

  static options: CommandOptions = {
    startApp: true,
  }

  async completed() {
    await db.destroy()
  }

  async run() {
    this.logger.info('Seeding...')
    await this.createUsers()
  }

  async initDatabase() {
    await db.deleteFrom('users').execute()
  }

  async createUsers() {
    const users = await Promise.all(
      Array.from({ length: 2 }, async () => ({
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        password: await hash.make(env.get('SEED_USER_PASSWORD')!),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )

    return db.insertInto('users').values(users).execute()
  }
}
