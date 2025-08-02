import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { Theme, THEMES, StoryCreationFormData } from '@/types/creation';
import NavHeader from '@/components/creation/NavHeader';
import StepIndicator from '@/components/creation/StepIndicator';
import ThemeSelectionGrid from '@/components/creation/ThemeSelectionGrid';
import { ScrollView } from 'tamagui';

const ThemeSelectionScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const previousFormData: StoryCreationFormData = JSON.parse(params.formData as string);

  const { handleSubmit, watch, setValue } = useForm<StoryCreationFormData>({
    defaultValues: {
      ...previousFormData,
      theme: THEMES[0],
    }
  });

  const selectedTheme = watch('theme');

  const onSubmit = (data: StoryCreationFormData) => {
    router.push({
      pathname: '/(tabs)/stories/creation/tone-selection',
      params: {
        formData: JSON.stringify(data),
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView>
      <LinearGradient
        colors={[colors.backgroundGreen, colors.backgroundGreenEnd]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <NavHeader
            onBack={handleBack}
            title="Nouvelle Histoire ✨"
          />

          <StepIndicator
            currentStep={2}
            totalSteps={3}
            title="Étape 2 sur 3 • Choisis un thème 🎭"
          />

          <ThemeSelectionGrid
            themes={THEMES}
            selectedTheme={selectedTheme}
            onThemeSelect={(theme: Theme) => setValue('theme', theme)}
            onCreateStory={handleSubmit(onSubmit)}
          />
        </SafeAreaView>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  container: {
    flex: 1,
  },
});

export default ThemeSelectionScreen;