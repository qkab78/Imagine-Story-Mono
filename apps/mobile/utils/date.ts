// Utilitaires pour la gestion des dates

/**
 * Formate une date en texte relatif (ex: "Il y a 2j", "Hier")
 */
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'Il y a quelques secondes';
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)}s`;
  return `Il y a ${Math.floor(diffDays / 30)} mois`;
};

/**
 * Vérifie si une date est récente (moins de 24h)
 */
export const isRecentDate = (date: Date, hoursThreshold = 24): boolean => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours < hoursThreshold;
};

/**
 * Calcule le nombre de jours restants avant une date d'expiration
 */
export const calculateDaysUntilExpiration = (expirationDate: string | null): number | null => {
  if (!expirationDate) return null;
  const expDate = new Date(expirationDate);
  const now = new Date();
  const diffTime = expDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};
