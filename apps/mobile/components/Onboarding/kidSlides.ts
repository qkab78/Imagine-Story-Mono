import { Platform } from 'react-native';

export type IllustrationType = 'books' | 'wand' | 'shield' | 'widget';

export type KidSlideKey = 'welcome' | 'create' | 'security' | 'widget';

export type KidSlide = {
  id: number;
  illustrationType: IllustrationType;
  slideKey: KidSlideKey;
  isLast?: boolean;
}

const allSlides: KidSlide[] = [
  {
    id: 1,
    illustrationType: 'books',
    slideKey: 'welcome',
  },
  {
    id: 2,
    illustrationType: 'wand',
    slideKey: 'create',
  },
  {
    id: 3,
    illustrationType: 'shield',
    slideKey: 'security',
  },
  {
    id: 4,
    illustrationType: 'widget',
    slideKey: 'widget',
  },
];

// On Android, exclude the widget slide (iOS widgets only).
// Re-index ids and compute isLast dynamically.
const platformSlides = Platform.OS === 'ios'
  ? allSlides
  : allSlides.filter(s => s.slideKey !== 'widget');

export const kidSlides: KidSlide[] = platformSlides.map((slide, index, arr) => ({
  ...slide,
  id: index + 1,
  isLast: index === arr.length - 1 ? true : undefined,
}));
