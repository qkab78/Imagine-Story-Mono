import { Theme } from '../entities/theme.entity.js'

export class ThemeBuilder {
  private id: string | undefined
  private name: string | undefined
  private description: string | undefined

  static create(): ThemeBuilder {
    return new ThemeBuilder()
  }

  withId(id: string): ThemeBuilder {
    this.id = id
    return this
  }

  withName(name: string): ThemeBuilder {
    this.name = name
    return this
  }

  withDescription(description: string): ThemeBuilder {
    this.description = description
    return this
  }

  public build(): Theme {
    if (!this.id) {
      throw new Error('Id is required')
    }
    if (!this.name) {
      throw new Error('Name is required')
    }
    if (!this.description) {
      throw new Error('Description is required')
    }

    return new Theme(this.id, this.name, this.description)
  }
}
