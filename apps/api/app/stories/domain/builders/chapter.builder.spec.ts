import { test } from '@japa/runner'
import { ChapterBuilder } from './chapter.builder.js'
import { ChapterImage } from '../entities/chapter.entity.js'
import { ChapterId } from '../value-objects/ids/ChapterId.vo.js'
import { ImageUrl } from '../value-objects/media/ImageUrl.vo.js'

test.group(ChapterBuilder.name, () => {
    test('should create a chapter builder', async ({ assert }) => {
        const chapterBuilder = ChapterBuilder.create()
        assert.isDefined(chapterBuilder)
    })

    test('should build a chapter with image', async ({ assert }) => {
        const chapterImage = ChapterImage.create(ChapterId.create(1), ImageUrl.create('https://example.com/image.jpg'))
        const chapter = ChapterBuilder.create()
            .withId(1)
            .withTitle('Chapter 1')
            .withContent('This is the content of chapter 1')
            .withImage(chapterImage)
            .build()

        assert.isDefined(chapter)
        assert.equal(chapter.id, 1)
        assert.equal(chapter.title, 'Chapter 1')
        assert.equal(chapter.content, 'This is the content of chapter 1')
        assert.isDefined(chapter.image)
        assert.equal(chapter.image?.chapterId.getValue(), 1)
        assert.equal(chapter.image?.imageUrl, 'https://example.com/image.jpg')
    })

    test('should build a chapter without image', async ({ assert }) => {
        const chapter = ChapterBuilder.create()
            .withId(1)
            .withTitle('Chapter 1')
            .withContent('This is the content of chapter 1')
            .withImage(null)
            .build()

        assert.isDefined(chapter)
        assert.equal(chapter.id, 1)
        assert.equal(chapter.title, 'Chapter 1')
        assert.equal(chapter.content, 'This is the content of chapter 1')
        assert.isNull(chapter.image)
    })

    test('should throw an error if the id is not set', async ({ assert }) => {
        const chapterBuilder = ChapterBuilder.create()
        assert.throws(() => chapterBuilder.build(), 'Id is required')
    })

    test('should throw an error if the title is not set', async ({ assert }) => {
        const chapterBuilder = ChapterBuilder.create().withId(1)
        assert.throws(() => chapterBuilder.build(), 'Title is required')
    })

    test('should throw an error if the content is not set', async ({ assert }) => {
        const chapterBuilder = ChapterBuilder.create()
            .withId(1)
            .withTitle('Chapter 1')
        assert.throws(() => chapterBuilder.build(), 'Content is required')
    })

    test('should reject id of 0 (chapters start at 1)', async ({ assert }) => {
        assert.throws(
            () => ChapterBuilder.create().withId(0),
            'Invalid Chapter ID: 0. Must be a positive integer (>= 1).'
        )
    })
})
