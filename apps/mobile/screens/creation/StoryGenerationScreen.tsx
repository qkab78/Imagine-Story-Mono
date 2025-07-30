import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { CreationStackParamList } from '@/types/creation';
import AgeBadge from '@/components/Onboarding/AgeBadge';
import NavHeader from '@/components/creation/NavHeader';
import StepIndicator from '@/components/creation/StepIndicator';
import Text from '@/components/ui/Text';

interface StoryGenerationScreenProps {
  navigation: NavigationProp<CreationStackParamList, 'StoryGeneration'>;
  route: RouteProp<CreationStackParamList, 'StoryGeneration'>;
}

const StoryGenerationScreen: React.FC<StoryGenerationScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { selectedHero, heroName, selectedTheme } = route.params;

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
          currentStep={3} 
          totalSteps={3} 
          title="Étape 3 sur 3 • Création en cours... 📖" 
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>Création de l'histoire...</Text>
          <Text style={styles.subtitle}>
            {heroName} {selectedHero.emoji} va vivre une aventure {selectedTheme.name} {selectedTheme.emoji}
          </Text>
        </View>
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

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },

  title: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.base,
  },

  subtitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default StoryGenerationScreen;