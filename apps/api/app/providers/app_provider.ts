import type { ApplicationService } from '@adonisjs/core/types'
import LemonSqueezyPaymentService from '#payments/services/lemonsqueezy/lemon_squeezy_payment_service'
import PaymentService from '#payments/services/payment_service'
import { IDateService } from '#stories/domain/services/IDateService'
import { IRandomService } from '#stories/domain/services/IRandomService'
import { IStoryRepository } from '#stories/domain/repositories/StoryRepository'
import { IStoryGenerationService } from '#stories/domain/services/IStoryGeneration'
import { IThemeRepository } from '#stories/domain/repositories/ThemeRepository'
import { ILanguageRepository } from '#stories/domain/repositories/LanguageRepository'
import { IToneRepository } from '#stories/domain/repositories/ToneRepository'
import { IDomainEventPublisher } from '#stories/domain/events/IDomainEventPublisher'
import { IStorageService } from '#stories/domain/services/IStorageService'
import { KyselyToneRepository } from '#stories/infrastructure/adapters/repositories/KyselyToneRepository'
import storageConfig from '#config/storage'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    const { DateService } = await import('#stories/infrastructure/adapters/services/date.service')
    const { RandomService } = await import('#stories/infrastructure/adapters/services/random.service')
    const { KyselyStoryRepository } = await import('#stories/infrastructure/adapters/repositories/KyselyStoryRepository')
    const { OpenAiStoryGenerationService } = await import('#stories/infrastructure/adapters/services/OpenAiStoryGeneration.service')
    const { KyselyThemeRepository } = await import('#stories/infrastructure/adapters/repositories/KyselyThemeRepository')
    const { KyselyLanguageRepository } = await import('#stories/infrastructure/adapters/repositories/KyselyLanguageRepository')
    const { InMemoryEventPublisher } = await import('#stories/infrastructure/adapters/events/InMemoryEventPublisher')

    // Storage service binding (conditional based on config)
    const provider = storageConfig.default

    if (provider === 'minio') {
      const { MinIOStorageService } = await import('#stories/infrastructure/adapters/services/MinIOStorageService')
      this.app.container.singleton(IStorageService, async () => {
        const service = new MinIOStorageService()
        await service.ensureBucketExists()
        return service
      })
    } else {
      const { LocalStorageService } = await import('#stories/infrastructure/adapters/services/LocalStorageService')
      this.app.container.singleton(IStorageService, () => {
        return new LocalStorageService()
      })
    }

    this.app.container.singleton(PaymentService, () => {
      return new LemonSqueezyPaymentService()
    })
    this.app.container.singleton(IDateService, () => {
      return this.app.container.make(DateService)
    })
    this.app.container.singleton(IRandomService, () => {
      return this.app.container.make(RandomService)
    })
    this.app.container.singleton(IStoryRepository, () => {
      return this.app.container.make(KyselyStoryRepository)
    })
    this.app.container.singleton(IStoryGenerationService, () => {
      return this.app.container.make(OpenAiStoryGenerationService)
    })
    this.app.container.singleton(IThemeRepository, () => {
      return this.app.container.make(KyselyThemeRepository)
    })
    this.app.container.singleton(ILanguageRepository, () => {
      return this.app.container.make(KyselyLanguageRepository)
    })
    this.app.container.singleton(IToneRepository, () => {
      return this.app.container.make(KyselyToneRepository)
    })
    this.app.container.singleton(IDomainEventPublisher, () => {
      return this.app.container.make(InMemoryEventPublisher)
    })
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
