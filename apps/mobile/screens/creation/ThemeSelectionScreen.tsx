import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { Theme, THEMES, CreationStackParamList } from '@/types/creation';
import AgeBadge from '@/components/Onboarding/AgeBadge';
import NavHeader from '@/components/creation/NavHeader';
import StepIndicator from '@/components/creation/StepIndicator';
import ThemeSelectionGrid from '@/components/creation/ThemeSelectionGrid';

interface ThemeSelectionScreenProps {
  navigation: NavigationProp<CreationStackParamList, 'ThemeSelection'>;
  route: RouteProp<CreationStackParamList, 'ThemeSelection'>;
}

const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { selectedHero, heroName } = route.params;
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(THEMES[0]);

  const handleCreateStory = () => {
    if (selectedTheme) {
      navigation.navigate('ToneSelection', {
        selectedHero,
        heroName,
        selectedTheme,
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient 
      colors={[colors.backgroundGreen, colors.backgroundGreenEnd]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <AgeBadge />
        
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
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
});

export default ThemeSelectionScreen;