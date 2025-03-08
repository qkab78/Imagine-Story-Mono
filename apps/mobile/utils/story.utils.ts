export function splitChapters(content: string) {
  const chapitres = content.split(/Chapitre \d+ :/).filter(Boolean);
  return chapitres.map((contenu) => {
    const lignes = contenu.trim().split('\n');
    return {
      titre: lignes[0].trim(),
      contenu: lignes.slice(1).join('\n').trim()
    };
  });
}