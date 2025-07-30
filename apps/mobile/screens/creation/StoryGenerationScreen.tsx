import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import LoadingLogo from '@/components/creation/LoadingLogo';
import GenerationStepsList, { GenerationStep } from '@/components/creation/GenerationStepsList';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import Text from '@/components/ui/Text';
import { CreationStackParamList } from '@/types/creation';

interface StoryGenerationScreenProps {
  navigation: NavigationProp<CreationStackParamList>;
  route: RouteProp<CreationStackParamList, 'StoryGeneration'>;
}

const GENERATION_STEPS: GenerationStep[] = [
  { id: '1', title: 'Création du personnage', icon: '✅', status: 'completed' },
  { id: '2', title: 'Construction de l\'univers', icon: '✅', status: 'completed' },
  { id: '3', title: 'Écriture de l\'histoire', icon: '⏳', status: 'active' },
  { id: '4', title: 'Génération des illustrations', icon: '⭕', status: 'pending' },
  { id: '5', title: 'Création de l\'audio', icon: '⭕', status: 'pending' },
];

const StoryGenerationScreen: React.FC<StoryGenerationScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { selectedHero, heroName, selectedTheme, selectedTone } = route.params;
  const [steps, setSteps] = useState<GenerationStep[]>(GENERATION_STEPS);

  const simulateStoryGeneration = useCallback(() => {
    // Étape 3 -> completed après 2s
    setTimeout(() => {
      setSteps(prevSteps => 
        prevSteps.map(step => 
          step.id === '3' 
            ? { ...step, status: 'completed' as const, icon: '✅' }
            : step.id === '4'
            ? { ...step, status: 'active' as const, icon: '⏳' }
            : step
        )
      );
    }, 2000);
    
    // Étape 4 -> completed après 4s
    setTimeout(() => {
      setSteps(prevSteps => 
        prevSteps.map(step => 
          step.id === '4' 
            ? { ...step, status: 'completed' as const, icon: '✅' }
            : step.id === '5'
            ? { ...step, status: 'active' as const, icon: '⏳' }
            : step
        )
      );
    }, 4000);
    
    // Étape 5 -> completed après 6s puis navigation
    setTimeout(() => {
      setSteps(prevSteps => 
        prevSteps.map(step => 
          step.id === '5' 
            ? { ...step, status: 'completed' as const, icon: '✅' }
            : step
        )
      );
      
      // Navigation vers StoryReader après une courte pause
      setTimeout(() => {
        // TODO: Navigation vers StoryReader quand il sera créé
        // navigation.navigate('StoryReader', { ... });
        navigation.goBack(); // Pour l'instant, retour en arrière
      }, 1000);
    }, 6000);
  }, [navigation]);

  useEffect(() => {
    simulateStoryGeneration();
  }, [simulateStoryGeneration]);

  return (
    <LinearGradient 
      colors={[colors.backgroundLoading, colors.backgroundLoadingEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContent}>
          <LoadingLogo
            size={120}
            primaryEmoji="🪄"
            sparkleEmoji="✨"
          />
          
          <Text style={styles.loadingTitle}>Création en cours... ✨</Text>
          <Text style={styles.loadingSubtitle}>
            Notre IA magique prépare une histoire unique pour {heroName} !
          </Text>
          
          <View style={styles.stepsContainer}>
            <GenerationStepsList steps={steps} />
          </View>
        </View>
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
  },
  
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  
  loadingTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.base,
  },
  
  loadingSubtitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl * 2,
    lineHeight: 22,
  },
  
  stepsContainer: {
    width: '100%',
    maxWidth: 400,
  },
});

export default StoryGenerationScreen;