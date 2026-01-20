import { Language } from '../entities/language.entity.js'

export class LanguageBuilder {
  private id: string | undefined
  private name: string | undefined
  private code: string | undefined
  private isFree: boolean = false

  static create(): LanguageBuilder {
    return new LanguageBuilder()
  }

  withId(id: string): LanguageBuilder {
    this.id = id
    return this
  }

  withName(name: string): LanguageBuilder {
    this.name = name
    return this
  }

  withCode(code: string): LanguageBuilder {
    this.code = code
    return this
  }

  withIsFree(isFree: boolean): LanguageBuilder {
    this.isFree = isFree
    return this
  }

  public build(): Language {
    if (!this.id) {
      throw new Error('Id is required')
    }
    if (!this.name) {
      throw new Error('Name is required')
    }
    if (!this.code) {
      throw new Error('Code is required')
    }
    return new Language(this.id, this.name, this.code, this.isFree)
  }
}
