import React, { useMemo } from 'react';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { colors } from '@/theme/colors';
import { HEROES, StoryCreationFormData } from '@/types/creation';
import { Hero } from '@/domain/stories/value-objects/Hero';
import { HeroSelectionGrid } from '@/components/organisms/creation/HeroSelectionGrid';
import { StoryCreationLayout } from '@/components/templates/stories/StoryCreationLayout';
import { ScrollView } from 'tamagui';
import { ALLOWED_LANGUAGES } from '@imagine-story/api/app/stories/constants/allowed_languages';
import { getLanguages } from '@/api/stories/storyApi';
import { ThemeLanguageToneMapper } from '@/features/stories/mappers/ThemeLanguageToneMapper';
import useStoryStore from '@/store/stories/storyStore';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import Text from '@/components/ui/Text';

const HeroSelectionScreen: React.FC = () => {
  const { setCreateStoryPayload, createStoryPayload } = useStoryStore();

  // Fetch languages from API to get UUIDs
  const { data: languageDTOs = [], isLoading: isLoadingLanguages } = useQuery({
    queryKey: ['languages'],
    queryFn: getLanguages,
  });

  // Map DTOs to domain entities
  const languages = useMemo(
    () => languageDTOs.map(dto => ThemeLanguageToneMapper.languageDTOToDomain(dto)),
    [languageDTOs]
  );

  // Create a mapping from language codes (FR, EN, etc.) to UUIDs
  const languageCodeToUUID = useMemo(() => {
    const mapping: Record<string, string> = {};
    languages.forEach(lang => {
      // Convert code to uppercase to match ALLOWED_LANGUAGES constants
      mapping[lang.code.toUpperCase()] = lang.getIdValue();
    });
    return mapping;
  }, [languages]);

  // Find default language UUID (French)
  const defaultLanguageUUID = languageCodeToUUID[ALLOWED_LANGUAGES.FR] || languages[0]?.getIdValue();

  // Convert hardcoded HEROES to domain Hero value objects
  const heroes = HEROES.map(h => Hero.create(h.id, h.emoji, h.name));

  const { control, handleSubmit, watch, setValue } = useForm<StoryCreationFormData>({
    defaultValues: {
      hero: createStoryPayload?.hero || HEROES[0],
      heroName: createStoryPayload?.heroName || '',
      language: createStoryPayload?.language || defaultLanguageUUID,
      age: createStoryPayload?.age || 5,
      numberOfChapters: createStoryPayload?.numberOfChapters || 3,
      theme: createStoryPayload?.theme || undefined,
      tone: createStoryPayload?.tone || undefined,
    }
  });

  const selectedHero = watch('hero');

  const onSubmit = (data: StoryCreationFormData) => {
    setCreateStoryPayload(data);
    router.push({
      pathname: '/(tabs)/stories/creation/theme-selection',
      params: {
        formData: JSON.stringify(data),
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  // Find the matching domain Hero for the selected hero
  const selectedDomainHero = selectedHero
    ? heroes.find(h => h.getValue() === selectedHero.id) || null
    : null;

  if (isLoadingLanguages) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StoryCreationLayout
          currentStep={1}
          totalSteps={3}
          stepTitle="Étape 1 sur 3 • Choisis ton héros 🧙‍♀️"
          onBack={handleBack}
          gradientColors={[colors.backgroundOrange, colors.backgroundPink]}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accentBlue} />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        </StoryCreationLayout>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StoryCreationLayout
        currentStep={1}
        totalSteps={3}
        stepTitle="Étape 1 sur 3 • Choisis ton héros 🧙‍♀️"
        onBack={handleBack}
        gradientColors={[colors.backgroundOrange, colors.backgroundPink]}
      >
        <HeroSelectionGrid
          heroes={heroes}
          selectedHero={selectedDomainHero}
          onHeroSelect={(hero: Hero) => {
            // Convert domain Hero back to old format for form
            const oldHero = HEROES.find(h => h.id === hero.getValue());
            if (oldHero) {
              setValue('hero', oldHero);
            }
          }}
          control={control}
          onContinue={handleSubmit(onSubmit)}
          languages={languages}
        />
      </StoryCreationLayout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default HeroSelectionScreen;
