import React from 'react';
import { StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { Hero, HEROES, StoryCreationFormData } from '@/types/creation';
import NavHeader from '@/components/creation/NavHeader';
import StepIndicator from '@/components/creation/StepIndicator';
import HeroSelectionCard from '@/components/creation/HeroSelectionCard';
import { ScrollView } from 'tamagui';
import { ALLOWED_LANGUAGES } from '@imagine-story/api/app/stories/constants/allowed_languages';
import useStoryStore from '@/store/stories/storyStore';

const { width } = Dimensions.get('window')
const WIDTH = width - spacing.lg * 2;

const HeroSelectionScreen: React.FC = () => {
  const { setCreateStoryPayload, createStoryPayload } = useStoryStore();
  const { control, handleSubmit, watch, setValue } = useForm<StoryCreationFormData>({
    defaultValues: {
      hero: createStoryPayload?.hero || HEROES[0],
      heroName: createStoryPayload?.heroName || '',
      language: createStoryPayload?.language || ALLOWED_LANGUAGES.FR,
      age: createStoryPayload?.age || 5,
      numberOfChapters: createStoryPayload?.numberOfChapters || 3,
      theme: createStoryPayload?.theme || undefined,
      tone: createStoryPayload?.tone || undefined,
    }
  });

  const selectedHero = watch('hero');
  const heroName = watch('heroName');

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

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {/* @ts-ignore */}
      <LinearGradient
        colors={[colors.backgroundOrange, colors.backgroundPink]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <NavHeader
            onBack={handleBack}
            title="Nouvelle Histoire ✨"
          />

          <StepIndicator
            currentStep={1}
            totalSteps={3}
            title="Étape 1 sur 3 • Choisis ton héros 🧙‍♀️"
          />

          <HeroSelectionCard
            heroes={HEROES}
            selectedHero={selectedHero}
            onHeroSelect={(hero: Hero) => setValue('hero', hero)}
            heroName={heroName}
            onNameChange={(name: string) => setValue('heroName', name)}
            onLanguageChange={(language: string) => setValue('language', language)}
            onContinue={handleSubmit(onSubmit)}
            control={control}
          />
        </SafeAreaView>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    width: WIDTH,
    alignSelf: 'center',
  },
});

export default HeroSelectionScreen;