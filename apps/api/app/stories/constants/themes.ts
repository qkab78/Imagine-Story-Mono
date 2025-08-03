export interface Theme {
  id: string;
  emoji: string;
  name: string;
  description: string;
  color: string;
}

export const ALLOWED_THEMES: Theme[] = [
  { id: '1', emoji: '🏰', name: 'Royaume magique', description: 'Châteaux, princes et princesses', color: '#FF6B9D' },
  { id: '2', emoji: '🌊', name: 'Aventure marine', description: 'Pirates et trésors cachés', color: '#2196F3' },
  { id: '3', emoji: '🌲', name: 'Forêt enchantée', description: 'Animaux parlants et magie', color: '#4CAF50' },
  { id: '4', emoji: '🚀', name: 'Espace', description: 'Planètes et extraterrestres', color: '#9C27B0' },
  { id: '5', emoji: '🦕', name: 'Dinosaures', description: 'Époque préhistorique', color: '#FF9800' },
  { id: '6', emoji: '🏫', name: 'École', description: 'Amis et apprentissages', color: '#FFB74D' },
];