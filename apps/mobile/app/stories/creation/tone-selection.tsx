import React, { useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { colors } from '@/theme/colors';
import { StoryCreationFormData } from '@/types/creation';
import { Tone } from '@/domain/stories/value-objects/settings/Tone';
import { ToneSelectionList } from '@/components/organisms/creation/ToneSelectionList';
import { StoryCreationLayout } from '@/components/templates/stories/StoryCreationLayout';
import { ScrollView } from 'tamagui';
import { getTones } from '@/api/stories/storyApi';
import { ThemeLanguageToneMapper } from '@/features/stories/mappers/ThemeLanguageToneMapper';
import useStoryStore from '@/store/stories/storyStore';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import Text from '@/components/ui/Text';

// Emoji mapping for UI display (since backend doesn't return emojis)
const TONE_EMOJIS: Record<string, string> = {
  '1': '😊',
  '2': '🌙',
  '3': '🔍',
  '4': '⚡',
};

const ToneSelectionScreen: React.FC = () => {
  const { setCreateStoryPayload, createStoryPayload } = useStoryStore();

  // Fetch tones from API
  const { data: toneDTOs = [], isLoading, isError } = useQuery({
    queryKey: ['tones'],
    queryFn: getTones,
  });

  // Map DTOs to domain entities
  const tones = useMemo(
    () => toneDTOs.map(dto => ThemeLanguageToneMapper.toneDTOToDomain(dto)),
    [toneDTOs]
  );

  const { handleSubmit, watch, setValue } = useForm<StoryCreationFormData>({
    defaultValues: {
      tone: createStoryPayload?.tone || undefined,
    }
  });

  const selectedTone = watch('tone');

  const onSubmit = useCallback((data: StoryCreationFormData) => {
    setCreateStoryPayload(data);
    router.push({
      pathname: '/(tabs)/stories/creation/story-generation',
      params: {
        formData: JSON.stringify(data),
      }
    });
  }, [setCreateStoryPayload]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleToneSelect = useCallback((tone: Tone) => {
    // Convert domain Tone to old format for form
    const oldTone = {
      id: tone.getIdValue(),
      title: tone.getName(),
      description: tone.getDescription(),
      emoji: TONE_EMOJIS[tone.getIdValue()] || '🎭',
      mood: 'happy' as const, // Default mood - backend doesn't return this
    };
    setValue('tone', oldTone);
    setCreateStoryPayload({
      ...createStoryPayload!,
      tone: oldTone,
    });
  }, [setValue, createStoryPayload, setCreateStoryPayload]);

  // Find the matching domain Tone for the selected tone
  const selectedDomainTone = selectedTone
    ? tones.find(t => t.getIdValue() === selectedTone.id) || null
    : null;

  return (
    <ScrollView>
      <StoryCreationLayout
        currentStep={3}
        totalSteps={3}
        stepTitle="Étape 3 sur 3 • Choisis l'ambiance 🎭"
        onBack={handleBack}
        gradientColors={[colors.backgroundTone, colors.backgroundToneEnd]}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accentBlue} />
            <Text style={styles.loadingText}>Chargement des ambiances...</Text>
          </View>
        ) : isError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Impossible de charger les ambiances. Veuillez réessayer.
            </Text>
          </View>
        ) : (
          <ToneSelectionList
            tones={tones}
            toneEmojis={TONE_EMOJIS}
            selectedTone={selectedDomainTone}
            onToneSelect={handleToneSelect}
            onCreateStory={handleSubmit(onSubmit)}
          />
        )}
      </StoryCreationLayout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
});

export default ToneSelectionScreen;
