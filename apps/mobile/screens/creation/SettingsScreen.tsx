import React, { useState, useEffect } from 'react';
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
import type { LanguageDTO } from '@/api/stories/storyTypes';

// Options d'âge
const AGE_OPTIONS: SelectOption[] = [
  { label: '3 ans', value: 3, icon: '👶' },
  { label: '4 ans', value: 4, icon: '🧒' },
  { label: '5 ans', value: 5, icon: '👦' },
  { label: '6 ans', value: 6, icon: '👧' },
  { label: '7 ans', value: 7, icon: '🧑' },
  { label: '8 ans', value: 8, icon: '👨' },
];

// Options de chapitres
const CHAPTERS_OPTIONS: SelectOption[] = [
  { label: '1 chapitre', value: 1, icon: '📖' },
  { label: '2 chapitres', value: 2, icon: '📚' },
  { label: '3 chapitres', value: 3, icon: '📗' },
  { label: '4 chapitres', value: 4, icon: '📘' },
  { label: '5 chapitres', value: 5, icon: '📙' },
];

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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <StepIndicator currentStep={2} totalSteps={4} />
        </View>

        {/* Settings Container */}
        <View style={styles.settingsContainer}>
          <Text style={styles.pageTitle}>
            Personnalisons l'histoire
          </Text>
          <Text style={styles.pageHint}>
            Quelques réglages pour adapter le récit
          </Text>

          {/* Language Select */}
          {isLoadingLanguages ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.forestGreen} />
              <Text style={styles.loadingText}>Chargement des langues...</Text>
            </View>
          ) : (
            <GlassSelect
              label="Dans quelle langue ?"
              placeholder="Sélectionnez une langue"
              options={languageOptions}
              value={selectedLanguageId}
              onValueChange={(value) => setSelectedLanguageId(value as string)}
            />
          )}

          {/* Age Select */}
          <GlassSelect
            label="Quel est l'âge de votre enfant ?"
            placeholder="Sélectionnez un âge"
            options={AGE_OPTIONS}
            value={age}
            onValueChange={(value) => setAge(value as number)}
          />

          {/* Chapters Select */}
          <GlassSelect
            label="Combien de chapitres ?"
            placeholder="Sélectionnez le nombre de chapitres"
            options={CHAPTERS_OPTIONS}
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
            <Text style={styles.secondaryButtonText}>Retour</Text>
          </TouchableOpacity>

          <View style={styles.primaryButtonContainer}>
            <PrimaryButton
              title="Continuer"
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
