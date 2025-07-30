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

export type CreationStackParamList = {
  HeroSelection: undefined;
  ThemeSelection: {
    selectedHero: Hero;
    heroName: string;
  };
  StoryGeneration: {
    selectedHero: Hero;
    heroName: string;
    selectedTheme: Theme;
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