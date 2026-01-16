export type IllustrationType = 'books' | 'wand' | 'shield';

export type KidSlide = {
  id: number;
  illustrationType: IllustrationType;
  title: string;
  description: string;
  buttonLabel: string;
  isLast?: boolean;
}

export const kidSlides: KidSlide[] = [
  {
    id: 1,
    illustrationType: 'books',
    title: 'Mon Petit Conteur',
    description: 'Des histoires magiques personnalisées qui émerveilleront votre enfant',
    buttonLabel: 'Commencer',
  },
  {
    id: 2,
    illustrationType: 'wand',
    title: 'Créez en 3 étapes',
    description: 'Choisissez un héros, partagez un rêve, et découvrez une histoire unique en quelques instants',
    buttonLabel: 'Suivant',
  },
  {
    id: 3,
    illustrationType: 'shield',
    title: '100% sécurisé',
    description: 'Contenu adapté à l\'âge, contrôle parental complet et mode hors-ligne pour une tranquillité d\'esprit totale',
    buttonLabel: 'C\'est parti !',
    isLast: true,
  },
];