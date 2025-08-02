export interface Hero {
  id: string;
  emoji: string;
  name: string;
}

export interface Theme {
  id: string;
  emoji: string;
  name: string;
  description: string;
  color: string;
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
  hero: Hero;
  heroName: string;
  language: string;
  age: number;
  numberOfChapters: number;
  theme: Theme;
  tone: Tone;
}

// Types pour l'API
export interface StoryCreationRequest {
  hero: Hero;
  heroName: string;
  language: string;
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