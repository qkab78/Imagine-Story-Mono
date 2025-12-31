# Clean Architecture Migration Guide - Stories Module

## Overview

The Stories module has been refactored to follow Clean Architecture and Domain-Driven Design (DDD) principles. This guide explains the new structure and how to work with it.

## Architecture Layers

### 1. Domain Layer (`domain/`)

The core business logic, independent of frameworks and infrastructure.

#### Entities
- **Story** - Main aggregate root with immutability and business rules
- Located in: `domain/entities/Story.ts`

#### Value Objects
All value objects are immutable and validate on creation:

- **IDs**: `StoryId`, `OwnerId`, `ChapterId`
- **Metadata**: `Title`, `Description`, `Slug`, `PublicationDate`
- **Settings**: `Language`, `Theme`, `Tone`
- **Content**: `ImageUrl`, `ChapterContent`

#### Repositories (Interfaces)
- `IStoryRepository` - Story persistence interface
- `IThemeRepository`, `ILanguageRepository`, `IToneRepository`

#### Domain Services (Interfaces)
- `IDateService` - Date operations
- `IRandomService` - Random number generation
- `IStoryGenerationService` - Story/image generation

#### Domain Events
- `StoryCreatedEvent`
- `StoryPublishedEvent`
- `StoryUnpublishedEvent`
- `StoryDeletedEvent`
- `IDomainEventPublisher` - Event publishing interface

#### Exceptions
**Domain Exceptions** (business rule violations):
- `DomainException` - Base class
- `InvalidValueObjectException` - Value object validation errors
- `InvariantViolationException` - Business rule violations

### 2. Application Layer (`application/`)

Orchestrates domain objects to perform use cases.

#### Use Cases
Each use case has a single responsibility:

- `CreateStoryUseCase` - Create new story
- `UpdateStoryUseCase` - Update story metadata
- `DeleteStoryUseCase` - Delete story
- `PublishStoryUseCase` - Make story public
- `UnpublishStoryUseCase` - Make story private
- `GetStoryByIdUseCase` - Retrieve by ID
- `GetStoryBySlugUseCase` - Retrieve by slug
- `ListPublicStoriesUseCase` - List public stories with pagination
- `ListUserStoriesUseCase` - List user's stories with pagination

#### DTOs (Data Transfer Objects)
- `StoryDTO`, `StoryListItemDTO` - Data transfer structures
- `PaginationDTO` - Pagination metadata

#### Presenters
- `StoryPresenter` - Converts Story entity to StoryDTO
- `StoryListPresenter` - Converts to list items
- `PaginationPresenter` - Converts pagination metadata

#### Exceptions
**Application Exceptions** (use case failures with HTTP codes):
- `ApplicationException` - Base class (includes statusCode)
- `StoryNotFoundException` - 404 errors
- `DuplicateSlugException` - 409 conflict
- `UnauthorizedStoryAccessException` - 403 forbidden

### 3. Infrastructure Layer (`infrastructure/`)

Concrete implementations of domain interfaces.

#### Repositories
- `KyselyStoryRepository` - Kysely-based Story repository
- `KyselyThemeRepository`, `KyselyLanguageRepository`, `KyselyToneRepository`

#### Mappers
- `StoryMapper` - Maps between database rows and Story entities

#### Services
- `DateService` - Implements `IDateService`
- `RandomService` - Implements `IRandomService`
- `OpenAiStoryGenerationService` - Implements `IStoryGenerationService`

#### Event Publishers
- `InMemoryEventPublisher` - Implements `IDomainEventPublisher`

## Usage Examples

### Creating a Story

```typescript
import { CreateStoryUseCase } from '#stories/application/use-cases/story/CreateStoryUseCase'

// Use case is auto-injected via @inject() decorator
class StoriesController {
  constructor(private createStory: CreateStoryUseCase) {}

  async store() {
    const story = await this.createStory.execute({
      ownerId: 'user-uuid',
      title: 'My Adventure',
      description: 'An epic tale',
      // ... other fields
    })

    return story
  }
}
```

### Handling Exceptions

```typescript
import { StoryNotFoundException } from '#stories/application/exceptions'

try {
  const story = await getStoryById.execute(storyId)
} catch (error) {
  if (error instanceof StoryNotFoundException) {
    // Returns 404
    return response.status(error.statusCode).json({
      code: error.code, // 'STORY_NOT_FOUND'
      message: error.message
    })
  }
  throw error
}
```

### Using Value Objects

```typescript
import { Title } from '#stories/domain/value-objects/metadata/Title.vo'
import { Slug } from '#stories/domain/value-objects/metadata/Slug.vo'

// Value objects validate on creation
const title = Title.create('My Story') // Throws if invalid
const slug = Slug.create('my-story')

// Value objects are immutable
console.log(title.getValue()) // 'My Story'

// Factory methods for common operations
const slugFromTitle = Slug.fromTitle('My Story Title') // 'my-story-title'
```

### Domain Events

```typescript
import { IDomainEventPublisher } from '#stories/domain/events/IDomainEventPublisher'

class PublishStoryUseCase {
  constructor(
    private storyRepository: IStoryRepository,
    private eventPublisher: IDomainEventPublisher
  ) {}

  async execute(storyId: string) {
    const story = await this.storyRepository.findById(storyId)
    const publishedStory = story.publish()

    await this.storyRepository.save(publishedStory)

    // Publish domain event
    await this.eventPublisher.publish(
      StoryPublishedEvent.create(
        publishedStory.id,
        publishedStory.ownerId,
        publishedStory.title
      )
    )
  }
}
```

## Dependency Injection

All dependencies are configured in `app/providers/app_provider.ts`:

```typescript
// Repositories
this.app.container.singleton(IStoryRepository, () => {
  return this.app.container.make(KyselyStoryRepository)
})

// Services
this.app.container.singleton(IDateService, () => {
  return this.app.container.make(DateService)
})

// Event Publisher
this.app.container.singleton(IDomainEventPublisher, () => {
  return this.app.container.make(InMemoryEventPublisher)
})
```

## Testing

### Unit Tests
Test domain logic in isolation using mocks:

```typescript
test('should publish story', async ({ assert }) => {
  const mockRepository = {
    findById: async () => testStory,
    save: async () => {}
  }
  const mockEventPublisher = {
    publish: async () => {}
  }

  const useCase = new PublishStoryUseCase(
    mockRepository,
    mockEventPublisher
  )

  await useCase.execute(storyId)
  // assertions...
})
```

### Running Tests
```bash
npm test
```

All 128 tests passing ✓

## Best Practices

### 1. Immutability
- Value objects are immutable
- Entities return new instances on modification
- Use factory methods for transformations

### 2. Exception Handling
- Use domain exceptions for business rule violations
- Use application exceptions for use case failures
- Include HTTP status codes in application exceptions

### 3. Value Object Creation
- Always validate in the constructor
- Provide static factory methods for common patterns
- Use descriptive error messages

### 4. Use Cases
- Keep use cases focused on a single responsibility
- Inject dependencies via constructor
- Publish domain events for side effects

### 5. Repository Pattern
- Work with domain entities, not database rows
- Use mappers to convert between layers
- Keep queries focused and simple

## Migration Checklist

- ✅ Domain Layer - Entities, Value Objects, Interfaces
- ✅ Application Layer - Use Cases, DTOs, Presenters
- ✅ Infrastructure Layer - Repositories, Services, Mappers
- ✅ Domain Events - Events and Publisher
- ✅ Exception Hierarchy - Domain and Application exceptions
- ✅ Dependency Injection - All services registered
- ✅ Tests - 128 tests passing

## Next Steps

Future improvements to consider:

1. **Production Event Publisher** - Replace InMemoryEventPublisher with RabbitMQ/Redis
2. **CQRS** - Separate read/write models for better performance
3. **Event Sourcing** - Store domain events as source of truth
4. **Saga Pattern** - Handle complex multi-step business processes
5. **API Documentation** - Generate OpenAPI specs from DTOs

## Resources

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [AdonisJS Dependency Injection](https://docs.adonisjs.com/guides/concepts/dependency-injection)
