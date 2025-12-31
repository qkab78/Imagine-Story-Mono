import { test } from "@japa/runner"
import { ToneBuilder } from "./tone.builder.js"

test.group(ToneBuilder.name, () => {
    test('should create a tone builder', async ({ assert }) => {
        const toneBuilder = ToneBuilder.create()
        assert.isDefined(toneBuilder)
    })
    test('should build a tone', async ({ assert }) => {
        const toneBuilder = ToneBuilder.create()
        const tone = toneBuilder
            .withId('1')
            .withName('The name of the tone')
            .withDescription('The description of the tone')
            .build()
        assert.isDefined(tone)
        assert.equal(tone.id, '1')
        assert.equal(tone.name, 'The name of the tone')
        assert.equal(tone.description, 'The description of the tone')
    })
    test('should throw an error if id is not provided', async ({ assert }) => {
        const toneBuilder = ToneBuilder.create()
        assert.throws(() => toneBuilder.build(), 'Id is required')
    })
    test('should throw an error if name is not provided', async ({ assert }) => {
        const toneBuilder = ToneBuilder.create().withId('1')
        assert.throws(() => toneBuilder.build(), 'Name is required')
    })
    test('should throw an error if description is not provided', async ({ assert }) => {
        const toneBuilder = ToneBuilder.create().withId('1').withName('The name of the tone')
        assert.throws(() => toneBuilder.build(), 'Description is required')
    })
})