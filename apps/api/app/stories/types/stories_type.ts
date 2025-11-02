export interface StoryGenerated {
  title: string
  synopsis: string
  theme: string
  protagonist: string
  childAge: number
  numberOfChapters: number
  language: string
  tone: string
  species: string
  chapters: StoryChapter[]
  conclusion: string
  slug: string
}
export interface StoryContentPayload {
  title?: string
  synopsis?: string
  theme?: string
  protagonist?: string
  childAge?: number
  numberOfChapters?: number
  language?: string
  tone?: string
  species?: string
  slug?: string
}

export interface StoryChapter {
  title: string
  content: string
}
