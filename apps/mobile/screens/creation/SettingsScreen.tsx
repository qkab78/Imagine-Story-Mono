import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { GlassSelect, SelectOption } from '@/components/molecules/creation/GlassSelect';
import { PrimaryButton } from '@/components/molecules/creation/PrimaryButton';
import StepIndicator from '@/components/creation/StepIndicator';
import useStoryStore from '@/store/stories/storyStore';
import { getLanguages } from '@/api/stories/storyApi';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import type { LanguageDTO } from '@/api/stories/storyTypes';

// Age icons
const AGE_ICONS: Record<number, string> = {
  3: '👶',
  4: '🧒',
  5: '👦',
  6: '👧',
  7: '🧑',
  8: '👨',
};

// Chapter icons
const CHAPTER_ICONS: Record<number, string> = {
  1: '📖',
  2: '📚',
  3: '📗',
  4: '📘',
  5: '📙',
};

/**
 * SettingsScreen - Écran de configuration de l'histoire
 *
 * Étape 2/4: Langue, âge de l'enfant et nombre de chapitres.
 * Ces paramètres ont été déplacés depuis HeroSelection pour simplifier le workflow.
 *
 * Route: /stories/creation/settings
 */
export const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useAppTranslation('stories');
  const { createStoryPayload, setCreateStoryPayload } = useStoryStore();

  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(
    createStoryPayload?.language?.id || ''
  );
  const [age, setAge] = useState<number | null>(
    createStoryPayload?.age || null
  );
  const [chapters, setChapters] = useState<number | null>(
    createStoryPayload?.numberOfChapters || null
  );

  // Languages from API
  const [languages, setLanguages] = useState<LanguageDTO[]>([]);
  const [languageOptions, setLanguageOptions] = useState<SelectOption[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);

  // Generate translated options
  const ageOptions: SelectOption[] = useMemo(() => [
    { label: t('creation.ages.3'), value: 3, icon: AGE_ICONS[3] },
    { label: t('creation.ages.4'), value: 4, icon: AGE_ICONS[4] },
    { label: t('creation.ages.5'), value: 5, icon: AGE_ICONS[5] },
    { label: t('creation.ages.6'), value: 6, icon: AGE_ICONS[6] },
    { label: t('creation.ages.7'), value: 7, icon: AGE_ICONS[7] },
    { label: t('creation.ages.8'), value: 8, icon: AGE_ICONS[8] },
  ], [t]);

  const chaptersOptions: SelectOption[] = useMemo(() => [
    { label: t('creation.chapters.1'), value: 1, icon: CHAPTER_ICONS[1] },
    { label: t('creation.chapters.2'), value: 2, icon: CHAPTER_ICONS[2] },
    { label: t('creation.chapters.3'), value: 3, icon: CHAPTER_ICONS[3] },
    { label: t('creation.chapters.4'), value: 4, icon: CHAPTER_ICONS[4] },
    { label: t('creation.chapters.5'), value: 5, icon: CHAPTER_ICONS[5] },
  ], [t]);

  // Fetch languages from API on mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setIsLoadingLanguages(true);
        const languagesData = await getLanguages();

        // Store the full language data
        setLanguages(languagesData);

        // Map LanguageDTO to SelectOption
        const options: SelectOption[] = languagesData.map((lang: LanguageDTO) => ({
          label: `${lang.name}`,
          value: lang.id,
          icon: getLanguageFlag(lang.code),
        }));

        setLanguageOptions(options);
      } catch (error) {
        console.error('Error fetching languages:', error);
        // Fallback to empty - user must select a language
        setLanguages([]);
        setLanguageOptions([]);
      } finally {
        setIsLoadingLanguages(false);
      }
    };

    fetchLanguages();
  }, []);

  // Helper function to get flag emoji from language code
  const getLanguageFlag = (code: string): string => {
    const flags: Record<string, string> = {
      FR: '🇫🇷',
      EN: '🇬🇧',
      ES: '🇪🇸',
      PT: '🇵🇹',
      DE: '🇩🇪',
      IT: '🇮🇹',
      NL: '🇳🇱',
      PL: '🇵🇱',
      RU: '🇷🇺',
      TR: '🇹🇷',
      AR: '🇸🇦',
      JA: '🇯🇵',
      LI: '🇨🇩',
    };
    return flags[code] || '🌍';
  };

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    // Validation
    if (!selectedLanguageId || !age || !chapters) {
      return;
    }

    // Find the selected language object
    const selectedLanguage = languages.find((lang) => lang.id === selectedLanguageId);
    if (!selectedLanguage) {
      return;
    }

    // Save to store
    setCreateStoryPayload({
      language: {
        id: selectedLanguage.id,
        name: selectedLanguage.name,
        code: selectedLanguage.code,
        icon: getLanguageFlag(selectedLanguage.code),
      },
      age,
      numberOfChapters: chapters,
    });

    // Navigate to illustration style selection
    router.push('/stories/creation/illustration-style');
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
          <StepIndicator currentStep={2} totalSteps={5} />
        </View>

        {/* Settings Container */}
        <View style={styles.settingsContainer}>
          <Text style={styles.pageTitle}>
            {t('creation.settings.title')}
          </Text>
          <Text style={styles.pageHint}>
            {t('creation.settings.subtitle')}
          </Text>

          {/* Language Select */}
          {isLoadingLanguages ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.forestGreen} />
              <Text style={styles.loadingText}>{t('creation.settings.loadingLanguages')}</Text>
            </View>
          ) : (
            <GlassSelect
              label={t('creation.settings.languageLabel')}
              placeholder={t('creation.settings.languagePlaceholder')}
              options={languageOptions}
              value={selectedLanguageId}
              onValueChange={(value) => setSelectedLanguageId(value as string)}
            />
          )}

          {/* Age Select */}
          <GlassSelect
            label={t('creation.settings.ageLabel')}
            placeholder={t('creation.settings.agePlaceholder')}
            options={ageOptions}
            value={age}
            onValueChange={(value) => setAge(value as number)}
          />

          {/* Chapters Select */}
          <GlassSelect
            label={t('creation.settings.chaptersLabel')}
            placeholder={t('creation.settings.chaptersPlaceholder')}
            options={chaptersOptions}
            value={chapters}
            onValueChange={(value) => setChapters(value as number)}
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
              disabled={!selectedLanguageId || !age || !chapters}
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
  settingsContainer: {
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
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
});

export default SettingsScreen;
