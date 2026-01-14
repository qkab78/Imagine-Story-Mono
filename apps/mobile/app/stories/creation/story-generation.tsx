import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import LoadingLogo from '@/components/creation/LoadingLogo';
import GenerationStepsList, { GenerationStep } from '@/components/creation/GenerationStepsList';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import Text from '@/components/ui/Text';
import { useStoryCreation } from '@/features/stories/hooks/useStoryCreation';
import useStoryStore from '@/store/stories/storyStore';

const STEP_STATUS = {
  COMPLETED: 'completed',
  ACTIVE: 'active',
  PENDING: 'pending',
} as const;

// Visual steps for the interface
const VISUAL_STEPS: GenerationStep[] = [
  { id: '1', title: 'Création du personnage', icon: '✅', status: STEP_STATUS.COMPLETED },
  { id: '2', title: 'Construction de l\'univers', icon: '✅', status: STEP_STATUS.COMPLETED },
  { id: '3', title: 'Génération des illustrations', icon: '⏳', status: STEP_STATUS.ACTIVE },
  { id: '4', title: 'Écriture de l\'histoire', icon: '⭕', status: STEP_STATUS.PENDING },
];

const StoryGenerationScreen: React.FC = () => {
  const { createStoryPayload, resetCreateStoryPayload } = useStoryStore();
  const [steps, setSteps] = useState<GenerationStep[]>(VISUAL_STEPS);
  const [isGenerating, setIsGenerating] = useState(false);

  // Use the useStoryCreation hook instead of direct API call
  const { mutate: createStory, isPending } = useStoryCreation();

  useEffect(() => {
    if (!createStoryPayload || isGenerating) return;

    setIsGenerating(true);

    // Visual progress animation
    let currentStepIndex = 2; // Start at step 3 (index 2)
    const progressInterval = setInterval(() => {
      if (currentStepIndex < VISUAL_STEPS.length) {
        setSteps(prevSteps =>
          prevSteps.map((step, index) => {
            if (index === currentStepIndex) {
              return { ...step, status: STEP_STATUS.COMPLETED, icon: '✅' };
            } else if (index === currentStepIndex + 1 && index < VISUAL_STEPS.length) {
              return { ...step, status: STEP_STATUS.ACTIVE, icon: '⏳' };
            }
            return step;
          })
        );
        currentStepIndex++;
      } else {
        clearInterval(progressInterval);
      }
    }, 1500);

    // Call the use case through the hook
    createStory(createStoryPayload, {
      onSuccess: (response) => {
        clearInterval(progressInterval);
        setSteps(prevSteps =>
          prevSteps.map(step => ({
            ...step,
            status: STEP_STATUS.COMPLETED,
            icon: '✅'
          }))
        );

        Alert.alert(
          'Histoire créée ! 🎉',
          '',
          [
            {
              text: 'Voir l\'histoire',
              onPress: () => {
                resetCreateStoryPayload();
                router.push(`/stories/${response.data.id}/reader`);
              }
            }
          ]
        );
        setIsGenerating(false);
      },
      onError: (error) => {
        clearInterval(progressInterval);
        console.error('Story creation error:', error);
        Alert.alert(
          'Erreur de génération 😕',
          `Une erreur est survenue lors de la création de votre histoire. Voulez-vous réessayer ?`,
          [
            { text: 'Retour', style: 'cancel', onPress: () => router.back() },
            {
              text: 'Réessayer',
              onPress: () => {
                setIsGenerating(false);
                setSteps(VISUAL_STEPS);
              }
            }
          ]
        );
        setIsGenerating(false);
      }
    });
  }, []);

  return (
    <LinearGradient
      colors={[colors.backgroundLoading, colors.backgroundLoadingEnd]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
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
            Notre IA magique prépare une histoire unique pour {createStoryPayload?.heroName} !
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
