import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Hero, Theme } from '@/types/creation';
import NavHeader from '@/components/creation/NavHeader';
import StepIndicator from '@/components/creation/StepIndicator';
import Text from '@/components/ui/Text';

const StoryGenerationScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const selectedHero: Hero = JSON.parse(params.selectedHero as string);
  const heroName = params.heroName as string;
  const selectedTheme: Theme = JSON.parse(params.selectedTheme as string);

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
    fontWeight: '700' as const,
    color: colors.textPrimary,
    textAlign: 'center' as const,
    marginBottom: spacing.base,
  },

  subtitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    textAlign: 'center' as const,
  },
});

export default StoryGenerationScreen;