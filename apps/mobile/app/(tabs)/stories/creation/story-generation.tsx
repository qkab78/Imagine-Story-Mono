import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView, View, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import LoadingLogo from '@/components/creation/LoadingLogo';
import GenerationStepsList, { GenerationStep } from '@/components/creation/GenerationStepsList';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import Text from '@/components/ui/Text';
import { StoryCreationFormData } from '@/types/creation';
import { createStory } from '@/api/stories';
import { useMutation } from '@tanstack/react-query';
import useAuthStore from '@/store/auth/authStore';
import { ALLOWED_LANGUAGES } from '@imagine-story/api/app/stories/constants/allowed_languages';

const STEP_STATUS = {
  COMPLETED: 'completed',
  ACTIVE: 'active',
  PENDING: 'pending',
} as const;

// Étapes visuelles pour l'interface
const VISUAL_STEPS: GenerationStep[] = [
  { id: '1', title: 'Création du personnage', icon: '✅', status: STEP_STATUS.COMPLETED },
  { id: '2', title: 'Construction de l\'univers', icon: '✅', status: STEP_STATUS.COMPLETED },
  { id: '3', title: 'Écriture de l\'histoire', icon: '⏳', status: STEP_STATUS.ACTIVE },
  { id: '4', title: 'Génération des illustrations', icon: '⭕', status: STEP_STATUS.PENDING },
];

const StoryGenerationScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const formData: StoryCreationFormData = JSON.parse(params.formData as string);
  const { token } = useAuthStore();

  const [steps, setSteps] = useState<GenerationStep[]>(VISUAL_STEPS);
  const [isGenerating, setIsGenerating] = useState(false);
  const { mutate: generateStoryMutation } = useMutation({
    mutationFn: createStory,
  });

  const generateStory = useCallback(async () => {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      // Progression visuelle des étapes
      let currentStepIndex = 2; // Commencer à l'étape 3 (index 2)

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

      // Appel API réel
      const payload = {
        title: `Les Aventures de ${formData.heroName}`,
        synopsis: formData.theme.description,
        theme: formData.theme.name,
        token: token || '',
        protagonist: formData.heroName,
        childAge: formData.age,
        numberOfChapters: formData.numberOfChapters,
        language: formData.language as keyof typeof ALLOWED_LANGUAGES,
        tone: formData.tone.mood,
      }

      // Utiliser une promesse pour gérer l'appel mutation
      generateStoryMutation(payload, {
        onSuccess: (data) => {
          clearInterval(progressInterval);
          // Finaliser toutes les étapes
          setSteps(prevSteps =>
            prevSteps.map(step => ({
              ...step,
              status: STEP_STATUS.COMPLETED,
              icon: '✅'
            }))
          );

          console.log({ data });
          // Attendre un peu avant de naviguer
          Alert.alert(
            'Histoire créée ! 🎉',
            `"${data.title}" a été générée avec succès !`,
            [
              {
                text: 'Voir l\'histoire',
                onPress: () => {
                  router.push({
                    pathname: '/stories/[slug]',
                    params: {
                      slug: data.slug || '',
                    },
                  });
                }
              }
            ]
          );
        },
        onError: (error) => {
          clearInterval(progressInterval);
          console.log('error', error);
          Alert.alert(
            'Erreur de génération 😕',
            `Une erreur est survenue lors de la création de votre histoire. Voulez-vous réessayer ?`,
            [
              { text: 'Retour', style: 'cancel', onPress: () => router.back() },
              { text: 'Réessayer', onPress: () => generateStoryMutation(payload) }
            ]
          );
        }
      });

    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      Alert.alert(
        'Erreur de génération 😕',
        'Une erreur est survenue lors de la création de votre histoire. Voulez-vous réessayer ?',
        [
          { text: 'Retour', style: 'cancel', onPress: () => router.back() },
          { text: 'Réessayer', onPress: () => generateStory() }
        ]
      );
    } finally {
      setIsGenerating(false);
    }
  }, [formData, isGenerating, generateStoryMutation, token]);

  useEffect(() => {
    generateStory();
  }, []);

  return (
    // @ts-ignore
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
            Notre IA magique prépare une histoire unique pour {formData.heroName} !
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