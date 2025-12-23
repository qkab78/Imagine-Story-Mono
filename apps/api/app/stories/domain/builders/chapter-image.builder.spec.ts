import { test } from '@japa/runner'
import { ChapterImageBuilder } from './chapter-image.builder.js'

test.group(ChapterImageBuilder.name, () => {
    test('should create a chapter image builder', async ({ assert }) => {
        const chapterImageBuilder = ChapterImageBuilder.create()
        assert.isDefined(chapterImageBuilder)
    })

    test('should build a chapter image', async ({ assert }) => {
        const chapterImage = ChapterImageBuilder.create()
            .withId(1)
            .withImageUrl('https://example.com/image.jpg')
            .build()

        assert.isDefined(chapterImage)
        assert.equal(chapterImage.id, 1)
        assert.equal(chapterImage.imageUrl, 'https://example.com/image.jpg')
    })

    test('should throw an error if the id is not set', async ({ assert }) => {
        const chapterImageBuilder = ChapterImageBuilder.create()
        assert.throws(() => chapterImageBuilder.build(), 'Id is required')
    })

    test('should throw an error if the image url is not set', async ({ assert }) => {
        const chapterImageBuilder = ChapterImageBuilder.create().withId(1)
        assert.throws(() => chapterImageBuilder.build(), 'Image URL is required')
    })

    test('should accept id of 0', async ({ assert }) => {
        const chapterImage = ChapterImageBuilder.create()
            .withId(0)
            .withImageUrl('https://example.com/image.jpg')
            .build()

        assert.isDefined(chapterImage)
        assert.equal(chapterImage.id, 0)
    })

    test('should accept empty string as image url', async ({ assert }) => {
        const chapterImageBuilder = ChapterImageBuilder.create()
            .withId(1)
            .withImageUrl('')

        assert.throws(() => chapterImageBuilder.build(), 'Image URL is required')
    })
})
