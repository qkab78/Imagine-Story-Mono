/**
 * Formate une date en format long (ex: "14 février 2026")
 * @param date - Date à formater (objet Date ou string ISO)
 * @returns Chaîne formatée en français ou 'N/A' si invalide
 */
export const formatLongDate = (date: Date | string | undefined): string => {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'N/A';

    return dateObj.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
};

/**
 * Formate une date en format relatif (ex: "Hier", "Il y a 2j")
 * @param date - Date à formater (objet Date ou string ISO)
 * @returns Chaîne formatée en français
 */
export const formatRelativeDate = (date: Date | string | undefined): string => {
  // Gérer le cas où la date est undefined ou invalide
  if (!date) {
    return 'Récemment';
  }

  const now = new Date();
  const storyDate = typeof date === 'string' ? new Date(date) : date;

  // Vérifier que la date est valide
  if (isNaN(storyDate.getTime())) {
    return 'Récemment';
  }

  const diffInMs = now.getTime() - storyDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInDays === 0) {
    return "Aujourd'hui";
  } else if (diffInDays === 1) {
    return 'Hier';
  } else if (diffInDays < 7) {
    return `Il y a ${diffInDays}j`;
  } else if (diffInWeeks === 1) {
    return 'Il y a 1s';
  } else if (diffInWeeks < 4) {
    return `Il y a ${diffInWeeks}s`;
  } else {
    // Format: "12 janv."
    return storyDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  }
};
