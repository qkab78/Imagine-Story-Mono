import React, { useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import NavHeader from '@/components/creation/NavHeader';
import StepIndicator from '@/components/creation/StepIndicator';
import ToneSelectionCard from '@/components/creation/ToneSelectionCard';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { CreationStackParamList, Tone, TONES } from '@/types/creation';

interface ToneSelectionScreenProps {
  navigation: NavigationProp<CreationStackParamList>;
  route: RouteProp<CreationStackParamList, 'ToneSelection'>;
}

const ToneSelectionScreen: React.FC<ToneSelectionScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { selectedHero, heroName, selectedTheme } = route.params;
  const [selectedTone, setSelectedTone] = useState<Tone | null>(TONES[0]);

  const handleCreateStory = useCallback(() => {
    if (!selectedTone) return;
    
    navigation.navigate('StoryGeneration', {
      selectedHero,
      heroName,
      selectedTheme,
      selectedTone,
    });
  }, [navigation, selectedHero, heroName, selectedTheme, selectedTone]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToneSelect = useCallback((tone: Tone) => {
    setSelectedTone(tone);
  }, []);

  return (
    <LinearGradient 
      colors={[colors.backgroundTone, colors.backgroundToneEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
});

export default ToneSelectionScreen;