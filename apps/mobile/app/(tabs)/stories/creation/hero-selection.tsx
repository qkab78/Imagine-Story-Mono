import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { Hero, HEROES } from '@/types/creation';
import NavHeader from '@/components/creation/NavHeader';
import StepIndicator from '@/components/creation/StepIndicator';
import HeroSelectionCard from '@/components/creation/HeroSelectionCard';

const { width } = Dimensions.get('window')
const WIDTH = width - spacing.lg * 2;

const HeroSelectionScreen: React.FC = () => {
  const [selectedHero, setSelectedHero] = useState<Hero | null>(HEROES[0]);
  const [heroName, setHeroName] = useState<string>('Emma');

  const handleContinue = () => {
    if (selectedHero) {
      router.push({
        pathname: '/(tabs)/stories/creation/theme-selection',
        params: {
          selectedHero: JSON.stringify(selectedHero),
          heroName: heroName.trim() || selectedHero.name || 'Héros',
        }
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={[colors.backgroundOrange, colors.backgroundPink]}
      style={styles.gradient}
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
          onHeroSelect={setSelectedHero}
          heroName={heroName}
          onNameChange={setHeroName}
          onContinue={handleContinue}
        />
      </SafeAreaView>
    </LinearGradient>
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