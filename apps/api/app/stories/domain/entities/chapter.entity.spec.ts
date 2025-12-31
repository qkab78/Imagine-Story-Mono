import { test } from '@japa/runner'
import { ChapterFactory } from '../factories/ChapterFactory.js'

test.group('Chapter Entity', () => {
  test('should create a valid Chapter without image', ({ assert }) => {
    const chapter = ChapterFactory.create({
      position: 1,
      title: 'Chapter 1',
      content: 'This is the content of chapter 1.',
    })

    assert.equal(chapter.getPosition(), 1)
    assert.equal(chapter.title, 'Chapter 1')
    assert.equal(chapter.content, 'This is the content of chapter 1.')
    assert.isFalse(chapter.hasImage())
    assert.isNull(chapter.image)
  })

  test('should create a valid Chapter with image', ({ assert }) => {
    const chapter = ChapterFactory.createWithImage({
      position: 1,
      title: 'Chapter 1',
      content: 'This is the content of chapter 1.',
      imageUrl: 'https://example.com/chapter1.jpg',
    })

    assert.equal(chapter.getPosition(), 1)
    assert.equal(chapter.title, 'Chapter 1')
    assert.isTrue(chapter.hasImage())
    assert.isDefined(chapter.image)
  })

  test('should throw error if title is empty', ({ assert }) => {
    assert.throws(() =>
      ChapterFactory.create({
        position: 1,
        title: '',
        content: 'Content',
      })
    )
  })

  test('should throw error if title is too long', ({ assert }) => {
    assert.throws(() =>
      ChapterFactory.create({
        position: 1,
        title: 'a'.repeat(101),
        content: 'Content',
      })
    )
  })

  test('should throw error if content is empty', ({ assert }) => {
    assert.throws(() =>
      ChapterFactory.create({
        position: 1,
        title: 'Chapter 1',
        content: '',
      })
    )
  })

  test('should throw error if content is too long', ({ assert }) => {
    assert.throws(() =>
      ChapterFactory.create({
        position: 1,
        title: 'Chapter 1',
        content: 'a'.repeat(5001),
      })
    )
  })

  test('should create multiple chapters', ({ assert }) => {
    const chapters = ChapterFactory.createMany([
      { position: 1, title: 'Chapter 1', content: 'Content 1' },
      { position: 2, title: 'Chapter 2', content: 'Content 2' },
      { position: 3, title: 'Chapter 3', content: 'Content 3', imageUrl: 'https://example.com/ch3.jpg' },
    ])

    assert.equal(chapters.length, 3)
    assert.equal(chapters[0].getPosition(), 1)
    assert.equal(chapters[1].getPosition(), 2)
    assert.equal(chapters[2].getPosition(), 3)
    assert.isFalse(chapters[0].hasImage())
    assert.isFalse(chapters[1].hasImage())
    assert.isTrue(chapters[2].hasImage())
  })
})
