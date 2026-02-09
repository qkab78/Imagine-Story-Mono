export interface Hero {
  id: string;
  species?: 'girl' | 'boy' | 'robot' | 'superhero' | 'superheroine' | 'animal';
  emoji: string;
  name: string;
  skinTone?: string;
}

export interface Theme {
  id: string;
  emoji: string;
  name: string;
  description: string;
  color: string;
}

export interface Language {
  id: string;
  name: string;
  code: string;
  icon: string;
}

export interface Tone {
  id: string;
  emoji: string;
  title: string;
  description: string;
  mood: 'happy' | 'calm' | 'mysterious' | 'adventurous';
}

export type CreationStackParamList = {
  HeroSelection: undefined;
  ThemeSelection: {
    selectedHero: Hero;
    heroName: string;
  };
  ToneSelection: {
    selectedHero: Hero;
    heroName: string;
    selectedTheme: Theme;
  };
  StoryGeneration: {
    selectedHero: Hero;
    heroName: string;
    selectedTheme: Theme;
    selectedTone: Tone;
  };
};

export const HEROES: Hero[] = [
  { id: '1', emoji: '👧', name: 'Fille' },
  { id: '2', emoji: '👦', name: 'Garçon' },
  { id: '3', emoji: '🦄', name: 'Licorne' },
  { id: '4', emoji: '🐱', name: 'Chat' },
  { id: '5', emoji: '🐶', name: 'Chien' },
  { id: '6', emoji: '🐸', name: 'Grenouille' },
];

export const THEMES: Theme[] = [
  { id: '1', emoji: '🏰', name: 'Royaume magique', description: 'Châteaux, princes et princesses', color: '#FF6B9D' },
  { id: '2', emoji: '🌊', name: 'Aventure marine', description: 'Pirates et trésors cachés', color: '#2196F3' },
  { id: '3', emoji: '🌲', name: 'Forêt enchantée', description: 'Animaux parlants et magie', color: '#4CAF50' },
  { id: '4', emoji: '🚀', name: 'Espace', description: 'Planètes et extraterrestres', color: '#9C27B0' },
  { id: '5', emoji: '🦕', name: 'Dinosaures', description: 'Époque préhistorique', color: '#FF9800' },
  { id: '6', emoji: '🏫', name: 'École', description: 'Amis et apprentissages', color: '#FFB74D' },
];

export const TONES: Tone[] = [
  { 
    id: '1', 
    emoji: '😊', 
    title: 'Joyeuse et drôle', 
    description: 'Pleine de rires et de moments amusants',
    mood: 'happy'
  },
  { 
    id: '2', 
    emoji: '🌙', 
    title: 'Douce et apaisante', 
    description: 'Parfaite pour se détendre avant de dormir',
    mood: 'calm'
  },
  { 
    id: '3', 
    emoji: '🔍', 
    title: 'Mystérieuse', 
    description: 'Avec des énigmes à résoudre',
    mood: 'mysterious'
  },
  { 
    id: '4', 
    emoji: '⚡', 
    title: 'Aventureuse', 
    description: 'Remplie d\'action et de découvertes',
    mood: 'adventurous'
  },
];

// Types pour React Hook Form
export interface StoryCreationFormData {
  hero?: Hero;
  heroName?: string;
  language?: Language;
  age?: number;
  numberOfChapters?: number;
  theme?: Theme;
  tone?: Tone;
  illustrationStyle?: IllustrationStyle;
}

// Types pour l'API
export interface StoryCreationRequest {
  hero: Hero;
  heroName: string;
  language: Language;
  age: number;
  numberOfChapters: number;
  theme: Theme;
  tone: Tone;
}

export interface GeneratedStory {
  id: string;
  title: string;
  content: string;
  coverUrl?: string;
  audioUrl?: string;
  createdAt: string;
}

export interface StoryCreationResponse {
  success: boolean;
  story?: GeneratedStory;
  error?: string;
}

// Options pour les selects
export const AGE_OPTIONS = [
  { label: '3 ans 👶', value: 3 },
  { label: '4 ans 🧒', value: 4 },
  { label: '5 ans 👦', value: 5 },
  { label: '6 ans 👧', value: 6 },
  { label: '7 ans 🧑', value: 7 },
  { label: '8 ans 👨', value: 8 },
];

export const CHAPTERS_OPTIONS = [
  { label: '1 chapitre 📖', value: 1 },
  { label: '2 chapitres 📚', value: 2 },
  { label: '3 chapitres 📗', value: 3 },
  { label: '4 chapitres 📘', value: 4 },
  { label: '5 chapitres 📙', value: 5 },
];

// Illustration Style Types
export type IllustrationStyle =
  | 'japanese-soft'    // Style japonais doux (défaut)
  | 'disney-pixar'     // Style Pixar/Disney
  | 'watercolor'       // Aquarelle
  | 'classic-book';    // Livre classique

export interface IllustrationStyleOption {
  id: IllustrationStyle;
  name: string;
  description: string;
  emoji: string;          // Emoji fallback when image not available
  gradientColors: string[]; // Gradient colors for the preview
}

export const ILLUSTRATION_STYLES: IllustrationStyleOption[] = [
  {
    id: 'japanese-soft',
    name: 'Doux & Magique',
    description: 'Style japonais doux, couleurs pastel, personnages chibi',
    emoji: '🌸',
    gradientColors: ['#FFE5EC', '#FFC4D6', '#FFAEC9'],
  },
  {
    id: 'disney-pixar',
    name: 'Disney / Pixar',
    description: 'Style moderne 3D, couleurs vibrantes, personnages expressifs',
    emoji: '✨',
    gradientColors: ['#4FC3F7', '#29B6F6', '#03A9F4'],
  },
  {
    id: 'watercolor',
    name: 'Aquarelle',
    description: 'Style peinture délicate, couleurs douces, atmosphère poétique',
    emoji: '🎨',
    gradientColors: ['#E1BEE7', '#CE93D8', '#BA68C8'],
  },
  {
    id: 'classic-book',
    name: 'Classique',
    description: 'Style livre traditionnel, couleurs riches, détails soignés',
    emoji: '📚',
    gradientColors: ['#FFE0B2', '#FFCC80', '#FFB74D'],
  },
];