// Types pour la bibliothèque

export type GenerationStatusType = 'pending' | 'generating' | 'completed' | 'failed';

export interface GenerationStatus {
  status: GenerationStatusType;
  progress?: number; // 0-100
  jobId?: string;
}

export interface LibraryStory {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  protagonist: string;
  species: string;
  childAge: number;
  coverImageUrl: string | null;
  publicationDate: Date;
  numberOfChapters: number;
  theme: {
    id: string;
    name: string;
    emoji?: string;
  };
  generationStatus: GenerationStatusType;
  generationProgress?: number;
  jobId?: string;
}

export type LibraryFilterType = 'all' | 'generating' | 'completed';

// Couleurs pour les placeholders de couverture selon le thème
export const THEME_GRADIENTS: Record<string, [string, string]> = {
  'Animaux et nature': ['#D4F1D4', '#A8DBA8'],
  'Mystère et enquête': ['#E0D4F1', '#B8A0D4'],
  'Courage et dépassement': ['#FFE5B4', '#FFDAB9'],
  'Aventure et exploration': ['#B8E0FF', '#87CEEB'],
  'Apprentissage et école': ['#FFE5D9', '#FFD4A3'],
  'Amitié et solidarité': ['#FFE5E5', '#FFC1CC'],
  'Famille et foyer': ['#FFECD2', '#FCB69F'],
  'Magie et fantastique': ['#A8D4C0', '#7FB8A0'],
  default: ['#FFE5E5', '#FFC1CC'],
};

// Icônes par thème (SF Symbol name, Lucide name)
export const THEME_ICONS: Record<string, { sfSymbol: string; lucide: string }> = {
  'Animaux et nature': { sfSymbol: 'pawprint.fill', lucide: 'PawPrint' },
  'Mystère et enquête': { sfSymbol: 'magnifyingglass', lucide: 'Search' },
  'Courage et dépassement': { sfSymbol: 'flame.fill', lucide: 'Flame' },
  'Aventure et exploration': { sfSymbol: 'map.fill', lucide: 'Map' },
  'Apprentissage et école': { sfSymbol: 'book.fill', lucide: 'BookOpen' },
  'Amitié et solidarité': { sfSymbol: 'heart.fill', lucide: 'Heart' },
  'Famille et foyer': { sfSymbol: 'house.fill', lucide: 'Home' },
  'Magie et fantastique': { sfSymbol: 'sparkles', lucide: 'Sparkles' },
  default: { sfSymbol: 'book.closed.fill', lucide: 'Book' },
};

// Emojis par thème (fallback pour les cas où les icônes ne sont pas disponibles)
export const THEME_EMOJIS: Record<string, string> = {
  'Animaux et nature': '🦁',
  'Mystère et enquête': '🔍',
  'Courage et dépassement': '💪',
  'Aventure et exploration': '🗺️',
  'Apprentissage et école': '🏫',
  'Amitié et solidarité': '🤝',
  'Famille et foyer': '🏠',
  'Magie et fantastique': '✨',
  default: '📚',
};

// Helper pour obtenir le gradient d'un thème
export const getThemeGradient = (themeName: string): [string, string] => {
  return THEME_GRADIENTS[themeName] || THEME_GRADIENTS.default;
};

// Helper pour obtenir les icônes d'un thème
export const getThemeIcons = (themeName: string): { sfSymbol: string; lucide: string } => {
  return THEME_ICONS[themeName] || THEME_ICONS.default;
};

// Helper pour obtenir l'emoji d'un thème
export const getThemeEmoji = (themeName: string): string => {
  return THEME_EMOJIS[themeName] || THEME_EMOJIS.default;
};
