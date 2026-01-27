export type IllustrationType = 'books' | 'wand' | 'shield';

export type KidSlideKey = 'welcome' | 'create' | 'security';

export type KidSlide = {
  id: number;
  illustrationType: IllustrationType;
  slideKey: KidSlideKey;
  isLast?: boolean;
}

export const kidSlides: KidSlide[] = [
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
    isLast: true,
  },
];
