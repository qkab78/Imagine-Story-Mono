import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { ThemeCard } from '@/components/molecules/creation/ThemeCard';
import { PrimaryButton } from '@/components/molecules/creation/PrimaryButton';
import StepIndicator from '@/components/creation/StepIndicator';
import useStoryStore from '@/store/stories/storyStore';
import { getThemes } from '@/api/stories/storyApi';
import type { ThemeDTO } from '@/api/stories/storyTypes';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { THEME_IMAGES } from '@/constants/themeImages';

// Emoji mapping for themes
const THEME_EMOJIS: Record<string, string> = {
  '1': '🏰',
  '2': '🌊',
  '3': '🌲',
  '4': '🚀',
  '5': '🦕',
  '6': '🏫',
};

// Color mapping for themes
const THEME_COLORS: Record<string, string> = {
  '1': '#FF6B9D',
  '2': '#2196F3',
  '3': '#4CAF50',
  '4': '#9C27B0',
  '5': '#FF9800',
  '6': '#FFB74D',
};

interface ThemeOption extends ThemeDTO {
  emoji: string;
  color: string;
}

/**
 * ThemeSelectionScreenNew - Écran de sélection du thème
 *
 * Étape 3/4: Sélection du thème de l'histoire.
 * Design modernisé avec cartes colorées et animations.
 *
 * Route: /stories/creation/theme-selection
 */
export const ThemeSelectionScreenNew: React.FC = () => {
  const router = useRouter();
  const { t } = useAppTranslation('stories');
  const { createStoryPayload, setCreateStoryPayload } = useStoryStore();

  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(
    createStoryPayload?.theme?.id || null
  );
  const [themes, setThemes] = useState<ThemeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch themes from API
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setIsLoading(true);
        const themesData = await getThemes();

        // Map ThemeDTO to ThemeOption with emojis and colors
        const themesWithVisuals: ThemeOption[] = themesData.map((theme) => ({
          ...theme,
          emoji: THEME_EMOJIS[theme.id] || '🎭',
          color: THEME_COLORS[theme.id] || '#FF6B9D',
        }));

        setThemes(themesWithVisuals);
      } catch (error) {
        console.error('Error fetching themes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (!selectedThemeId) {
      return;
    }

    const selectedTheme = themes.find((t) => t.id === selectedThemeId);
    if (!selectedTheme) {
      return;
    }

    // Save to store
    setCreateStoryPayload({
      theme: {
        id: selectedTheme.id,
        name: selectedTheme.name,
        description: selectedTheme.description,
        key: selectedTheme.key,
        emoji: selectedTheme.emoji,
        color: selectedTheme.color,
      },
    });

    // Navigate to tone selection
    router.push('/stories/creation/tone-selection');
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
          <StepIndicator currentStep={4} totalSteps={5} />
        </View>

        {/* Themes Container */}
        <View style={styles.themesContainer}>
          <Text style={styles.pageTitle}>
            {t('creation.themeSelection.title')}
          </Text>
          <Text style={styles.pageHint}>
            {t('creation.themeSelection.subtitle')}
          </Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.forestGreen} />
              <Text style={styles.loadingText}>{t('creation.themeSelection.loading')}</Text>
            </View>
          ) : (
            <View style={styles.themesGrid}>
              {themes.map((theme, index) => (
                <View key={theme.id} style={styles.themeCardWrapper}>
                  <ThemeCard
                    emoji={theme.emoji}
                    name={theme.name}
                    description={theme.description}
                    color={theme.color}
                    isSelected={theme.id === selectedThemeId}
                    onPress={() => setSelectedThemeId(theme.id)}
                    imageSource={THEME_IMAGES[theme.key]}
                  />
                </View>
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
              disabled={!selectedThemeId}
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
  themesContainer: {
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
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeCardWrapper: {
    width: '48%',
    marginBottom: 16,
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

export default ThemeSelectionScreenNew;
