import React, { useMemo } from 'react';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { colors } from '@/theme/colors';
import { StoryCreationFormData } from '@/types/creation';
import { Theme } from '@/domain/stories/value-objects/settings/Theme';
import { ThemeSelectionGrid } from '@/components/organisms/creation/ThemeSelectionGrid';
import { StoryCreationLayout } from '@/components/templates/stories/StoryCreationLayout';
import { ScrollView } from 'tamagui';
import { getThemes } from '@/api/stories/storyApi';
import { ThemeLanguageToneMapper } from '@/features/stories/mappers/ThemeLanguageToneMapper';
import useStoryStore from '@/store/stories/storyStore';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import Text from '@/components/ui/Text';

// Emoji mapping for UI display (since backend doesn't return emojis)
const THEME_EMOJIS: Record<string, string> = {
  '1': '🏰',
  '2': '🌊',
  '3': '🌲',
  '4': '🚀',
  '5': '🦕',
  '6': '🏫',
};

// Color mapping for UI display (since backend doesn't return colors)
const THEME_COLORS: Record<string, string> = {
  '1': '#FF6B9D',
  '2': '#2196F3',
  '3': '#4CAF50',
  '4': '#9C27B0',
  '5': '#FF9800',
  '6': '#FFB74D',
};

const ThemeSelectionScreen: React.FC = () => {
  const { setCreateStoryPayload, createStoryPayload } = useStoryStore();

  // Fetch themes from API
  const { data: themeDTOs = [], isLoading, isError } = useQuery({
    queryKey: ['themes'],
    queryFn: getThemes,
  });

  // Map DTOs to domain entities
  const themes = useMemo(
    () => themeDTOs.map(dto => ThemeLanguageToneMapper.themeDTOToDomain(dto)),
    [themeDTOs]
  );

  const { handleSubmit, watch, setValue } = useForm<StoryCreationFormData>({
    defaultValues: {
      theme: createStoryPayload?.theme || undefined,
    }
  });

  const selectedTheme = watch('theme');

  const onSubmit = (data: StoryCreationFormData) => {
    setCreateStoryPayload(data);
    router.push({
      pathname: '/(tabs)/stories/creation/tone-selection',
      params: {
        formData: JSON.stringify(data),
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  // Find the matching domain Theme for the selected theme
  const selectedDomainTheme = selectedTheme
    ? themes.find(t => t.getIdValue() === selectedTheme.id) || null
    : null;

  return (
    <ScrollView>
      <StoryCreationLayout
        currentStep={2}
        totalSteps={3}
        stepTitle="Étape 2 sur 3 • Choisis un thème 🎭"
        onBack={handleBack}
        gradientColors={[colors.backgroundGreen, colors.backgroundGreenEnd]}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accentBlue} />
            <Text style={styles.loadingText}>Chargement des thèmes...</Text>
          </View>
        ) : isError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Impossible de charger les thèmes. Veuillez réessayer.
            </Text>
          </View>
        ) : (
          <ThemeSelectionGrid
            themes={themes}
            themeEmojis={THEME_EMOJIS}
            themeColors={THEME_COLORS}
            selectedTheme={selectedDomainTheme}
            onThemeSelect={(theme: Theme) => {
              // Convert domain Theme to old format for form
              const oldTheme = {
                id: theme.getIdValue(),
                name: theme.getName(),
                description: theme.getDescription(),
                emoji: THEME_EMOJIS[theme.getIdValue()] || '🎭',
                color: THEME_COLORS[theme.getIdValue()] || '#FF6B9D',
              };
              setValue('theme', oldTheme);
            }}
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

export default ThemeSelectionScreen;
