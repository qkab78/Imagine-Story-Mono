import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { Hero, Theme, THEMES } from '@/types/creation';
import NavHeader from '@/components/creation/NavHeader';
import StepIndicator from '@/components/creation/StepIndicator';
import ThemeSelectionGrid from '@/components/creation/ThemeSelectionGrid';
import { ScrollView } from 'tamagui';

const ThemeSelectionScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const selectedHero: Hero = JSON.parse(params.selectedHero as string);
  const heroName = params.heroName as string;

  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(THEMES[0]);

  const handleCreateStory = () => {
    if (selectedTheme) {
      router.push({
        pathname: '/(tabs)/stories/creation/story-generation',
        params: {
          selectedHero: JSON.stringify(selectedHero),
          heroName,
          selectedTheme: JSON.stringify(selectedTheme),
        }
      });
    }
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
            onThemeSelect={setSelectedTheme}
            onCreateStory={handleCreateStory}
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