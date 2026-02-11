import { ImageSourcePropType } from 'react-native';

export const SPECIES_IMAGES: Record<string, ImageSourcePropType> = {
  girl: require('@/assets/images/mascots/Species/girl.webp'),
  boy: require('@/assets/images/mascots/Species/boy.webp'),
  robot: require('@/assets/images/mascots/Species/robot.webp'),
  superhero: require('@/assets/images/mascots/Species/superhero.webp'),
  superheroine: require('@/assets/images/mascots/Species/superheroine.webp'),
  animal: require('@/assets/images/mascots/Species/animal.webp'),
};

export type SpeciesDesign = 'default' | 'cards' | 'circles' | 'showcase';

const VALID_DESIGNS: SpeciesDesign[] = ['default', 'cards', 'circles', 'showcase'];

export function getSpeciesDesign(): SpeciesDesign {
  const envValue = process.env.EXPO_PUBLIC_SPECIES_DESIGN;
  if (envValue && VALID_DESIGNS.includes(envValue as SpeciesDesign)) {
    return envValue as SpeciesDesign;
  }
  return 'default';
}
