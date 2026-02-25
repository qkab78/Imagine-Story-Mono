import React, { useState, useMemo } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { colors } from '@/theme/colors';
import { ToneCard } from '@/components/molecules/creation/ToneCard';
import { PrimaryButton } from '@/components/molecules/creation/PrimaryButton';
import StepIndicator from '@/components/creation/StepIndicator';
import useStoryStore from '@/store/stories/storyStore';
import { getTones } from '@/api/stories/storyApi';
import type { ToneDTO } from '@/api/stories/storyTypes';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { TONE_IMAGES } from '@/constants/toneImages';

// Emoji mapping for tones
const TONE_EMOJIS: Record<string, string> = {
  '1': '😊',
  '2': '😂',
  '3': '🥰',
  '4': '🎭',
  '5': '🌟',
  '6': '😌',
};

// Mood mapping for tones
const TONE_MOODS: Record<string, 'happy' | 'calm' | 'mysterious' | 'adventurous'> = {
  '1': 'happy',
  '2': 'happy',
  '3': 'calm',
  '4': 'mysterious',
  '5': 'adventurous',
  '6': 'calm',
};

interface ToneOption extends ToneDTO {
  emoji: string;
  mood: 'happy' | 'calm' | 'mysterious' | 'adventurous';
}

/**
 * ToneSelectionScreenNew - Écran de sélection du ton
 *
 * Étape 4/4: Sélection du ton de l'histoire.
 * Design modernisé avec cartes blanches et animations.
 *
 * Route: /stories/creation/tone-selection
 */
export const ToneSelectionScreenNew: React.FC = () => {
  const router = useRouter();
  const { t } = useAppTranslation('stories');
  const { createStoryPayload, setCreateStoryPayload } = useStoryStore();

  const [selectedToneId, setSelectedToneId] = useState<string | null>(
    createStoryPayload?.tone?.id || null
  );

  // Fetch tones from API with React Query
  const { data: tonesData = [], isLoading } = useQuery<ToneDTO[]>({
    queryKey: ['tones'],
    queryFn: getTones,
  });

  const tones: ToneOption[] = useMemo(() =>
    tonesData.map((tone) => ({
      ...tone,
      emoji: TONE_EMOJIS[tone.id] || '🎭',
      mood: TONE_MOODS[tone.id] || 'happy',
    })),
    [tonesData]
  );

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (!selectedToneId) {
      return;
    }

    const selectedTone = tones.find((t) => t.id === selectedToneId);
    if (!selectedTone) {
      return;
    }

    // Save to store
    setCreateStoryPayload({
      tone: {
        id: selectedTone.id,
        title: selectedTone.name,
        description: selectedTone.description,
        emoji: selectedTone.emoji,
        mood: selectedTone.mood,
      },
    });

    // Navigate to summary/generation
    router.push('/stories/creation/summary');
  };

  return (
    <LinearGradient
      colors={[colors.backgroundHome, colors.backgroundHomeEnd]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={t('creation.back')}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <StepIndicator currentStep={5} totalSteps={5} />
        </View>

        {/* Tones Container */}
        <View style={styles.tonesContainer}>
          <Text style={styles.pageTitle}>
            {t('creation.toneSelection.title')}
          </Text>
          <Text style={styles.pageHint}>
            {t('creation.toneSelection.subtitle')}
          </Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.forestGreen} />
              <Text style={styles.loadingText}>{t('creation.toneSelection.loading')}</Text>
            </View>
          ) : (
            <View style={styles.tonesList}>
              {tones.map((tone) => (
                <ToneCard
                  key={tone.id}
                  emoji={tone.emoji}
                  name={t(`creation.toneSelection.tones.${tone.name.toLowerCase()}.name`, { defaultValue: tone.name })}
                  description={t(`creation.toneSelection.tones.${tone.name.toLowerCase()}.description`, { defaultValue: tone.description })}
                  isSelected={tone.id === selectedToneId}
                  onPress={() => setSelectedToneId(tone.id)}
                  imageSource={TONE_IMAGES[tone.name.toLowerCase()]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Navigation Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleBack}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>{t('creation.back')}</Text>
          </TouchableOpacity>

          <View style={styles.primaryButtonContainer}>
            <PrimaryButton
              title={t('creation.continue')}
              icon="→"
              onPress={handleContinue}
              disabled={!selectedToneId}
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 248, 241, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.deepForest,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  backIcon: {
    fontSize: 24,
    color: colors.forestGreen,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  progressContainer: {
    marginBottom: 32,
  },
  tonesContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    lineHeight: 36,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  pageHint: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 32,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  tonesList: {
    gap: 12,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
    paddingTop: 24,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  primaryButtonContainer: {
    flex: 2,
  },
});

export default ToneSelectionScreenNew;
