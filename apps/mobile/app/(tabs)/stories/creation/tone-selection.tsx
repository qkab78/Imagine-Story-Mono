import React, { useCallback } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { Tone, TONES, StoryCreationFormData } from '@/types/creation';
import NavHeader from '@/components/creation/NavHeader';
import StepIndicator from '@/components/creation/StepIndicator';
import ToneSelectionCard from '@/components/creation/ToneSelectionCard';
import { ScrollView } from 'tamagui';

const ToneSelectionScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const previousFormData: StoryCreationFormData = JSON.parse(params.formData as string);

  const { handleSubmit, watch, setValue } = useForm<StoryCreationFormData>({
    defaultValues: {
      ...previousFormData,
      tone: TONES[0],
    }
  });

  const selectedTone = watch('tone');

  const onSubmit = useCallback((data: StoryCreationFormData) => {
    router.push({
      pathname: '/(tabs)/stories/creation/story-generation',
      params: {
        formData: JSON.stringify(data),
      }
    });
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleToneSelect = useCallback((tone: Tone) => {
    setValue('tone', tone);
  }, [setValue]);

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
            onCreateStory={handleSubmit(onSubmit)}
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