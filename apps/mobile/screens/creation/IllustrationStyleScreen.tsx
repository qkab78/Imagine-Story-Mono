import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { StyleSelectionGrid } from '@/components/organisms/creation/StyleSelectionGrid';
import { PrimaryButton } from '@/components/molecules/creation/PrimaryButton';
import StepIndicator from '@/components/creation/StepIndicator';
import useStoryStore from '@/store/stories/storyStore';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { ILLUSTRATION_STYLES, type IllustrationStyle } from '@/types/creation';

/**
 * IllustrationStyleScreen - Illustration style selection screen
 *
 * Step 3/5: Select the visual style for the story illustrations.
 * Offers 4 distinct art styles for Gemini image generation.
 *
 * Route: /stories/creation/illustration-style
 */
export const IllustrationStyleScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useAppTranslation('stories');
  const { createStoryPayload, setCreateStoryPayload } = useStoryStore();

  const [selectedStyle, setSelectedStyle] = useState<IllustrationStyle | undefined>(
    createStoryPayload?.illustrationStyle || 'japanese-soft'
  );

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (!selectedStyle) {
      return;
    }

    // Save to store
    setCreateStoryPayload({
      illustrationStyle: selectedStyle,
    });

    // Navigate to theme selection
    router.push('/stories/creation/theme-selection');
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
          <StepIndicator currentStep={3} totalSteps={5} />
        </View>

        {/* Styles Container */}
        <View style={styles.stylesContainer}>
          <Text style={styles.pageTitle}>
            {t('creation.illustrationStyle.title', { defaultValue: "Style d'illustration" })}
          </Text>
          <Text style={styles.pageHint}>
            {t('creation.illustrationStyle.subtitle', { defaultValue: 'Choisissez le style artistique de votre histoire' })}
          </Text>

          <StyleSelectionGrid
            options={ILLUSTRATION_STYLES}
            selectedId={selectedStyle}
            onSelect={setSelectedStyle}
          />
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
              disabled={!selectedStyle}
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
  stylesContainer: {
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

export default IllustrationStyleScreen;
