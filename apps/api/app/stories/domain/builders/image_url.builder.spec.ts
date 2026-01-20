import { test } from '@japa/runner'
import { ImageUrlBuilder } from './image_url.builder.js'

test.group(ImageUrlBuilder.name, () => {
  test('should create a chapter image builder', async ({ assert }) => {
    const chapterImageBuilder = ImageUrlBuilder.create()
    assert.isDefined(chapterImageBuilder)
  })

  test('should build a chapter image', async ({ assert }) => {
    const chapterImage = ImageUrlBuilder.create()
      .withId(1)
      .withImageUrl('https://example.com/image.jpg')
      .build()

    assert.isDefined(chapterImage)
    assert.equal(chapterImage.getValue(), 'https://example.com/image.jpg')
  })

  test('should throw an error if the id is not set', async ({ assert }) => {
    const chapterImageBuilder = ImageUrlBuilder.create()
    assert.throws(() => chapterImageBuilder.build(), 'Id is required')
  })

  test('should throw an error if the image url is not set', async ({ assert }) => {
    const chapterImageBuilder = ImageUrlBuilder.create().withId(1)
    assert.throws(() => chapterImageBuilder.build(), 'Image URL is required')
  })

  test('should throw an error if the image url is empty', async ({ assert }) => {
    const chapterImageBuilder = ImageUrlBuilder.create().withId(1).withImageUrl('')

    assert.throws(() => chapterImageBuilder.build(), 'Image URL is required')
  })
})
