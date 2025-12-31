import { test } from '@japa/runner'
import { MinIOStorageService } from './MinIOStorageService.js'

test.group('MinIOStorageService', (group) => {
  let storageService: MinIOStorageService
  let minioAvailable = false

  group.setup(async () => {
    // This test requires MinIO running locally
    // Skip if MinIO not available
    storageService = new MinIOStorageService()

    try {
      await storageService.ensureBucketExists()
      minioAvailable = true
    } catch (error) {
      console.log('MinIO not available, skipping integration tests')
    }
  })

  group.teardown(async () => {
    // Cleanup test files if MinIO is available
    if (minioAvailable) {
      try {
        const files = await storageService.list({ prefix: 'test/' })
        for (const file of files.objects) {
          await storageService.delete(file.path)
        }
      } catch (error) {
        console.error('Error during cleanup:', error)
      }
    }
  })

  test('should upload and retrieve file', async ({ assert }) => {
    if (!minioAvailable) return

    const testData = Buffer.from('Hello MinIO')
    const testPath = 'test/hello.txt'

    const result = await storageService.upload(testPath, testData, {
      contentType: 'text/plain',
    })

    assert.equal(result.path, testPath)
    assert.isTrue(result.url.includes(testPath))
    assert.exists(result.expiresAt)

    // Verify file exists
    const exists = await storageService.exists(testPath)
    assert.isTrue(exists)

    // Cleanup
    await storageService.delete(testPath)
  })

  test('should generate valid pre-signed URLs', async ({ assert }) => {
    if (!minioAvailable) return

    const testData = Buffer.from('Test content')
    const testPath = 'test/presigned.txt'

    await storageService.upload(testPath, testData)

    const url = await storageService.getUrl(testPath, 300) // 5 min expiry
    assert.isString(url)
    assert.isTrue(url.startsWith('http'))

    // Cleanup
    await storageService.delete(testPath)
  })

  test('should delete files', async ({ assert }) => {
    if (!minioAvailable) return

    const testData = Buffer.from('To be deleted')
    const testPath = 'test/delete-me.txt'

    await storageService.upload(testPath, testData)
    assert.isTrue(await storageService.exists(testPath))

    await storageService.delete(testPath)
    assert.isFalse(await storageService.exists(testPath))
  })

  test('should list files with prefix', async ({ assert }) => {
    if (!minioAvailable) return

    const paths = ['test/list/file1.txt', 'test/list/file2.txt', 'test/other/file3.txt']

    // Upload test files
    for (const path of paths) {
      await storageService.upload(path, Buffer.from('test'))
    }

    const result = await storageService.list({ prefix: 'test/list/' })

    assert.equal(result.objects.length, 2)
    assert.isTrue(result.objects.some((obj) => obj.path === paths[0]))
    assert.isTrue(result.objects.some((obj) => obj.path === paths[1]))

    // Cleanup
    for (const path of paths) {
      await storageService.delete(path)
    }
  })

  test('should get file metadata', async ({ assert }) => {
    if (!minioAvailable) return

    const testData = Buffer.from('Metadata test')
    const testPath = 'test/metadata.txt'

    await storageService.upload(testPath, testData, {
      contentType: 'text/plain',
      metadata: { 'custom-key': 'custom-value' },
    })

    const metadata = await storageService.getMetadata(testPath)

    assert.exists(metadata)
    assert.equal(metadata!.contentType, 'text/plain')
    assert.equal(metadata!.size, testData.length)
    assert.exists(metadata!.uploadedAt)

    // Cleanup
    await storageService.delete(testPath)
  })

  test('should return null for non-existent file metadata', async ({ assert }) => {
    if (!minioAvailable) return

    const metadata = await storageService.getMetadata('test/non-existent.txt')
    assert.isNull(metadata)
  })

  test('should return false for non-existent file exists check', async ({ assert }) => {
    if (!minioAvailable) return

    const exists = await storageService.exists('test/non-existent.txt')
    assert.isFalse(exists)
  })
})
