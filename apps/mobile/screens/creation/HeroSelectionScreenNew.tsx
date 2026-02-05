import React, { useState, useMemo } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { GlassInputField } from '@/components/molecules/creation/GlassInputField';
import { AvatarSelector, Avatar } from '@/components/organisms/creation/AvatarSelector';
import { SkinToneSelector, DEFAULT_SKIN_TONE } from '@/components/organisms/creation/SkinToneSelector';
import { PrimaryButton } from '@/components/molecules/creation/PrimaryButton';
import StepIndicator from '@/components/creation/StepIndicator';
import useStoryStore from '@/store/stories/storyStore';
import { useAppTranslation } from '@/hooks/useAppTranslation';

// Avatar base data (without labels - those come from translations)
const AVATAR_BASE_DATA = [
  { id: 'girl', species: 'girl', emoji: '👧', sfSymbol: 'figure.dress.line.vertical.figure' },
  { id: 'boy', species: 'boy', emoji: '👦', sfSymbol: 'figure.arms.open' },
  { id: 'robot', species: 'robot', emoji: '🤖', sfSymbol: 'figure.walk.motion' },
  { id: 'superhero', species: 'superhero', emoji: '🦸‍♂️', sfSymbol: 'bolt.shield.fill' },
  { id: 'superheroine', species: 'superheroine', emoji: '🦸‍♀️', sfSymbol: 'bolt.shield.fill' },
  { id: 'animal', species: 'animal', emoji: '🦊', sfSymbol: 'pawprint.fill' },
] as const;

/**
 * HeroSelectionScreenNew - Écran de sélection du héros (simplifié)
 *
 * Étape 1/4: Nom du héros + sélection d'avatar uniquement.
 * Langue, âge et chapitres ont été déplacés vers l'écran Settings.
 *
 * Route: /stories/creation/hero-selection
 */
export const HeroSelectionScreenNew: React.FC = () => {
  const router = useRouter();
  const { t } = useAppTranslation('stories');
  const { createStoryPayload, setCreateStoryPayload } = useStoryStore();

  // Build avatars with translated labels
  const avatars: Avatar[] = useMemo(() => AVATAR_BASE_DATA.map((avatar) => ({
    ...avatar,
    label: t(`creation.heroSelection.avatars.${avatar.id}`),
  })), [t]);

  const [heroName, setHeroName] = useState(createStoryPayload?.heroName || '');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(
    createStoryPayload?.hero?.id || avatars[0].id // Default to first avatar (girl)
  );
  const [selectedSkinTone, setSelectedSkinTone] = useState<string>(
    createStoryPayload?.hero?.skinTone || DEFAULT_SKIN_TONE
  );
  const [error, setError] = useState('');

  // Human species that support skin tone selection
  const HUMAN_SPECIES = ['girl', 'boy', 'superhero', 'superheroine'];

  // Check if current avatar is a human species
  const selectedAvatar = avatars.find(a => a.id === selectedAvatarId);
  const isHumanSpecies = selectedAvatar && HUMAN_SPECIES.includes(selectedAvatar.species);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    // Validation
    if (!heroName.trim()) {
      setError(t('creation.heroSelection.errors.required'));
      return;
    }

    if (heroName.trim().length < 2) {
      setError(t('creation.heroSelection.errors.tooShort'));
      return;
    }

    if (heroName.trim().length > 30) {
      setError(t('creation.heroSelection.errors.tooLong'));
      return;
    }

    // Find selected avatar
    const avatar = avatars.find(a => a.id === selectedAvatarId);

    // Save to store
    setCreateStoryPayload({
      heroName: heroName.trim(),
      hero: {
        id: avatar!.id,
        species: avatar!.species,
        emoji: avatar!.emoji,
        name: heroName.trim(),
        // Only include skin tone for human species
        skinTone: HUMAN_SPECIES.includes(avatar!.species) ? selectedSkinTone : undefined,
      },
    });

    // Navigate to settings
    router.push('/stories/creation/settings');
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
        keyboardShouldPersistTaps="handled"
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
          <StepIndicator currentStep={1} totalSteps={4} />
        </View>

        {/* Question Container */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>
            {t('creation.heroSelection.title')}
          </Text>
          <Text style={styles.questionHint}>
            {t('creation.heroSelection.subtitle')}
          </Text>

          {/* Hero Name Input */}
          <GlassInputField
            placeholder={t('creation.heroSelection.placeholder')}
            value={heroName}
            onChangeText={(text) => {
              setHeroName(text);
              if (error) setError('');
            }}
            error={error}
            maxLength={30}
            autoCapitalize="words"
            style={styles.input}
          />

          {/* Avatar Selector */}
          <AvatarSelector
            avatars={avatars}
            selectedId={selectedAvatarId}
            onSelect={setSelectedAvatarId}
          />

          {/* Skin Tone Selector (only for human species) */}
          {isHumanSpecies && (
            <SkinToneSelector
              selectedId={selectedSkinTone}
              onSelect={setSelectedSkinTone}
            />
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
              disabled={!heroName.trim() || !selectedAvatarId}
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
    marginBottom: 40,
  },
  questionContainer: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    lineHeight: 36,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  questionHint: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 32,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  input: {
    marginBottom: 8,
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

export default HeroSelectionScreenNew;
