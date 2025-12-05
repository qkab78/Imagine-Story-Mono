import { test } from "@japa/runner"
import { LanguageBuilder } from "./language.builder.js"

test.group(LanguageBuilder.name, () => {
    test('should create a language builder', async ({ assert }) => {
        const languageBuilder = LanguageBuilder.create()
        assert.isDefined(languageBuilder)
    })
    test('should build a language', async ({ assert }) => {
        const languageBuilder = LanguageBuilder.create()
        const language = languageBuilder
            .withId('1')
            .withName('The name of the language')
            .withCode('The code of the language')
            .withIsFree(true)
            .build()
        assert.isDefined(language)
        assert.equal(language.id, '1')
        assert.equal(language.name, 'The name of the language')
        assert.equal(language.code, 'The code of the language')
        assert.equal(language.isFree, true)
    })
    test('should throw an error if id is not provided', async ({ assert }) => {
        const languageBuilder = LanguageBuilder.create()
        assert.throws(() => languageBuilder.build(), 'Id is required')
    })
    test('should throw an error if name is not provided', async ({ assert }) => {
        const languageBuilder = LanguageBuilder.create().withId('1')
        assert.throws(() => languageBuilder.build(), 'Name is required')
    })
    test('should throw an error if code is not provided', async ({ assert }) => {
        const languageBuilder = LanguageBuilder.create().withId('1').withName('The name of the language')
        assert.throws(() => languageBuilder.build(), 'Code is required')
    })
    test('should build a paid language', async ({ assert }) => {
        const languageBuilder = LanguageBuilder.create()
        const language = languageBuilder
            .withId('1')
            .withName('The name of the language')
            .withCode('The code of the language')
            .build()
        assert.isDefined(language)
        assert.equal(language.id, '1')
        assert.equal(language.name, 'The name of the language')
        assert.equal(language.code, 'The code of the language')
        assert.equal(language.isFree, false)
    })
})