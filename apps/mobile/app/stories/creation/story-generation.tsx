import React, { useEffect, useState, useMemo } from 'react';
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
import { useAppTranslation } from '@/hooks/useAppTranslation';

const STEP_STATUS = {
  COMPLETED: 'completed',
  ACTIVE: 'active',
  PENDING: 'pending',
} as const;

const StoryGenerationScreen: React.FC = () => {
  const { t } = useAppTranslation('stories');
  const { createStoryPayload, resetCreateStoryPayload } = useStoryStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Use the useStoryCreation hook instead of direct API call
  const { mutate: createStory, isPending } = useStoryCreation();

  // Visual steps for the interface (translated)
  const initialSteps: GenerationStep[] = useMemo(() => [
    { id: '1', title: t('creation.generation.steps.character'), icon: '✅', status: STEP_STATUS.COMPLETED },
    { id: '2', title: t('creation.generation.steps.world'), icon: '✅', status: STEP_STATUS.COMPLETED },
    { id: '3', title: t('creation.generation.steps.illustrations'), icon: '⏳', status: STEP_STATUS.ACTIVE },
    { id: '4', title: t('creation.generation.steps.writing'), icon: '⭕', status: STEP_STATUS.PENDING },
  ], [t]);

  const [steps, setSteps] = useState<GenerationStep[]>(initialSteps);

  useEffect(() => {
    if (!createStoryPayload || isGenerating) return;

    setIsGenerating(true);

    // Visual progress animation
    let currentStepIndex = 2; // Start at step 3 (index 2)
    const progressInterval = setInterval(() => {
      if (currentStepIndex < initialSteps.length) {
        setSteps(prevSteps =>
          prevSteps.map((step, index) => {
            if (index === currentStepIndex) {
              return { ...step, status: STEP_STATUS.COMPLETED, icon: '✅' };
            } else if (index === currentStepIndex + 1 && index < initialSteps.length) {
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
          t('creation.generation.success.title'),
          '',
          [
            {
              text: t('creation.generation.success.viewStory'),
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
          t('creation.generation.error.title'),
          t('creation.generation.error.message'),
          [
            { text: t('creation.generation.error.back'), style: 'cancel', onPress: () => router.back() },
            {
              text: t('creation.generation.error.retry'),
              onPress: () => {
                setIsGenerating(false);
                setSteps(initialSteps);
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

          <Text style={styles.loadingTitle}>{t('creation.generation.loadingTitle')}</Text>
          <Text style={styles.loadingSubtitle}>
            {t('creation.generation.loadingSubtitle', { heroName: createStoryPayload?.heroName })}
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
