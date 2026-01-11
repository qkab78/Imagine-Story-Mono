import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Hero } from '@/domain/stories/value-objects/Hero';
import { HeroCard } from '@/components/molecules/creation/HeroCard';
import { FormField } from '@/components/molecules/creation/FormField';
import { SelectField } from '@/components/molecules/creation/SelectField';
import { Control, useController } from 'react-hook-form';
import { User, Globe } from 'lucide-react-native';
import KidButton from '@/components/Onboarding/KidButton';
import Box from '@/components/ui/Box';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { StoryCreationRules } from '@/domain/stories/rules/story-creation.rules';
import { AGE_OPTIONS, CHAPTERS_OPTIONS } from '@/types/creation';
import { ALLOWED_LANGUAGES } from '@imagine-story/api/app/stories/constants/allowed_languages';
import type { StoryCreationFormData } from '@/types/creation';

interface HeroSelectionGridProps {
  heroes: Hero[];
  selectedHero: Hero | null;
  onHeroSelect: (hero: Hero) => void;
  control: Control<StoryCreationFormData>;
  onContinue: () => void;
}

const languages = [
  { label: '🇫🇷 Français', value: ALLOWED_LANGUAGES.FR },
  { label: '🇬🇧 Anglais', value: ALLOWED_LANGUAGES.EN },
  { label: '🇪🇸 Espagnol', value: ALLOWED_LANGUAGES.ES },
  { label: '🇩🇪 Allemand', value: ALLOWED_LANGUAGES.DE },
  { label: '🇮🇹 Italien', value: ALLOWED_LANGUAGES.IT },
  { label: '🇵🇹 Portugais', value: ALLOWED_LANGUAGES.PT },
  { label: '🇨🇩 Lingala', value: ALLOWED_LANGUAGES.LI },
  { label: '🇳🇱 Néerlandais', value: ALLOWED_LANGUAGES.NL },
  { label: '🇵🇱 Polonais', value: ALLOWED_LANGUAGES.PL },
  { label: '🇷🇺 Russe', value: ALLOWED_LANGUAGES.RU },
  { label: '🇹🇷 Turc', value: ALLOWED_LANGUAGES.TR },
  { label: '🇦🇪 Arabe', value: ALLOWED_LANGUAGES.AR },
  { label: '🇯🇵 Japonais', value: ALLOWED_LANGUAGES.JA },
];

export const HeroSelectionGrid: React.FC<HeroSelectionGridProps> = ({
  heroes,
  selectedHero,
  onHeroSelect,
  control,
  onContinue,
}) => {
  const { field: heroNameField, fieldState: heroNameFieldState } = useController({
    name: 'heroName',
    control,
    rules: {
      required: "Le nom de ton héros est requis",
      validate: (value) => {
        try {
          StoryCreationRules.validateHeroName(value);
          return true;
        } catch (error) {
          return error instanceof Error ? error.message : 'Nom invalide';
        }
      },
    },
  });

  const { field: ageField } = useController({
    name: 'age',
    control,
    defaultValue: 5,
  });

  const { field: chaptersField } = useController({
    name: 'numberOfChapters',
    control,
    defaultValue: 3,
  });

  const { field: languageField } = useController({
    name: 'language',
    control,
  });

  return (
    <Box style={styles.container}>
      <View style={styles.heroGrid}>
        {heroes.map((hero) => (
          <HeroCard
            key={hero.getValue()}
            hero={hero}
            isSelected={selectedHero?.getValue() === hero.getValue()}
            onPress={onHeroSelect}
          />
        ))}
      </View>

      <FormField
        name="heroName"
        label="Nom de ton héros"
        placeholder={`${selectedHero?.emoji || '✨'} Comment s'appelle ton héros ?`}
        control={control}
        Icon={User}
        error={heroNameFieldState.error}
        maxLength={StoryCreationRules.MAX_HERO_NAME_LENGTH}
      />

      <SelectField
        name="language"
        label="Langue de l'histoire"
        placeholder="Choisir une langue 🌍"
        options={languages}
        control={control}
        error={languageField.error}
      />

      <SelectField
        name="age"
        label="Âge de l'enfant"
        placeholder="Choisir un âge 👶"
        options={AGE_OPTIONS}
        control={control}
      />

      <SelectField
        name="numberOfChapters"
        label="Nombre de chapitres"
        placeholder="Choisir le nombre de chapitres 📚"
        options={CHAPTERS_OPTIONS}
        control={control}
      />

      <View style={styles.buttonContainer}>
        <KidButton
          title="Continuer l'aventure !"
          emoji="🚀"
          onPress={onContinue}
        />
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    flex: 1,
  },
  heroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
});

export default HeroSelectionGrid;
