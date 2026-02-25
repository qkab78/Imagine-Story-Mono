import type { ApplicationService } from '@adonisjs/core/types'
import logger from '@adonisjs/core/services/logger'
import LemonSqueezyPaymentService from '#payments/services/lemonsqueezy/lemon_squeezy_payment_service'
import PaymentService from '#payments/services/payment_service'
import { IDateService } from '#stories/domain/services/i_date_service'
import { IRandomService } from '#stories/domain/services/i_random_service'
import { IStoryRepository } from '#stories/domain/repositories/story_repository'
import { IStoryGenerationService } from '#stories/domain/services/i_story_generation'
import { IStoryImageGenerationService } from '#stories/domain/services/i_story_image_generation_service'
import { ITranslationService } from '#stories/domain/services/i_translation_service'
import { IThemeRepository } from '#stories/domain/repositories/theme_repository'
import { ILanguageRepository } from '#stories/domain/repositories/language_repository'
import { IToneRepository } from '#stories/domain/repositories/tone_repository'
import { IDomainEventPublisher } from '#stories/domain/events/i_domain_event_publisher'
import { IStorageService } from '#stories/domain/services/i_storage_service'
import { IJobDispatcher } from '#stories/domain/services/i_job_dispatcher'
import { KyselyToneRepository } from '#stories/infrastructure/adapters/repositories/kysely_tone_repository'
import { IUserRepository } from '#users/domain/repositories/user_repository'
import { ISubscriptionRepository } from '#subscription/domain/repositories/i_subscription_repository'
import { KyselySubscriptionRepository } from '#subscription/infrastructure/repositories/kysely_subscription_repository'
import { IRevenueCatService } from '#subscription/domain/services/i_revenuecat_service'
import { ISocialAccountRepository } from '#auth/domain/repositories/i_social_account_repository'
import { IAuthUserRepository } from '#auth/domain/repositories/i_auth_user_repository'
import { IEmailVerificationTokenRepository } from '#auth/domain/repositories/i_email_verification_token_repository'
import { ISocialAuthService } from '#auth/application/services/i_social_auth_service'
import storageConfig from '#config/storage'
import env from '#start/env'

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
    const { RandomService } =
      await import('#stories/infrastructure/adapters/services/random.service')
    const { KyselyStoryRepository } =
      await import('#stories/infrastructure/adapters/repositories/kysely_story_repository')
    const { OpenAiStoryGenerationService } =
      await import('#stories/infrastructure/adapters/services/open_ai_story_generation.service')
    const { LeonardoAiImageGenerationService } =
      await import('#stories/infrastructure/adapters/services/leonardo_ai_image_generation_service')
    const { GeminiImageGenerationService } =
      await import('#stories/infrastructure/adapters/services/gemini_image_generation_service')
    const { KyselyThemeRepository } =
      await import('#stories/infrastructure/adapters/repositories/kysely_theme_repository')
    const { KyselyLanguageRepository } =
      await import('#stories/infrastructure/adapters/repositories/kysely_language_repository')
    const { InMemoryEventPublisher } =
      await import('#stories/infrastructure/adapters/events/in_memory_event_publisher')
    const { KyselyUserRepository } =
      await import('#users/infrastructure/repositories/kysely_user_repository')
    const { KyselySocialAccountRepository } =
      await import('#auth/infrastructure/repositories/kysely_social_account_repository')
    const { KyselyAuthUserRepository } =
      await import('#auth/infrastructure/repositories/kysely_auth_user_repository')
    const { KyselyEmailVerificationTokenRepository } =
      await import('#auth/infrastructure/repositories/kysely_email_verification_token_repository')
    const { AllySocialAuthService } =
      await import('#auth/infrastructure/services/ally_social_auth_service')
    const { DeepLTranslationService } =
      await import('#stories/infrastructure/adapters/services/deepl_translation_service')
    const { GoogleTranslationService } =
      await import('#stories/infrastructure/adapters/services/google_translation_service')
    const { CompositeTranslationService } =
      await import('#stories/infrastructure/adapters/services/composite_translation_service')

    // Storage service binding (conditional based on config)
    const provider = storageConfig.default

    if (provider === 'minio') {
      const { MinioStorageService } =
        await import('#stories/infrastructure/adapters/services/minio_storage_service')
      this.app.container.singleton(IStorageService, async () => {
        const service = new MinioStorageService()
        await service.ensureBucketExists()
        return service
      })
    } else {
      const { LocalStorageService } =
        await import('#stories/infrastructure/adapters/services/local_storage_service')
      this.app.container.singleton(IStorageService, () => {
        return new LocalStorageService()
      })
    }

    // Image generation service binding
    // Configurable: Gemini Imagen 3 (Nano Banana) par défaut, Leonardo AI en option
    const imageProvider = env.get('IMAGE_PROVIDER', 'gemini') // 'gemini' ou 'leonardo'

    if (imageProvider === 'leonardo') {
      logger.info('Using Leonardo AI for image generation')
      this.app.container.singleton(IStoryImageGenerationService, () => {
        return this.app.container.make(LeonardoAiImageGenerationService)
      })
    } else {
      logger.info('Using Gemini Imagen 3 (Nano Banana) for image generation')
      this.app.container.singleton(IStoryImageGenerationService, () => {
        return this.app.container.make(GeminiImageGenerationService)
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
    this.app.container.singleton(IUserRepository, () => {
      return this.app.container.make(KyselyUserRepository)
    })

    this.app.container.singleton(ISubscriptionRepository, () => {
      return this.app.container.make(KyselySubscriptionRepository)
    })

    const { RevenueCatApiService } =
      await import('#subscription/infrastructure/services/revenuecat_api_service')
    this.app.container.singleton(IRevenueCatService, () => {
      return this.app.container.make(RevenueCatApiService)
    })

    this.app.container.singleton(ISocialAccountRepository, () => {
      return this.app.container.make(KyselySocialAccountRepository)
    })
    this.app.container.singleton(IAuthUserRepository, () => {
      return this.app.container.make(KyselyAuthUserRepository)
    })
    this.app.container.singleton(IEmailVerificationTokenRepository, () => {
      return this.app.container.make(KyselyEmailVerificationTokenRepository)
    })
    this.app.container.singleton(ISocialAuthService, () => {
      return this.app.container.make(AllySocialAuthService)
    })

    // Job dispatcher binding
    const { BullJobDispatcher } =
      await import('#stories/infrastructure/adapters/services/bull_job_dispatcher')
    this.app.container.singleton(IJobDispatcher, () => {
      return new BullJobDispatcher()
    })

    // Translation service binding
    this.app.container.singleton(ITranslationService, async () => {
      const deeplService = await this.app.container.make(DeepLTranslationService)
      const googleService = await this.app.container.make(GoogleTranslationService)
      return new CompositeTranslationService(deeplService, googleService)
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
