import { test } from "@japa/runner"
import { ThemeBuilder } from "./theme.builder.js"


test.group(ThemeBuilder.name, () => {
    test('should create a theme builder', async ({ assert }) => {
        const themeBuilder = ThemeBuilder.create()
        assert.isDefined(themeBuilder)
    })
    test('should build a theme', async ({ assert }) => {
        const themeBuilder = ThemeBuilder.create()
        const theme = themeBuilder
            .withId('1')
            .withName('The name of the theme')
            .withDescription('The description of the theme')
            .build()
        assert.isDefined(theme)
        assert.equal(theme.id, '1')
        assert.equal(theme.name, 'The name of the theme')
        assert.equal(theme.description, 'The description of the theme')
    })
    test('should throw an error if id is not provided', async ({ assert }) => {
        const themeBuilder = ThemeBuilder.create()
        assert.throws(() => themeBuilder.build(), 'Id is required')
    })
    test('should throw an error if name is not provided', async ({ assert }) => {
        const themeBuilder = ThemeBuilder.create().withId('1')
        assert.throws(() => themeBuilder.build(), 'Name is required')
    })
    test('should throw an error if description is not provided', async ({ assert }) => {
        const themeBuilder = ThemeBuilder.create().withId('1').withName('The name of the theme')
        assert.throws(() => themeBuilder.build(), 'Description is required')
    })
})