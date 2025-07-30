import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { Hero, HEROES, CreationStackParamList } from '@/types/creation';
import AgeBadge from '@/components/Onboarding/AgeBadge';
import NavHeader from '@/components/creation/NavHeader';
import StepIndicator from '@/components/creation/StepIndicator';
import HeroSelectionCard from '@/components/creation/HeroSelectionCard';

interface HeroSelectionScreenProps {
  navigation: NavigationProp<CreationStackParamList, 'HeroSelection'>;
  route: RouteProp<CreationStackParamList, 'HeroSelection'>;
}

const HeroSelectionScreen: React.FC<HeroSelectionScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const [selectedHero, setSelectedHero] = useState<Hero | null>(HEROES[0]);
  const [heroName, setHeroName] = useState<string>('Emma');

  const handleContinue = () => {
    if (selectedHero) {
      navigation.navigate('ThemeSelection', {
        selectedHero,
        heroName: heroName.trim() || selectedHero.name || 'Héros',
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient 
      colors={[colors.backgroundOrange, colors.backgroundPink]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <AgeBadge />
        
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
  },
});

export default HeroSelectionScreen;