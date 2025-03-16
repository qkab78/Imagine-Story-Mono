export function splitChapters(text: string): { chapters: { title: string; content: string }[], conclusion: string } {
  const chapterRegex = /(Chapter \d+\s*:\s*[^\n]+|Chapitre \d+\s*:\s*[^\n]+)/g;
  const conclusionRegex = /Conclusion:\s*([\s\S]+)/;
  
  let matches = [...text.matchAll(chapterRegex)];
  const chapters = [];
  let conclusion = "";
  
  for (let i = 0; i < matches.length; i++) {
      const startIndex = matches[i].index!;
      const endIndex = i + 1 < matches.length ? matches[i + 1].index! : text.length;
      const title = matches[i][0];
      let content = text.slice(startIndex + title.length, endIndex).trim();
      
      if (content.match(conclusionRegex)) {
          const conclusionMatch = content.match(conclusionRegex);
          conclusion = conclusionMatch ? conclusionMatch[1].trim() : "";
          content = content.replace(conclusionRegex, "").trim();
      }
      
      chapters.push({ title, content });
  }
  
  return { chapters, conclusion };
}