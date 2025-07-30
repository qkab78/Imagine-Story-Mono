import React, { useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { Hero, Theme, Tone, TONES } from '@/types/creation';
import NavHeader from '@/components/creation/NavHeader';
import StepIndicator from '@/components/creation/StepIndicator';
import ToneSelectionCard from '@/components/creation/ToneSelectionCard';
import { ScrollView } from 'tamagui';

const ToneSelectionScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const selectedHero: Hero = JSON.parse(params.selectedHero as string);
  const heroName = params.heroName as string;
  const selectedTheme: Theme = JSON.parse(params.selectedTheme as string);

  const [selectedTone, setSelectedTone] = useState<Tone | null>(TONES[0]);

  const handleCreateStory = useCallback(() => {
    if (!selectedTone) return;
    
    router.push({
      pathname: '/(tabs)/stories/creation/story-generation',
      params: {
        selectedHero: JSON.stringify(selectedHero),
        heroName,
        selectedTheme: JSON.stringify(selectedTheme),
        selectedTone: JSON.stringify(selectedTone),
      }
    });
  }, [selectedHero, heroName, selectedTheme, selectedTone]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleToneSelect = useCallback((tone: Tone) => {
    setSelectedTone(tone);
  }, []);

  return (
    <ScrollView>
      <LinearGradient 
        colors={[colors.backgroundTone, colors.backgroundToneEnd]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <NavHeader
            onBack={handleBack}
            title="Nouvelle Histoire ✨"
          />
          
          <StepIndicator
            currentStep={3}
            totalSteps={3}
            title="Étape 3 sur 3 • Choisis l'ambiance 🎭"
          />
          
          <ToneSelectionCard
            tones={TONES}
            selectedTone={selectedTone}
            onToneSelect={handleToneSelect}
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

export default ToneSelectionScreen;