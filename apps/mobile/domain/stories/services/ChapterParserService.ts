/**
 * Chapter Parser Service
 *
 * Provides utilities for parsing story content into chapters.
 */
export class ChapterParserService {
  /**
   * Split story text into chapters and conclusion
   * @param text Full story text
   * @returns Object with chapters array and conclusion string
   */
  public static splitChapters(text: string): {
    chapters: { title: string; content: string }[]
    conclusion: string
  } {
    const chapterRegex =
      /(?:\*\*)?(?:Chapitre|Chapter)\s+\d+\s*:\s*[""]?([^\n*"]+)[""]?(?:\*\*)?/gi

    const conclusionRegex =
      /(?:\*\*)?(?:Conclusion|Epilogue)(?:\*\*)?\s*:?([\s\S]*)$/i

    const chapters: { title: string; content: string }[] = []
    let conclusion = ''

    const matches = [...text.matchAll(chapterRegex)]

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i]
      const title = match[1].trim() // Titre sans "Chapitre X:"

      const startIndex = match.index! + match[0].length
      const endIndex =
        i + 1 < matches.length ? matches[i + 1].index! : text.length

      let content = text.slice(startIndex, endIndex).trim()

      // Si on est dans le dernier chapitre, retirer la conclusion si elle est dedans
      if (i === matches.length - 1) {
        const conclusionMatch = content.match(conclusionRegex)
        if (conclusionMatch) {
          conclusion = conclusionMatch[1].trim()
          content = content.replace(conclusionMatch[0], '').trim()
        }
      }

      chapters.push({ title, content })
    }

    // Cas où la conclusion est après les chapitres (hors dernier)
    if (!conclusion) {
      const conclusionMatch = text.match(conclusionRegex)
      if (conclusionMatch) {
        conclusion = conclusionMatch[1].trim()
      }
    }

    return { chapters, conclusion }
  }
}
